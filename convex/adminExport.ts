import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// التحقق من أن المستخدم مدير
const isAdmin = async (ctx: any, sessionToken?: string | null) => {
  const userId = await getAuthUserId(ctx, sessionToken);
  if (!userId) return false;

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  return (profile?.role === "admin" || profile?.role === "owner") && !profile.isSuspended;
};

// تصدير المستخدمين
export const exportUsers = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("profiles").collect();

    const exportData = users.map(user => {
      const profile = profiles.find(p => p.userId === user._id);
      return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        createdAt: user._creationTime,
        profile: profile ? {
          fullName: profile.fullName,
          phone: profile.phone,
          role: profile.role,
          isSuspended: profile.isSuspended,
          address: profile.address,
          registrationDate: profile.registrationDate
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "users"
    };
  },
});

// تصدير المتاجر
export const exportStores = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const stores = await ctx.db.query("stores").collect();
    const profiles = await ctx.db.query("profiles").collect();

    const exportData = stores.map(store => {
      const ownerProfile = profiles.find(p => p.userId === store.ownerId);
      return {
        id: store._id,
        ownerId: store.ownerId,
        name: store.name,
        nameAr: store.nameAr,
        description: store.description,
        descriptionAr: store.descriptionAr,
        address: store.address,
        addressAr: store.location?.addressAr,
        phone: store.phone,
        imageUrl: store.imageUrl,
        imageId: store.imageId,
        isActive: store.isActive,
        isOnline: store.isOnline,
        rating: store.rating,
        totalRatings: store.totalRatings,
        estimatedDeliveryTime: store.estimatedDeliveryTime,
        deliveryFee: store.deliveryFee,
        minOrderAmount: store.minOrderAmount,
        category: store.category,
        commissionRate: store.commissionRate,
        totalOrders: store.totalOrders,
        createdAt: store._creationTime,
        updatedAt: store.updatedAt,
        owner: ownerProfile ? {
          fullName: ownerProfile.fullName,
          email: ownerProfile.email,
          phone: ownerProfile.phone,
          isSuspended: ownerProfile.isSuspended
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "stores"
    };
  },
});

// تصدير المنتجات
export const exportProducts = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const products = await ctx.db.query("products").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = products.map(product => {
      const store = stores.find(s => s._id === product.storeId);
      return {
        id: product._id,
        storeId: product.storeId,
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: product.quantity,
        category: product.category,
        code: product.code,
        sku: product.sku,
        images: product.images,
        imageIds: product.imageIds,
        isAvailable: product.isAvailable,
        rating: product.rating,
        reviewCount: product.reviewCount,
        totalRatings: product.totalRatings,
        createdAt: product._creationTime,
        updatedAt: product.updatedAt,
        store: store ? {
          name: store.name,
          nameAr: store.nameAr,
          phone: store.phone,
          isActive: store.isActive
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "products"
    };
  },
});

// تصدير الطلبات
export const exportOrders = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const orders = await ctx.db.query("orders").collect();
    const profiles = await ctx.db.query("profiles").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = orders.map(order => {
      const customerProfile = profiles.find(p => p._id === order.customerId);
      const store = stores.find(s => s._id === order.storeId);

      return {
        id: order._id,
        customerId: order.customerId,
        storeId: order.storeId,
        captainId: order.captainId,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentReceiptImage: order.paymentReceiptImage,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        total: order.total,
        couponCode: order.couponCode,
        customerLocation: order.customerLocation,
        deliveryInstructions: order.deliveryInstructions,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        actualDeliveryTime: order.actualDeliveryTime,
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customer: customerProfile ? {
          fullName: customerProfile.fullName,
          email: customerProfile.email,
          phone: customerProfile.phone,
          role: customerProfile.role
        } : null,
        store: store ? {
          name: store.name,
          nameAr: store.nameAr,
          phone: store.phone
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "orders"
    };
  },
});

// تصدير الكباتن
export const exportCaptains = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const profiles = await ctx.db.query("profiles").collect();
    const users = await ctx.db.query("users").collect();

    const captains = profiles.filter(p => p.role === "captain");

    const exportData = captains.map(captain => {
      const user = users.find(u => u._id === captain.userId);
      return {
        id: captain._id,
        userId: captain.userId,
        fullName: captain.fullName,
        email: user?.email,
        phone: captain.phone,
        isSuspended: captain.isSuspended,
        address: captain.address,
        vehicleType: captain.vehicleType,
        vehicleNumber: captain.vehicleNumber,
        isOnline: captain.isOnline,
        isActive: captain.isActive,
        createdAt: captain._creationTime,
        user: user ? {
          email: user.email,
          phone: user.phone
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "captains"
    };
  },
});

