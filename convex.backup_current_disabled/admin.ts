import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// تعيين كابتن للطلب
export const assignCaptainToOrder = mutation({
  args: {
    orderId: v.id("orders"),
    captainId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لتعيين الكباتن");

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError("الطلب غير موجود");

    const captainProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.captainId))
      .first();

    if (!captainProfile || captainProfile.role !== "captain")
      throw new ConvexError("المستخدم المحدد ليس كابتن");

    await ctx.db.patch(args.orderId, {
      captainId: args.captainId,
      status: "assigned",
    });

    // جلب بيانات العميل
    const customerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", order.customerId))
      .first();

    const customerInfo = customerProfile ? {
      fullName: customerProfile.fullName,
      phone: customerProfile.phone,
      address: customerProfile.address,
    } : {
      fullName: "عميل",
      phone: order.customerInfo?.phone || "",
      address: order.customerInfo?.address || "",
    };

    // جلب بيانات المتجر
    const store = await ctx.db.get(order.storeId);
    const storeInfo = store ? {
      name: store.nameAr,
      address: store.address || "",
      phone: store.phone || "",
    } : {
      name: "متجر",
      address: "",
      phone: "",
    };

    await ctx.db.insert("notifications", {
      userId: args.captainId,
      title: "New Delivery Assignment",
      titleAr: "طلب توصيل جديد",
      message: `You have been assigned order ${order.orderNumber}`,
      messageAr: `تم تعيينك لتوصيل الطلب ${order.orderNumber}`,
      type: "order_assignment",
      isRead: false,
      relatedOrderId: args.orderId,
      customerInfo: customerInfo,
      storeInfo: storeInfo,
      orderInfo: {
        orderNumber: order.orderNumber,
        total: order.total,
        deliveryAddress: order.deliveryLocation.addressAr,
        itemsCount: order.items.length,
      },
    });

    return { success: true };
  },
});

// الحصول على إحصائيات المنصة
export const getPlatformStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لعرض الإحصائيات");

    const orders = await ctx.db.query("orders").collect();
    const stores = await ctx.db.query("stores").collect();
    const captains = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "captain"))
      .collect();
    const customers = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "customer"))
      .collect();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalCommission = orders.reduce((sum, order) => sum + order.commission, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const activeStores = stores.filter((s) => s.isActive).length;
    const onlineCaptains = captains.filter((c) => c.isOnline).length;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter((o) => o._creationTime > sevenDaysAgo);
    const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);

    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalCommission,
      pendingOrders,
      totalStores: stores.length,
      activeStores,
      totalCaptains: captains.length,
      onlineCaptains,
      totalCustomers: customers.length,
      recentOrders: recentOrders.length,
      recentRevenue,
      statusCounts,
    };
  },
});

// الحصول على جميع المتاجر (للإدارة)
export const getAllStores = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لعرض المتاجر");

    const stores = await ctx.db.query("stores").collect();

    const storesWithOwner = await Promise.all(
      stores.map(async (store) => {
        const ownerProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", store.ownerId))
          .first();
        return { ...store, ownerProfile };
      })
    );

    return storesWithOwner;
  },
});

// تفعيل/تعطيل متجر (للإدارة)
export const toggleStoreActive = mutation({
  args: {
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لتعديل المتاجر");

    const store = await ctx.db.get(args.storeId);
    if (!store) throw new ConvexError("المتجر غير موجود");

    await ctx.db.patch(args.storeId, { isActive: args.isActive });

    await ctx.db.insert("notifications", {
      userId: store.ownerId,
      title: args.isActive ? "Store Activated" : "Store Deactivated",
      titleAr: args.isActive ? "تم تفعيل متجرك" : "تم تعطيل متجرك",
      message: args.isActive
        ? `Your store "${store.name}" has been activated`
        : `Your store "${store.name}" has been deactivated`,
      messageAr: args.isActive
        ? `تم تفعيل متجرك "${store.nameAr}" من قِبل الإدارة`
        : `تم تعطيل متجرك "${store.nameAr}" من قِبل الإدارة`,
      type: "store_update",
      isRead: false,
    });

    return { success: true };
  },
});

// إلغاء طلب (للإدارة)
export const cancelOrder = mutation({
  args: {
    orderId: v.id("orders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لإلغاء الطلبات");

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError("الطلب غير موجود");

    await ctx.db.patch(args.orderId, { status: "cancelled" });

    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Cancelled",
      titleAr: "تم إلغاء طلبك",
      message: `Your order ${order.orderNumber} has been cancelled`,
      messageAr: `تم إلغاء طلبك ${order.orderNumber}`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    return { success: true };
  },
});

