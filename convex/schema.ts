import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    password: v.optional(v.string()), // Legacy field for migration
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("customer"), v.literal("merchant"), v.literal("captain"), v.literal("admin"), v.literal("owner"))),
    isSuspended: v.optional(v.boolean()),
    createdAt: v.optional(v.number()), // Made optional for migration
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_role", ["role"]),

  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("customer"), v.literal("merchant"), v.literal("captain"), v.literal("admin"), v.literal("owner")),
    fullName: v.string(),
    phone: v.string(),
    phoneVerified: v.boolean(),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
    isActive: v.boolean(),
    isOnline: v.boolean(),
    isApproved: v.optional(v.boolean()),
    lastSeen: v.number(),
    connectedAt: v.optional(v.number()), // Timestamp when captain went online
    registrationDate: v.number(),
    location: v.optional(v.object({
      address: v.string(),
      addressAr: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    })),
    isSuspended: v.boolean(),
    suspensionReason: v.optional(v.string()),
    suspensionDate: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    isOwner: v.optional(v.boolean()),
    // Old format fields
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    totalEarnings: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_phone", ["phone"])
    .index("by_role", ["role"])
    .index("by_owner", ["isOwner"]),

  stores: defineTable({
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    categoryId: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    rating: v.number(),
    totalRatings: v.optional(v.number()),
    estimatedDeliveryTime: v.number(),
    deliveryFee: v.number(),
    minOrderAmount: v.number(),
    freeDeliveryThreshold: v.optional(v.number()),
    isActive: v.boolean(),
    isOnline: v.optional(v.boolean()),
    isApproved: v.optional(v.boolean()),
    ownerId: v.optional(v.string()),
    location: v.object({
      address: v.string(),
      addressAr: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    // Old format fields
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    commissionRate: v.optional(v.number()),
    subscriptionType: v.optional(v.string()),
    subscriptionExpiresAt: v.optional(v.number()),
    totalOrders: v.optional(v.number()),
    descriptionEn: v.optional(v.string()),
    nameEn: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_updated", ["updatedAt"]),

  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    categoryId: v.optional(v.string()),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    code: v.optional(v.string()),
    weight: v.optional(v.union(v.number(), v.string())),
    preparationTime: v.optional(v.number()),
    quantity: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    isAvailable: v.boolean(),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    totalRatings: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    // Fields from old data format
    allergens: v.optional(v.array(v.any())),
    certifications: v.optional(v.array(v.any())),
    colors: v.optional(v.array(v.any())),
    keywords: v.optional(v.array(v.any())),
    materials: v.optional(v.array(v.any())),
    sizes: v.optional(v.array(v.any())),
    tags: v.optional(v.array(v.any())),
    isFeatured: v.optional(v.boolean()),
    minStock: v.optional(v.number()),
    sku: v.optional(v.string()),
    stock: v.optional(v.number()),
    unit: v.optional(v.string()),
    unitPrice: v.optional(v.number()),
  })
    .index("by_store", ["storeId"])
    .index("by_category", ["category"])
    .index("by_available", ["isAvailable"])
    .index("by_updated", ["updatedAt"]),

  orders: defineTable({
    customerId: v.id("profiles"),
    storeId: v.id("stores"),
    captainId: v.optional(v.id("profiles")),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      nameAr: v.string(),
      price: v.number(),
      quantity: v.number(),
      imageUrl: v.optional(v.string()),
      color: v.optional(v.string()),
      size: v.optional(v.string()),
      sku: v.optional(v.string()),
      productCode: v.optional(v.string()),
      code: v.optional(v.string()),
    })),
    totalAmount: v.number(),
    deliveryFee: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("picked_up"), v.literal("assigned"), v.literal("delivering"), v.literal("delivered"), v.literal("rejected"), v.literal("cancelled")),
    customerLocation: v.object({
      address: v.string(),
      addressAr: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    deliveryInstructions: v.optional(v.string()),
    paymentMethod: v.union(v.literal("cash"), v.literal("wallet"), v.literal("card")),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    createdAt: v.number(),
    updatedAt: v.number(),
    estimatedDeliveryTime: v.optional(v.number()),
    actualDeliveryTime: v.optional(v.number()),
    pickupTime: v.optional(v.number()),
    deliveryStartTime: v.optional(v.number()),
    subtotal: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.optional(v.number()),
    couponCode: v.optional(v.string()),
    paymentReceiptImage: v.optional(v.string()),
  })
    .index("by_customer", ["customerId"])
    .index("by_store", ["storeId"])
    .index("by_captain", ["captainId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  reviews: defineTable({
    customerId: v.id("profiles"),
    storeId: v.optional(v.id("stores")),
    productId: v.optional(v.id("products")),
    captainId: v.optional(v.id("profiles")),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_customer", ["customerId"])
    .index("by_store", ["storeId"])
    .index("by_product", ["productId"])
    .index("by_captain", ["captainId"])
    .index("by_order", ["orderId"]),

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

  passwordResetTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    isUsed: v.boolean(),
    usedAt: v.optional(v.number()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"])
    .index("by_token_hash", ["tokenHash"])
    .index("by_expires", ["expiresAt"]),

  otpVerifications: defineTable({
    userId: v.id("users"),
    identifier: v.string(), // email or phone
    identifierType: v.union(v.literal("email"), v.literal("phone")),
    otp: v.string(),
    otpHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    attempts: v.number(),
    maxAttempts: v.number(),
    isVerified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_identifier", ["identifier"])
    .index("by_identifier_type", ["identifier", "identifierType"])
    .index("by_expires", ["expiresAt"]),

  securityLogs: defineTable({
    userId: v.optional(v.id("users")),
    eventType: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("password_reset_request"),
      v.literal("password_reset_complete"),
      v.literal("password_change"),
      v.literal("otp_verification"),
      v.literal("failed_login"),
      v.literal("failed_otp"),
      v.literal("account_created"),
      v.literal("account_deleted")
    ),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    details: v.optional(v.string()),
    success: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventType"])
    .index("by_timestamp", ["timestamp"])
    .index("by_user_and_event", ["userId", "eventType"]),

  // System settings table
  systemSettings: defineTable({
    siteName: v.optional(v.string()),
    siteNameAr: v.optional(v.string()),
    siteDescription: v.optional(v.string()),
    siteDescriptionAr: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    supportEmail: v.optional(v.string()),
    supportPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    addressAr: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
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
    socialLinks: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        twitter: v.optional(v.string()),
        instagram: v.optional(v.string()),
        linkedin: v.optional(v.string()),
      }),
    ),
    paymentMethods: v.optional(
      v.object({
        cash: v.optional(v.boolean()),
        card: v.optional(v.boolean()),
        wallet: v.optional(v.boolean()),
      }),
    ),
    deliveryOptions: v.optional(
      v.object({
        standard: v.optional(v.boolean()),
        express: v.optional(v.boolean()),
        scheduled: v.optional(v.boolean()),
      }),
    ),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }),

  // Auth accounts table (required by Convex Auth)
  authAccounts: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    userId: v.id("users"),
    secret: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userIdAndProvider", ["userId", "provider"])
    .index("by_user", ["userId"]),

  // Custom sessions table for custom authentication
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"])
    .index("by_expires", ["expiresAt"]),

  // Auth verification tokens table (legacy / email flows)
  authVerificationTokens: defineTable({
    identifier: v.string(),
    token: v.string(),
    expires: v.number(),
    createdAt: v.optional(v.number()),
  })
    .index("by_identifier_token", ["identifier", "token"]),

  authRefreshTokens: defineTable({
    sessionId: v.union(v.id("sessions"), v.id("authSessions")),
    expirationTime: v.number(),
    firstUsedTime: v.optional(v.number()),
    parentRefreshTokenId: v.optional(v.id("authRefreshTokens")),
  })
    .index("sessionId", ["sessionId"])
    .index("sessionIdAndParentRefreshTokenId", [
      "sessionId",
      "parentRefreshTokenId",
    ]),

  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    provider: v.string(),
    code: v.string(),
    expirationTime: v.number(),
    verifier: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("accountId", ["accountId"])
    .index("code", ["code"]),

  authVerifiers: defineTable({
    sessionId: v.optional(v.id("sessions")),
    signature: v.optional(v.string()),
  }).index("signature", ["signature"]),

  authRateLimits: defineTable({
    identifier: v.string(),
    action: v.string(),
    windowStart: v.number(),
    attempts: v.number(),
  }).index("by_identifier_action", ["identifier", "action"]),

  storeReviews: defineTable({
    storeId: v.id("stores"),
    customerId: v.id("users"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
    isVerified: v.boolean(),
    helpfulCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_store", ["storeId"])
    .index("by_customer", ["customerId"])
    .index("by_order", ["orderId"])
    .index("by_rating", ["rating"]),

  productReviews: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    customerId: v.id("users"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
    isVerified: v.boolean(),
    helpfulCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_product", ["productId"])
    .index("by_store", ["storeId"])
    .index("by_customer", ["customerId"])
    .index("by_order", ["orderId"])
    .index("by_rating", ["rating"]),

  reviewLikes: defineTable({
    reviewId: v.union(v.id("storeReviews"), v.id("productReviews")),
    userId: v.id("users"),
    reviewType: v.union(v.literal("store"), v.literal("product")),
    createdAt: v.number(),
  })
    .index("by_review", ["reviewId"])
    .index("by_user", ["userId"])
    .index("by_review_and_user", ["reviewId", "userId"]),

  wallets: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    currency: v.string(),
    totalEarnings: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
    lastTransactionAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    type: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  walletTransactions: defineTable({
    userId: v.id("users"),
    walletId: v.id("wallets"),
    type: v.string(),
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

  coupons: defineTable({
    code: v.string(),
    storeId: v.optional(v.id("stores")),
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

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    titleAr: v.string(),
    message: v.string(),
    messageAr: v.string(),
    type: v.string(),
    isRead: v.boolean(),
    relatedOrderId: v.optional(v.id("orders")),
  }).index("by_user", ["userId"]),

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

  // Admin permissions table
  adminPermissions: defineTable({
    userId: v.id("users"),
    manage_users: v.boolean(),
    manage_orders: v.boolean(),
    manage_stores: v.boolean(),
    manage_products: v.boolean(),
    manage_captains: v.boolean(),
    manage_notifications: v.boolean(),
    view_reports: v.boolean(),
    manage_settings: v.boolean(),
    view_activity_logs: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"]),
});
