import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// إنشاء طلب جديد
export const createOrder = mutation({
  args: {
    storeId: v.id("stores"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        color: v.optional(v.string()), // لون المنتج المختار
        selectedSize: v.optional(v.string()), // المقاس المختار
      })
    ),
    deliveryLatitude: v.number(),
    deliveryLongitude: v.number(),
    deliveryAddress: v.string(),
    deliveryAddressAr: v.string(),
    paymentMethod: v.string(),
    customerNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || !store.isActive) {
      throw new ConvexError("المتجر غير متاح حالياً");
    }

    // جلب تفاصيل المنتجات وحساب الإجمالي
    const orderItems = [];
    let subtotal = 0;

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new ConvexError(`المنتج غير موجود`);
      }
      if (!product.isAvailable) {
        throw new ConvexError(`المنتج ${product.nameAr} غير متوفر حالياً`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        name: product.name,
        nameAr: product.nameAr,
        quantity: item.quantity,
        price: product.price,
        color: item.color, // لون المنتج المختار
        selectedSize: item.selectedSize, // المقاس المختار
      });
    }

    // التحقق من الحد الأدنى للطلب
    if (subtotal < store.minOrderAmount) {
      throw new ConvexError(
        `الحد الأدنى للطلب هو ${store.minOrderAmount} EGP`
      );
    }

    // جلب بيانات العميل الكاملة
    const customerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!customerProfile) {
      throw new ConvexError("يجب إكمال الملف الشخصي أولاً");
    }

    // جلب بيانات المستخدم للحصول على البريد الإلكتروني
    const user = await ctx.db.get(userId);
    const customerEmail = user?.email;

    const deliveryFee = store.deliveryFee;
    const commission = (subtotal * store.commissionRate) / 100;
    const total = subtotal + deliveryFee;

    // إنشاء رقم الطلب
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId: userId,
      storeId: args.storeId,
      // بيانات العميل الكاملة
      customerInfo: {
        fullName: customerProfile.fullName,
        phone: customerProfile.phone,
        email: customerEmail,
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      commission,
      total,
      status: "pending",
      paymentMethod: args.paymentMethod,
      paymentStatus: args.paymentMethod === "cash" ? "pending" : "pending",
      deliveryLocation: {
        latitude: args.deliveryLatitude,
        longitude: args.deliveryLongitude,
        address: args.deliveryAddress,
        addressAr: args.deliveryAddressAr,
      },
      customerNotes: args.customerNotes,
      estimatedDeliveryTime: store.estimatedDeliveryTime,
    });

    // تحديث عدد الطلبات للمتجر
    await ctx.db.patch(args.storeId, {
      totalOrders: store.totalOrders + 1,
    });

    return { orderId, orderNumber };
  },
});

// الحصول على طلبات العميل
export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", userId))
      .order("desc")
      .collect();

    // جلب بيانات المتاجر لكل طلب
    const ordersWithStores = await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);
        return {
          ...order,
          storeInfo: store ? {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address,
            addressAr: store.location?.addressAr || store.address,
            phone: store.phone,
          } : null,
        };
      })
    );

    return ordersWithStores;
  },
});

// الحصول على طلبات المتجر
export const getStoreOrders = query({
  args: {
    storeId: v.id("stores"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض طلبات هذا المتجر");
    }

    let orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .collect();

    if (args.status) {
      orders = orders.filter((order) => order.status === args.status);
    }

    // جلب بيانات المتاجر لكل طلب
    const ordersWithStores = await Promise.all(
      orders.map(async (order) => {
        return {
          ...order,
          storeInfo: {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address,
            phone: store.phone,
          },
        };
      })
    );

    return ordersWithStores;
  },
});

// تحديث حالة الطلب
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    const store = await ctx.db.get(order.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا الطلب");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    // إنشاء إشعار للعميل
    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Status Update",
      titleAr: "تحديث حالة الطلب",
      message: `Your order ${order.orderNumber} status: ${args.status}`,
      messageAr: `تم تحديث حالة طلبك ${order.orderNumber} إلى: ${getStatusArabic(args.status)}`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    return { success: true };
  },
});

// الحصول على تفاصيل طلب واحد
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // التحقق من الصلاحية
    const store = await ctx.db.get(order.storeId);
    if (order.customerId !== userId && store?.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض هذا الطلب");
    }

    // إضافة بيانات المتجر للطلب
    const orderWithStore = {
      ...order,
      storeInfo: store ? {
        name: store.nameAr,
        nameEn: store.name,
        address: store.address,
        phone: store.phone,
      } : null,
    };

    return orderWithStore;
  },
});

// الحصول على جميع الطلبات (للإدارة)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "admin") {
      throw new ConvexError("ليس لديك صلاحية لعرض جميع الطلبات");
    }

    const orders = await ctx.db.query("orders").order("desc").collect();
    
    // جلب بيانات المتاجر لكل طلب
    const ordersWithStores = await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);
        return {
          ...order,
          storeInfo: store ? {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address,
            addressAr: store.location?.addressAr || store.address,
            phone: store.phone,
          } : null,
        };
      })
    );
    
    return ordersWithStores;
  },
});