// الحصول على إحصائيات التاجر
export const getMerchantStats = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId)
      throw new ConvexError("ليس لديك صلاحية لعرض إحصائيات هذا المتجر");

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");
    const pendingOrders = orders.filter((o) =>
      ["pending", "confirmed", "preparing", "ready"].includes(o.status)
    );

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCommission = deliveredOrders.reduce((sum, o) => sum + o.commission, 0);
    const netRevenue = totalRevenue - totalCommission;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter((o) => o._creationTime > thirtyDaysAgo);
    const recentRevenue = recentOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 0);

    const productSales: Record<string, { name: string; nameAr: string; count: number; revenue: number }> = {};
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        const key = item.productId;
        if (!productSales[key]) {
          productSales[key] = { name: item.name, nameAr: item.nameAr, count: 0, revenue: 0 };
        }
        productSales[key].count += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      cancelledOrders: cancelledOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      totalCommission,
      netRevenue,
      recentOrders: recentOrders.length,
      recentRevenue,
      topProducts,
      statusCounts,
      averageOrderValue: deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0,
    };
  },
});

// جلب كل المستخدمين
export const getAllUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لعرض المستخدمين");

    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("profiles").collect();

    return users.map(user => {
      const userProfile = profiles.find(p => p.userId === user._id);
      return {
        ...user,
        fullName: userProfile?.fullName,
        phone: userProfile?.phone,
        address: userProfile?.address,
        role: userProfile?.role,
        isSuspended: userProfile?.isSuspended || false,
      };
    });
  },
});

// إيقاف/تفعيل مستخدم
export const suspendUser = mutation({
  args: {
    userId: v.id("users"),
    isSuspended: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لإيقاف المستخدمين");

    // التحقق من وجود المستخدم أولاً
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser)
      throw new ConvexError("المستخدم غير موجود");

    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!targetProfile)
      throw new ConvexError("الملف الشخصي للمستخدم غير موجود");

    if (targetProfile.role === "admin")
      throw new ConvexError("لا يمكن إيقاف مدير آخر");

    await ctx.db.patch(targetProfile._id, {
      isSuspended: args.isSuspended,
    });
  },
});

// حذف مستخدم
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لحذف المستخدمين");

    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!targetProfile)
      throw new ConvexError("المستخدم غير موجود");

    if (targetProfile.role === "admin")
      throw new ConvexError("لا يمكن حذف مدير آخر");

    // حذف الطلبات المرتبطة بالمستخدم
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.userId))
      .collect();

    for (const order of orders) {
      await ctx.db.delete(order._id);
    }

    // حذف المتاجر المرتبطة بالتاجر
    if (targetProfile.role === "merchant") {
      const stores = await ctx.db
        .query("stores")
        .withIndex("by_owner", (q) => q.eq("ownerId", args.userId))
        .collect();

      for (const store of stores) {
        // حذف منتجات المتجر
        const products = await ctx.db
          .query("products")
          .withIndex("by_store", (q) => q.eq("storeId", store._id))
          .collect();

        for (const product of products) {
          await ctx.db.delete(product._id);
        }

        await ctx.db.delete(store._id);
      }
    }

    // حذف الملف الشخصي والمستخدم
    await ctx.db.delete(targetProfile._id);
    await ctx.db.delete(args.userId);
  },
});

// جلب كل المنتجات
export const getAllProducts = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لعرض المنتجات");

    return await ctx.db.query("products").collect();
  },
});

// تفعيل/إيقاف منتج
export const toggleProduct = mutation({
  args: {
    productId: v.id("products"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية تعديل المنتجات");

    const product = await ctx.db.get(args.productId);
    if (!product)
      throw new ConvexError("المنتج غير موجود");

    await ctx.db.patch(args.productId, {
      isAvailable: args.isAvailable,
    });
  },
});

// حذف منتج
export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية حذف المنتجات");

    const product = await ctx.db.get(args.productId);
    if (!product)
      throw new ConvexError("المنتج غير موجود");

    await ctx.db.delete(args.productId);
  },
});

// جلب كل الإشعارات
export const getAllNotifications = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية لعرض الإشعارات");

    return await ctx.db.query("notifications").collect();
  },
});

// إرسال إشعار
export const sendNotification = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    targetRole: v.optional(v.string()),
    type: v.union(v.literal("info"), v.literal("success"), v.literal("warning"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية إرسال الإشعارات");

    let targetUsers = [];

    if (args.targetRole) {
      const targetProfiles = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", args.targetRole!))
        .collect();
      targetUsers = targetProfiles.map(p => p.userId);
    } else {
      const allProfiles = await ctx.db.query("profiles").collect();
      targetUsers = allProfiles.map(p => p.userId);
    }

    // إرسال الإشعار لكل مستخدم مستهدف
    for (const targetUserId of targetUsers) {
      await ctx.db.insert("notifications", {
        userId: targetUserId,
        title: args.title,
        titleAr: args.title, // نفس العنوان للعربية
        message: args.message,
        messageAr: args.message, // نفس الرسالة للعربية
        type: args.type,
        isRead: false,
      });
    }
  },
});

// تحديث حالة قراءة الإشعار
export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
    isRead: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية تعديل الإشعارات");

    await ctx.db.patch(args.notificationId, {
      isRead: args.isRead,
    });
  },
});

// حذف إشعار
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("يجب تسجيل الدخول أولاً");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin")
      throw new ConvexError("ليس لديك صلاحية حذف الإشعارات");

    await ctx.db.delete(args.notificationId);
  },
});