// تصدير المراجعات
export const exportReviews = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const reviews = await ctx.db.query("reviews").collect();
    const profiles = await ctx.db.query("profiles").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = reviews.map(review => {
      const customerProfile = profiles.find(p => p._id === review.customerId);
      const store = stores.find(s => s._id === review.storeId);

      return {
        id: review._id,
        customerId: review.customerId,
        storeId: review.storeId,
        productId: review.productId,
        orderId: review.orderId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review._creationTime,
        customer: customerProfile ? {
          fullName: customerProfile.fullName,
          email: customerProfile.email,
          phone: customerProfile.phone,
          role: customerProfile.role
        } : null,
        store: store ? {
          name: store.name,
          nameAr: store.nameAr,
          phone: store.phone
        } : null
      };
    });

    return {
      data: exportData,
      count: exportData.length,
      exportedAt: Date.now(),
      type: "reviews"
    };
  },
});

// تصدير المحافظ
export const exportWallets = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const wallets = await ctx.db.query("wallets").collect();
    const transactions = await ctx.db.query("walletTransactions").collect();
    const profiles = await ctx.db.query("profiles").collect();

    const walletData = wallets.map(wallet => {
      const profile = profiles.find(p => p.userId === wallet.userId);
      return {
        id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
        currency: wallet.currency,
        totalEarnings: wallet.totalEarnings,
        totalSpent: wallet.totalSpent,
        createdAt: wallet._creationTime,
        user: profile ? {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          role: profile.role
        } : null
      };
    });

    const transactionData = transactions.map(transaction => {
      const profile = profiles.find(p => p.userId === transaction.userId);
      return {
        id: transaction._id,
        walletId: transaction.walletId,
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        descriptionAr: transaction.descriptionAr,
        balance: transaction.balance,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
        user: profile ? {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          role: profile.role
        } : null
      };
    });

    return {
      wallets: walletData,
      transactions: transactionData,
      walletsCount: walletData.length,
      transactionsCount: transactionData.length,
      exportedAt: Date.now(),
      type: "wallets"
    };
  },
});

// تصدير جميع البيانات
export const exportAllData = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const [
      usersData,
      storesData,
      productsData,
      ordersData,
      profilesData,
      reviewsData,
      walletsData
    ] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("stores").collect(),
      ctx.db.query("products").collect(),
      ctx.db.query("orders").collect(),
      ctx.db.query("profiles").collect(),
      ctx.db.query("reviews").collect(),
      ctx.db.query("wallets").collect()
    ]);

    const captainsData = profilesData.filter(p => p.role === "captain");

    return {
      summary: {
        users: usersData.length,
        stores: storesData.length,
        products: productsData.length,
        orders: ordersData.length,
        captains: captainsData.length,
        reviews: reviewsData.length,
        wallets: walletsData.length,
        exportedAt: Date.now(),
        totalRecords: usersData.length + storesData.length + productsData.length +
                     ordersData.length + captainsData.length + reviewsData.length +
                     walletsData.length
      },
      data: {
        users: usersData,
        stores: storesData,
        products: productsData,
        orders: ordersData,
        captains: captainsData,
        reviews: reviewsData,
        wallets: walletsData
      }
    };
  },
});

