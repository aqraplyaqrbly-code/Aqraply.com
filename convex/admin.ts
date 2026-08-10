import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

type OrderDoc = Doc<"orders">;

async function requireAdmin(ctx: QueryCtx | MutationCtx, sessionToken?: string | null) {
  const userId = await getAuthUserId(ctx, sessionToken);
  if (!userId) {
    throw new ConvexError("يجب تسجيل الدخول أولاً");
  }

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
    throw new ConvexError("ليس لديك صلاحية لهذه العملية");
  }

  return { userId, profile };
}

function orderTotal(order: OrderDoc) {
  return order.total ?? order.totalAmount ?? 0;
}

function orderNumber(order: OrderDoc) {
  return `#${order._id.slice(-6).toUpperCase()}`;
}

function orderCommission(order: OrderDoc, commissionRate = 0.15) {
  return orderTotal(order) * commissionRate;
}

// ─── Platform stats ───────────────────────────────────────────────────────────

export const getPlatformStats = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

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

    const delivered = orders.filter((o) => o.status === "delivered");
    const totalRevenue = delivered.reduce((sum, o) => sum + orderTotal(o), 0);
    const totalCommission = delivered.reduce(
      (sum, o) => sum + orderCommission(o),
      0,
    );
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const activeStores = stores.filter((s) => s.isActive).length;
    const onlineCaptains = captains.filter((c) => c.isOnline).length;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter((o) => o._creationTime > sevenDaysAgo);
    const recentRevenue = recentOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + orderTotal(o), 0);

    const statusCounts = orders.reduce(
      (acc: Record<string, number>, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {},
    );

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

// ─── Stores ───────────────────────────────────────────────────────────────────

export const getAllStores = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const stores = await ctx.db.query("stores").collect();

    return await Promise.all(
      stores.map(async (store) => {
        const ownerProfile = await ctx.db
          .query("profiles")
          .filter((q) => q.eq(q.field("userId"), store.ownerId))
          .first();
        return { ...store, ownerProfile };
      }),
    );
  },
});

export const toggleStoreActive = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, isActive } = args;
    await requireAdmin(ctx, sessionToken);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    await ctx.db.patch(storeId, {
      isActive: isActive,
      updatedAt: Date.now(),
    });

    const ownerUserId = store.ownerId as Id<"users">;
    await ctx.db.insert("notifications", {
      userId: ownerUserId,
      title: isActive ? "Store Activated" : "Store Deactivated",
      titleAr: isActive ? "تم تفعيل متجرك" : "تم تعطيل متجرك",
      message: isActive
        ? `Your store "${store.name}" has been activated`
        : `Your store "${store.name}" has been deactivated`,
      messageAr: isActive
        ? `تم تفعيل متجرك "${store.nameAr}" من قِبل الإدارة`
        : `تم تعطيل متجرك "${store.nameAr}" من قِبل الإدارة`,
      type: "store_update",
      isRead: false,
    });

    return { success: true };
  },
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const assignCaptainToOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    captainId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId, captainId } = args;
    await requireAdmin(ctx, sessionToken);

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    const captainProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", captainId))
      .first();

    if (!captainProfile || captainProfile.role !== "captain") {
      throw new ConvexError("المستخدم المحدد ليس كابتن");
    }

    // Only save captainId, don't change status or send notification
    // Notification will be sent when merchant marks order as ready
    await ctx.db.patch(orderId, {
      captainId: captainProfile._id,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const cancelOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId, reason } = args;
    await requireAdmin(ctx, sessionToken);

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    await ctx.db.patch(orderId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    const customerProfile = await ctx.db.get(order.customerId);
    if (customerProfile) {
      await ctx.db.insert("notifications", {
        userId: customerProfile.userId,
        title: "Order Cancelled",
        titleAr: "تم إلغاء طلبك",
        message: `Your order ${orderNumber(order)} has been cancelled`,
        messageAr: `تم إلغاء طلبك ${orderNumber(order)}`,
        type: "order_update",
        isRead: false,
        relatedOrderId: orderId,
      });
    }

    return { success: true };
  },
});

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("profiles").collect();

    return users.map((user) => {
      const userProfile = profiles.find((p) => p.userId === user._id);
      return {
        ...user,
        fullName: userProfile?.fullName,
        phone: userProfile?.phone,
        address: userProfile?.location?.addressAr ?? userProfile?.address,
        role: userProfile?.role,
        isSuspended: userProfile?.isSuspended ?? false,
      };
    });
  },
});

export const suspendUser = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
    isSuspended: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId, isSuspended } = args;
    await requireAdmin(ctx, sessionToken);

    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!targetProfile) {
      throw new ConvexError("الملف الشخصي للمستخدم غير موجود");
    }

    if (targetProfile.role === "admin") {
      throw new ConvexError("لا يمكن إيقاف مدير آخر");
    }

    await ctx.db.patch(targetProfile._id, {
      isSuspended: isSuspended,
    });
  },
});