// الحصول على طلبات الكابتن
export const getCaptainOrders = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("ليس لديك صلاحية لعرض طلبات التوصيل");
    }

    // جلب الطلبات المخصصة للكابتن + الطلبات المتاحة للقبول
    let [assignedOrders, availableOrders] = await Promise.all([
      // الطلبات المخصصة للكابتن
      ctx.db
        .query("orders")
        .withIndex("by_captain", (q) => q.eq("captainId", userId))
        .order("desc")
        .collect(),
      // الطلبات المتاحة للقبول (pending)
      ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .order("desc")
        .collect()
    ]);

    // دمج الطلبات وإزالة المكرر
    const allOrders = [...assignedOrders];
    const assignedOrderIds = new Set(assignedOrders.map(o => o._id));
    
    // إضافة الطلبات المتاحة غير المخصصة للكابتن
    for (const order of availableOrders) {
      if (!assignedOrderIds.has(order._id)) {
        allOrders.push(order);
      }
    }

    // فلترة حسب الحالة إذا تم تحديدها
    let orders = allOrders;
    if (args.status) {
      orders = orders.filter((order) => order.status === args.status);
    }

    // جلب بيانات المتاجر لكل طلب
    const ordersWithStores = await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);
        return {
          ...order,
          storeInfo: store ? {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address,
            addressAr: store.location?.addressAr || store.address,
            phone: store.phone,
          } : null,
        };
      })
    );

    return ordersWithStores;
  },
});

// تحديث حالة الطلب من الكابتن
export const updateOrderStatusByCaptain = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (order.captainId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا الطلب");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
      actualDeliveryTime: args.status === "delivered" ? Date.now() : order.actualDeliveryTime,
    });

    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Status Update",
      titleAr: "تحديث حالة الطلب",
      message: `Your order ${order.orderNumber} is now ${args.status}`,
      messageAr: `طلبك ${order.orderNumber} الآن ${getStatusArabic(args.status)}`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    return { success: true };
  },
});

// استقبال الطلب من الكابتن
export const acceptOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (order.captainId && order.captainId !== userId) {
      throw new ConvexError("الطلب تم تعيينه لكابتن آخر");
    }

    // تحديث حالة الطلب
    await ctx.db.patch(args.orderId, {
      captainId: userId,
      status: "assigned",
      assignedAt: Date.now(),
    });

    // إشعار للعميل
    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Accepted",
      titleAr: "تم استقبال الطلب",
      message: `Your order ${order.orderNumber} has been accepted by a captain`,
      messageAr: `تم استقبال طلبك ${order.orderNumber} من قبل الكابتن`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    return { success: true };
  },
});

// رفض الطلب من الكابتن
export const rejectOrder = mutation({
  args: {
    orderId: v.id("orders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (order.captainId && order.captainId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لهذا الطلب");
    }

    // تحديث حالة الطلب
    await ctx.db.patch(args.orderId, {
      captainId: undefined,
      status: "pending",
      assignedAt: undefined,
    });

    // إشعار للإدارة - نحتاج نأخذ صاحب المتجر
    const store = await ctx.db.get(order.storeId);
    if (!store?.ownerId) {
      throw new ConvexError("المتجر غير موجود");
    }
    await ctx.db.insert("notifications", {
      userId: store.ownerId, // أو إشعار للإدارة
      title: "Order Rejected",
      titleAr: "تم رفض الطلب",
      message: `Order ${order.orderNumber} was rejected by captain. Reason: ${args.reason || "No reason provided"}`,
      messageAr: `تم رفض الطلب ${order.orderNumber} من قبل الكابتن. السبب: ${args.reason || "لم يتم تحديد سبب"}`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    return { success: true };
  },
});

// إنهاء التوصيل من الكابتن
export const completeOrder = mutation({
  args: {
    orderId: v.id("orders"),
    deliveryNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (order.captainId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لهذا الطلب");
    }

    if (order.status !== "delivering") {
      throw new ConvexError("يجب أن يكون الطلب في حالة التوصيل");
    }

    // تحديث حالة الطلب
    await ctx.db.patch(args.orderId, {
      status: "delivered",
      actualDeliveryTime: Date.now(),
      deliveryNotes: args.deliveryNotes,
    });

    // إشعار للعميل
    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Delivered",
      titleAr: "تم التوصيل بنجاح",
      message: `Your order ${order.orderNumber} has been delivered successfully`,
      messageAr: `تم توصيل طلبك ${order.orderNumber} بنجاح`,
      type: "order_update",
      isRead: false,
      relatedOrderId: args.orderId,
    });

    // تحديث رصيد الكابتن
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      const deliveryFee = order.deliveryFee || 30; // رسوم التوصيل الافتراضية
      
      // تحديث المحفظة
      await ctx.db.patch(profile._id, {
        totalEarnings: (profile.totalEarnings || 0) + deliveryFee,
        lastSeen: Date.now(),
      });

      // إضافة سجل معاملة
      const captainWallet = await ctx.db
        .query("wallets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      
      if (captainWallet) {
        await ctx.db.insert("walletTransactions", {
          userId: userId,
          walletId: captainWallet._id,
          type: "earning",
          amount: deliveryFee,
          description: "Delivery fee",
          descriptionAr: "رسوم التوصيل",
          orderId: args.orderId,
          balance: captainWallet.balance + deliveryFee,
          currency: "EGP",
          createdAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

// دالة مساعدة لترجمة حالة الطلب
function getStatusArabic(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    assigned: "تم التعيين",
    preparing: "قيد التحضير",
    ready: "جاهز للاستلام",
    picked_up: "تم الاستلام",
    delivering: "قيد التوصيل",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return statusMap[status] || status;
}
