import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// التحقق من أن المستخدم مدير
const isAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  return profile?.role === "admin" && !profile.isSuspended;
};

// تصدير المستخدمين
export const exportUsers = query({
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("profiles").collect();

    const exportData = users.map(user => {
      const profile = profiles.find(p => p.userId === user._id);
      return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user._creationTime,
        profile: profile ? {
          fullName: profile.fullName,
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const stores = await ctx.db.query("stores").collect();
    const profiles = await ctx.db.query("profiles").collect();

    const exportData = stores.map(store => {
      const ownerProfile = profiles.find(p => p.userId === store.ownerId);
      return {
        id: store._id,
        ownerId: store.ownerId,
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        imageUrl: store.imageUrl,
        isActive: store.isActive,
        rating: store.rating,
        estimatedDeliveryTime: store.estimatedDeliveryTime,
        createdAt: store._creationTime,
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const products = await ctx.db.query("products").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = products.map(product => {
      const store = stores.find(s => s._id === product.storeId);
      return {
        id: product._id,
        storeId: product.storeId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        images: product.images,
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        rating: product.rating,
        createdAt: product._creationTime,
        store: store ? {
          name: store.name,
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const orders = await ctx.db.query("orders").collect();
    const users = await ctx.db.query("users").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = orders.map(order => {
      const customer = users.find(u => u._id === order.customerId);
      const store = stores.find(s => s._id === order.storeId);
      
      return {
        id: order._id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        storeId: order.storeId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        deliveryLocation: order.deliveryLocation,
        createdAt: order._creationTime,
        customer: customer ? {
          email: customer.email,
          phone: customer.phone,
          role: customer.role
        } : null,
        store: store ? {
          name: store.name,
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
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
        role: user?.role,
        phone: captain.phone,
        isSuspended: captain.isSuspended,
        address: captain.address,
        vehicleType: captain.vehicleType,
        vehicleNumber: captain.vehicleNumber,
        isOnline: captain.isOnline,
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const reviews = await ctx.db.query("reviews").collect();
    const users = await ctx.db.query("users").collect();
    const stores = await ctx.db.query("stores").collect();

    const exportData = reviews.map(review => {
      const user = users.find(u => u._id === review.customerId);
      const store = stores.find(s => s._id === review.storeId);
      
      return {
        id: review._id,
        customerId: review.customerId,
        storeId: review.storeId,
        orderId: review.orderId,
        storeRating: review.storeRating,
        captainRating: review.captainRating,
        comment: review.comment,
        commentAr: review.commentAr,
        createdAt: review._creationTime,
        user: user ? {
          email: user.email,
          role: user.role
        } : null,
        store: store ? {
          name: store.name
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتصدير البيانات");

    const wallets = await ctx.db.query("wallets").collect();
    const transactions = await ctx.db.query("walletTransactions").collect();
    const users = await ctx.db.query("users").collect();

    const walletData = wallets.map(wallet => {
      const user = users.find(u => u._id === wallet.userId);
      return {
        id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
        currency: wallet.currency,
        totalEarnings: wallet.totalEarnings,
        totalSpent: wallet.totalSpent,
        createdAt: wallet._creationTime,
        user: user ? {
          email: user.email,
          role: user.role
        } : null
      };
    });

    const transactionData = transactions.map(transaction => {
      const user = users.find(u => u._id === transaction.userId);
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
        user: user ? {
          email: user.email,
          role: user.role
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
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
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية تعديل الإعدادات");

    // البحث عن إعدادات النظام الحالية
    const existingSettings = await ctx.db
      .query("systemSettings")
      .first();

    if (existingSettings) {
      // تحديث الإعدادات الموجودة
      await ctx.db.patch(existingSettings._id, args);
    } else {
      // إنشاء إعدادات جديدة إذا لم تكن موجودة
      await ctx.db.insert("systemSettings", args);
    }

    console.log("Settings updated:", args);
    return { success: true };
  },
});

// حذف الإعدادات القديمة (مؤقت)
export const deleteOldSystemSettings = mutation({
  handler: async (ctx) => {
    // const adminCheck = await isAdmin(ctx);
    // if (!adminCheck) throw new ConvexError("ليس لديك صلاحية حذف الإعدادات");

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
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
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