// الحصول على إعدادات النظام
export const getSystemSettings = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية عرض الإعدادات");

    // البحث عن إعدادات النظام المحفوظة
    const savedSettings = await ctx.db
      .query("systemSettings")
      .first();

    // إذا كانت هناك إعدادات محفوظة، إرجاعها
    if (savedSettings) {
      return savedSettings;
    }

    // إرجاع الإعدادات الافتراضية إذا لم تكن هناك إعدادات محفوظة
    return {
      siteName: "أقرaply",
      siteNameAr: "عقربلي",
      siteDescription: "منصة توصيل وتسوق متكاملة",
      siteDescriptionAr: "منصة توصيل وتسوق متكاملة",
      contactEmail: "support@aqraply.com",
      contactPhone: "+201234567890",
      address: "القاهرة، مصر",
      currency: "EGP",
      currencySymbol: "ج.م",
      language: "ar",
      timezone: "Africa/Cairo",
      maintenanceMode: false,
      allowRegistration: true,
      emailVerificationRequired: true,
      phoneVerificationRequired: false,
      requirePhoneVerification: false,
      commissionRate: 10,
      defaultCommissionRate: 10,
      captainCommissionRate: 15,
      storeApprovalRequired: true,
      captainApprovalRequired: true,
      autoAcceptOrders: false,
      orderTimeoutMinutes: 15,
      maxProductsPerStore: 100,
      enableReviews: true,
      enableRatings: true,
      enableNotifications: true,
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enablePushNotifications: true,
      minOrderAmount: 50,
      freeDeliveryThreshold: 200,
      deliveryFee: 20,
      taxRate: 14,
      socialLinks: {
        facebook: "https://facebook.com/aqraply",
        twitter: "https://twitter.com/aqraply",
        instagram: "https://instagram.com/aqraply",
        linkedin: "https://linkedin.com/aqraply"
      },
      paymentMethods: {
        cash: true,
        card: true,
        wallet: true
      },
      deliveryOptions: {
        standard: true,
        express: true,
        scheduled: false
      }
    };
  },
});

// تحديث إعدادات النظام
export const updateSystemSettings = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    siteName: v.optional(v.string()),
    siteNameAr: v.optional(v.string()),
    siteDescription: v.optional(v.string()),
    siteDescriptionAr: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    maintenanceMode: v.optional(v.boolean()),
    allowRegistration: v.optional(v.boolean()),
    emailVerificationRequired: v.optional(v.boolean()),
    phoneVerificationRequired: v.optional(v.boolean()),
    requirePhoneVerification: v.optional(v.boolean()),
    commissionRate: v.optional(v.float64()),
    defaultCommissionRate: v.optional(v.number()),
    captainCommissionRate: v.optional(v.number()),
    storeApprovalRequired: v.optional(v.boolean()),
    captainApprovalRequired: v.optional(v.boolean()),
    autoAcceptOrders: v.optional(v.boolean()),
    orderTimeoutMinutes: v.optional(v.number()),
    maxProductsPerStore: v.optional(v.number()),
    enableReviews: v.optional(v.boolean()),
    enableRatings: v.optional(v.boolean()),
    enableNotifications: v.optional(v.boolean()),
    enableEmailNotifications: v.optional(v.boolean()),
    enableSMSNotifications: v.optional(v.boolean()),
    enablePushNotifications: v.optional(v.boolean()),
    minOrderAmount: v.optional(v.number()),
    freeDeliveryThreshold: v.optional(v.number()),
    deliveryFee: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string())
    })),
    paymentMethods: v.optional(v.object({
      cash: v.optional(v.boolean()),
      card: v.optional(v.boolean()),
      wallet: v.optional(v.boolean())
    })),
    deliveryOptions: v.optional(v.object({
      standard: v.optional(v.boolean()),
      express: v.optional(v.boolean()),
      scheduled: v.optional(v.boolean())
    }))
  },
  handler: async (ctx, args) => {
    const { sessionToken, ...settingsData } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية تعديل الإعدادات");

    // البحث عن إعدادات النظام الحالية
    const existingSettings = await ctx.db
      .query("systemSettings")
      .first();

    if (existingSettings) {
      // تحديث الإعدادات الموجودة
      await ctx.db.patch(existingSettings._id, settingsData);
    } else {
      // إنشاء إعدادات جديدة إذا لم تكن موجودة
      await ctx.db.insert("systemSettings", settingsData);
    }

    console.log("Settings updated:", settingsData);
    return { success: true };
  },
});

// حذف الإعدادات القديمة (مؤقت)
export const deleteOldSystemSettings = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية حذف الإعدادات");
    // البحث عن إعدادات النظام الحالية وحذفها
    const existingSettings = await ctx.db
      .query("systemSettings")
      .collect();

    for (const setting of existingSettings) {
      await ctx.db.delete(setting._id);
    }

    console.log("Deleted old system settings");
    return { success: true, deleted: existingSettings.length };
  },
});

// إعادة تعيين الإعدادات
export const resetSystemSettings = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية إعادة تعيين الإعدادات");

    // البحث عن إعدادات النظام الحالية وحذفها
    const existingSettings = await ctx.db
      .query("systemSettings")
      .first();

    if (existingSettings) {
      await ctx.db.delete(existingSettings._id);
    }

    console.log("Settings reset - deleted saved settings");
    return { success: true };
  },
});
