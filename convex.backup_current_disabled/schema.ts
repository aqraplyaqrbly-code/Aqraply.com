import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define your application tables
export const applicationTables = {
  // جدول المستخدمين - نظام المصادقة المخصص
  users: defineTable({
    email: v.string(),
    phone: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    role: v.optional(v.string()),
    isSuspended: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  // جدول الجلسات - نظام المصادقة المخصص
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // جدول الملفات الشخصية
  profiles: defineTable({
    userId: v.id("users"),
    role: v.string(),
    fullName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    phoneVerified: v.boolean(),
    isActive: v.boolean(),
    isOnline: v.boolean(),
    lastSeen: v.number(),
    registrationDate: v.number(),
    // الموقع
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
      address: v.string(),
      addressAr: v.string(),
    })),
    // معلومات إضافية للكابتن
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    imageUrl: v.optional(v.string()), // صورة الملف الشخصي
    // معلومات إضافية للتاجر
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    // معلومات إضافية للعميل
    address: v.optional(v.string()),
    totalEarnings: v.optional(v.number()),
    isSuspended: v.optional(v.boolean()), // حالة الإيقاف
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_phone", ["phone"]),

  // جدول المتاجر
  stores: defineTable({
    name: v.string(),
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    description: v.string(),
    descriptionAr: v.string(),
    descriptionEn: v.optional(v.string()),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.string()), // storage ID or direct URL reference
    ownerId: v.id("users"),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
      address: v.string(),
      addressAr: v.string(),
    }),
    rating: v.number(),
    totalOrders: v.number(),
    isActive: v.boolean(),
    subscriptionType: v.string(),
    subscriptionExpiresAt: v.optional(v.number()),
    commissionRate: v.number(),
    deliveryFee: v.number(),
    minOrderAmount: v.number(),
    estimatedDeliveryTime: v.number(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // جدول المنتجات - مع دعم صور متعددة والمقاسات والألوان وإدارة المخزون
  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    weight: v.optional(v.string()), // الوزن (500g, 1kg, 250ml, إلخ)
    category: v.string(), // فئة المنتج
    subcategory: v.optional(v.string()), // فئة فرعية
    brand: v.optional(v.string()), // العلامة التجارية
    sku: v.optional(v.string()), // رمز المنتج الفريد
    barcode: v.optional(v.string()), // الباركود
    images: v.array(v.string()), // صور المنتج (URLs)
    imageUrl: v.optional(v.string()), // حقل قديم للصورة الواحدة (لدعم المنتجات الموجودة)
    isAvailable: v.boolean(), // توفر المنتج
    isFeatured: v.boolean(), // هل هو منتج مميز
    tags: v.optional(v.array(v.string())), // وسوم للبحث
    nutritionalInfo: v.optional(v.object({
      calories: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
      fiber: v.optional(v.number()),
      sugar: v.optional(v.number()),
    })),
    allergens: v.optional(v.array(v.string())), // مسببات الحساسية
    storageInfo: v.optional(v.object({
      temperature: v.optional(v.string()), // درجة حرارة التخزين
      humidity: v.optional(v.string()), // الرطوبة
      shelfLife: v.optional(v.string()), // مدة الصلاحية
    })),
    stock: v.optional(v.number()), // الكمية المتاحة
    minStock: v.optional(v.number()), // الحد الأدنى للطلب
    maxStock: v.optional(v.number()), // الحد الأقصى للمخزون
    unit: v.optional(v.string()), // وحدة القياس (kg, pieces, liters, etc.)
    unitPrice: v.optional(v.number()), // سعر الوحدة
    bulkPrice: v.optional(v.number()), // سعر الجملة
    bulkMinQuantity: v.optional(v.number()), // الحد الأدنى للجملة
    colors: v.optional(v.array(v.string())), // الألوان المتاحة
    color: v.optional(v.string()), // حقل قديم للألوان (لدعم المنتجات الموجودة)
    sizes: v.optional(v.array(v.object({label: v.string(), name: v.string()}))), // المقاسات المتاحة
    materials: v.optional(v.array(v.string())), // المواد المستخدمة
    origin: v.optional(v.string()), // بلد المنشأ
    preparationTime: v.optional(v.number()), // وقت التحضير بالدقائق
    quantity: v.optional(v.number()), // الكمية المتاحة
    certifications: v.optional(v.array(v.string())), // الشهادات
    rating: v.optional(v.number()), // التقييم
    reviewCount: v.optional(v.number()), // عدد التقييمات
    discountPercentage: v.optional(v.number()), // نسبة الخصم
    discountStartDate: v.optional(v.number()),
    discountEndDate: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
  })
    .index("by_store", ["storeId"])
    .index("by_category", ["category"])
    .index("by_available", ["isAvailable"])
    .index("by_featured", ["isFeatured"])
    .index("by_sku", ["sku"])
    .index("by_price", ["price"]),

  // جدول التقييمات والمراجعات للمتاجر
  storeReviews: defineTable({
    storeId: v.id("stores"),
    customerId: v.id("users"),
    orderId: v.id("orders"),
    rating: v.number(), // 1-5 stars
    comment: v.optional(v.string()),
    isVerified: v.boolean(), // تم التحقق من الشراء
    helpfulCount: v.number(), // عدد الأشخاص الذين وجدوه مفيداً
    createdAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_customer", ["customerId"])
    .index("by_order", ["orderId"])
    .index("by_rating", ["rating"]),

  // جدول التقييمات والمراجعات للمنتجات
  productReviews: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    customerId: v.id("users"),
    orderId: v.id("orders"),
    rating: v.number(), // 1-5 stars
    comment: v.optional(v.string()),
    isVerified: v.boolean(), // تم التحقق من الشراء
    helpfulCount: v.number(), // عدد الأشخاص الذين وجدوه مفيداً
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_store", ["storeId"])
    .index("by_customer", ["customerId"])
    .index("by_order", ["orderId"])
    .index("by_rating", ["rating"]),

  // جدول الطلبات
  orders: defineTable({
    orderNumber: v.string(),
    customerId: v.id("users"),
    storeId: v.id("stores"),
    captainId: v.optional(v.id("users")),
    customerInfo: v.optional(v.object({
      fullName: v.string(),
      phone: v.string(),
      email: v.optional(v.string()),
      address: v.optional(v.string()),
    })),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        nameAr: v.string(),
        quantity: v.number(),
        price: v.number(),
        color: v.optional(v.string()), // لون المنتج المختار
        selectedSize: v.optional(v.string()), // المقاس المختار
      })
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    commission: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    status: v.string(),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    deliveryLocation: v.object({
      latitude: v.number(),
      longitude: v.number(),
      address: v.string(),
      addressAr: v.string(),
    }),
    customerNotes: v.optional(v.string()),
    couponCode: v.optional(v.string()),
    estimatedDeliveryTime: v.optional(v.number()),
    actualDeliveryTime: v.optional(v.number()),
    assignedAt: v.optional(v.number()),
    deliveryNotes: v.optional(v.string()),
    cancelReason: v.optional(v.string()),
  })
    .index("by_customer", ["customerId"])
    .index("by_store", ["storeId"])
    .index("by_captain", ["captainId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),

  // جدول الكابتنز
  captains: defineTable({
    userId: v.id("users"),
    vehicleType: v.string(),
    vehicleNumber: v.string(),
    licenseNumber: v.string(),
    licenseExpiry: v.number(),
    isAvailable: v.boolean(),
    currentLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
    })),
    rating: v.number(),
    totalDeliveries: v.number(),
    totalEarnings: v.number(),
    workingHours: v.object({
      start: v.string(),
      end: v.string(),
      days: v.array(v.string()),
    }),
    preferredAreas: v.array(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_available", ["isAvailable"])
    .index("by_rating", ["rating"]),

  // جدول المحافظ
  wallets: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    totalEarnings: v.number(),
    totalSpent: v.number(),
    currency: v.string(),
    lastTransactionAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"]),

  // جدول الكوبونات
  coupons: defineTable({
    code: v.string(),
    storeId: v.id("stores"),
    discountType: v.string(),
    discountValue: v.number(),
    minOrderAmount: v.number(),
    maxDiscount: v.optional(v.number()),
    usageLimit: v.number(),
    usedCount: v.number(),
    validFrom: v.number(),
    validUntil: v.number(),
    isActive: v.boolean(),
    applicableStores: v.optional(v.array(v.id("stores"))),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),

  // جدول التقييمات
  reviews: defineTable({
    orderId: v.id("orders"),
    customerId: v.id("users"),
    storeId: v.id("stores"),
    captainId: v.optional(v.id("users")),
    storeRating: v.number(),
    captainRating: v.optional(v.number()),
    comment: v.optional(v.string()),
    commentAr: v.optional(v.string()),
  })
    .index("by_order", ["orderId"])
    .index("by_store", ["storeId"])
    .index("by_captain", ["captainId"]),

  // جدول الإشعارات
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    titleAr: v.string(),
    message: v.string(),
    messageAr: v.string(),
    type: v.string(),
    isRead: v.boolean(),
    relatedOrderId: v.optional(v.id("orders")),
    customerInfo: v.optional(v.object({
      fullName: v.string(),
      phone: v.string(),
      address: v.optional(v.string()),
    })),
    orderInfo: v.optional(v.object({
      orderNumber: v.string(),
      total: v.number(),
      deliveryAddress: v.string(),
      itemsCount: v.number(),
    })),
    storeInfo: v.optional(v.object({
      name: v.string(),
      address: v.string(),
      phone: v.string(),
    })),
  }).index("by_user", ["userId"]),

  // جدول باقات الاشتراك
  subscriptionPlans: defineTable({
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    price: v.number(),
    duration: v.number(),
    features: v.array(v.string()),
    featuresAr: v.array(v.string()),
    maxProducts: v.number(),
    commissionRate: v.number(),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    displayOrder: v.number(),
  }).index("by_active", ["isActive"]),

  // جدول اشتراكات المتاجر
  storeSubscriptions: defineTable({
    storeId: v.id("stores"),
    planId: v.id("subscriptionPlans"),
    startDate: v.number(),
    endDate: v.number(),
    status: v.string(),
    autoRenew: v.boolean(),
    paymentStatus: v.string(),
    amount: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_status", ["status"])
    .index("by_end_date", ["endDate"]),

  // جدول العروض الترويجية
  promotions: defineTable({
    storeId: v.id("stores"),
    productId: v.id("products"),
    title: v.string(),
    titleAr: v.string(),
    discountPercentage: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
  })
    .index("by_store", ["storeId"])
    .index("by_product", ["productId"])
    .index("by_active", ["isActive"]),

  // جدول المنتجات المميزة
  featuredProducts: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    position: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
    paymentAmount: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_active", ["isActive"])
    .index("by_position", ["position"]),

  // جدول رموز التحقق عبر الرسائل النصية (OTP)
  phoneOtps: defineTable({
    phone: v.string(),
    code: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    attempts: v.number(),
    verified: v.boolean(),
  })
    .index("by_phone", ["phone"])
    .index("by_phone_and_verified", ["phone", "verified"]),

  // جدول معاملات المحفظة
  walletTransactions: defineTable({
    userId: v.id("users"),
    walletId: v.id("wallets"),
    type: v.string(), // earning, spending, withdrawal
    amount: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
    orderId: v.optional(v.id("orders")),
    balance: v.number(),
    currency: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_wallet", ["walletId"])
    .index("by_type", ["type"])
    .index("by_order", ["orderId"]),

  // جدول إعدادات النظام
  systemSettings: defineTable({
    siteName: v.optional(v.string()),
    siteNameAr: v.optional(v.string()),
    siteDescription: v.optional(v.string()),
    siteDescriptionAr: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    supportEmail: v.optional(v.string()),
    supportPhone: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    termsOfServiceUrl: v.optional(v.string()),
    privacyPolicyUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    addressAr: v.optional(v.string()),
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    maintenanceMode: v.optional(v.boolean()),
    allowRegistration: v.optional(v.boolean()),
    emailVerificationRequired: v.optional(v.boolean()),
    phoneVerificationRequired: v.optional(v.boolean()),
    requirePhoneVerification: v.optional(v.boolean()),
    commissionRate: v.optional(v.number()),
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
    walletPhone: v.optional(v.string()),
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
  }),

  // جدول مواقع المستخدمين
  userLocations: defineTable({
    userId: v.id("users"),
    latitude: v.number(),
    longitude: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),

  // جدول رموز إعادة تعيين كلمة المرور
  passwordResetTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    isUsed: v.boolean(),
    createdAt: v.number(),
    usedAt: v.optional(v.number()),
    email: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_token", ["token"])
    .index("by_expiresAt", ["expiresAt"]),

  // جدول سجل الأمان
  securityLogs: defineTable({
    userId: v.optional(v.id("users")),
    action: v.optional(v.string()), // password_reset, login_attempt, etc.
    timestamp: v.number(),
    details: v.optional(v.any()), // IP, user agent, etc.
    email: v.optional(v.string()),
    eventType: v.optional(v.string()),
    severity: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"])

  };

export default defineSchema({
  ...applicationTables,
});