export const deleteUser = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId } = args;
    await requireAdmin(ctx, sessionToken);

    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!targetProfile) {
      throw new ConvexError("المستخدم غير موجود");
    }

    if (targetProfile.role === "admin") {
      throw new ConvexError("لا يمكن حذف مدير آخر");
    }

    const customerOrders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", targetProfile._id))
      .collect();

    for (const order of customerOrders) {
      await ctx.db.delete(order._id);
    }

    if (targetProfile.role === "merchant") {
      const stores = await ctx.db
        .query("stores")
        .withIndex("by_owner", (q) => q.eq("ownerId", userId))
        .collect();

      for (const store of stores) {
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

    await ctx.db.delete(targetProfile._id);
    await ctx.db.delete(userId);
  },
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const getAllProducts = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const products = await ctx.db.query("products").collect();

    return await Promise.all(
      products.map(async (product) => {
        const store = await ctx.db.get(product.storeId);
        return {
          ...product,
          storeInfo: store
            ? {
                name: store.name,
                nameEn: store.nameEn,
                address: store.location?.address,
                phone: store.phone,
              }
            : null,
        };
      }),
    );
  },
});

export const toggleProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, isAvailable } = args;
    await requireAdmin(ctx, sessionToken);

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    await ctx.db.patch(productId, {
      isAvailable: isAvailable,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId } = args;
    await requireAdmin(ctx, sessionToken);

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    await ctx.db.delete(productId);
  },
});

export const updateProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    code: v.optional(v.string()),
    weight: v.optional(v.number()),
    preparationTime: v.optional(v.number()),
    quantity: v.optional(v.number()),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(
      v.array(
        v.object({
          label: v.string(),
          name: v.string(),
        }),
      ),
    ),
    images: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, ...updateData } = args;
    await requireAdmin(ctx, sessionToken);

    await ctx.db.patch(productId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

// ─── Notifications ────────────────────────────────────────────────────────────

export const getAllNotifications = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);
    return await ctx.db.query("notifications").collect();
  },
});

export const sendNotification = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    title: v.string(),
    message: v.string(),
    targetRole: v.optional(v.string()),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error"),
    ),
  },
  handler: async (ctx, args) => {
    const { sessionToken, title, message, targetRole, type } = args;
    await requireAdmin(ctx, sessionToken);

    let targetUserIds: Id<"users">[] = [];

    if (targetRole) {
      const role = targetRole as
        | "customer"
        | "merchant"
        | "captain"
        | "admin";
      const targetProfiles = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", role))
        .collect();
      targetUserIds = targetProfiles.map((p) => p.userId);
    } else {
      const allProfiles = await ctx.db.query("profiles").collect();
      targetUserIds = allProfiles.map((p) => p.userId);
    }

    for (const targetUserId of targetUserIds) {
      await ctx.db.insert("notifications", {
        userId: targetUserId,
        title: title,
        titleAr: title,
        message: message,
        messageAr: message,
        type: type,
        isRead: false,
      });
    }
  },
});

export const markNotificationAsRead = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    notificationId: v.id("notifications"),
    isRead: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, notificationId, isRead } = args;
    await requireAdmin(ctx, sessionToken);
    await ctx.db.patch(notificationId, { isRead: isRead });
  },
});

export const deleteNotification = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, notificationId } = args;
    await requireAdmin(ctx, sessionToken);
    await ctx.db.delete(notificationId);
  },
});

// ─── Merchant stats (store owner dashboard) ───────────────────────────────────

export const getMerchantStats = query({
  args: { 
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores") 
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض إحصائيات هذا المتجر");
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", storeId))
      .collect();

    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");
    const pendingOrders = orders.filter((o) =>
      ["pending", "confirmed", "preparing", "ready", "picked_up"].includes(
        o.status,
      ),
    );

    // ✅ استخدام subtotal بدلاً من orderTotal لاستبعاد رسوم التوصيل
    // إذا لم يوجد subtotal، نستخدم total - deliveryFee
    const totalRevenue = deliveredOrders.reduce(
      (sum, o) => {
        if (o.subtotal) return sum + o.subtotal;
        const deliveryFee = o.deliveryFee || 0;
        return sum + (o.total || 0) - deliveryFee;
      },
      0,
    );
    const commissionRate = (store.commissionRate ?? 15) / 100;
    const totalCommission = totalRevenue * commissionRate;
    const netRevenue = totalRevenue - totalCommission;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter((o) => o._creationTime > thirtyDaysAgo);
    const recentRevenue = recentOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => {
        if (o.subtotal) return sum + o.subtotal;
        const deliveryFee = o.deliveryFee || 0;
        return sum + (o.total || 0) - deliveryFee;
      }, 0);

    const productSales: Record<
      string,
      { name: string; nameAr: string; count: number; revenue: number }
    > = {};
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        const key = item.productId;
        if (!productSales[key]) {
          productSales[key] = {
            name: item.name,
            nameAr: item.nameAr,
            count: 0,
            revenue: 0,
          };
        }
        productSales[key].count += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const statusCounts = orders.reduce(
      (acc: Record<string, number>, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {},
    );

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
      averageOrderValue:
        deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0,
    };
  },
});
