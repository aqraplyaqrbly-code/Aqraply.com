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

  return profile?.role === "admin" && !profile.isSuspended;
};

// الحصول على إعدادات النظام
export const getSystemSettings = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية عرض الإعدادات");

    // البحث عن إعدادات النظام في أول ملف تعريف للمدير
    const adminProfile = await ctx.db
      .query("profiles")
      .filter((q: any) => q.eq("role", "admin"))
      .first();

    if (!adminProfile) {
      // إعدادات افتراضية
      return {
        siteName: "أقرaply",
        siteDescription: "منصة توصيل وتسوق متكاملة",
        contactEmail: "support@aqraply.com",
        contactPhone: "+201234567890",
        address: "القاهرة، مصر",
        currency: "EGP",
        language: "ar",
        timezone: "Africa/Cairo",
        maintenanceMode: false,
        allowRegistration: true,
        emailVerificationRequired: true,
        phoneVerificationRequired: false,
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
        defaultDeliveryFee: 20,
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
    }

    // إرجاع إعدادات افتراضية حالياً
    return {
      siteName: "أقرaply",
      siteDescription: "منصة توصيل وتسوق متكاملة",
      contactEmail: "support@aqraply.com",
      contactPhone: "+201234567890",
      address: "القاهرة، مصر",
      currency: "EGP",
      language: "ar",
      timezone: "Africa/Cairo",
      maintenanceMode: false,
      allowRegistration: true,
      emailVerificationRequired: true,
      phoneVerificationRequired: false,
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
      defaultDeliveryFee: 20,
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
    siteDescription: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    currency: v.optional(v.string()),
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    maintenanceMode: v.optional(v.boolean()),
    allowRegistration: v.optional(v.boolean()),
    emailVerificationRequired: v.optional(v.boolean()),
    phoneVerificationRequired: v.optional(v.boolean()),
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
    defaultDeliveryFee: v.optional(v.number()),
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

    // حالياً فقط نجاح العملية
    // في المستقبل يمكن تخزين الإعدادات في مكان مناسب
    return { success: true };
  },
});

// إعادة تعيين الإعدادات
export const resetSystemSettings = mutation({
  handler: async (ctx) => {
    const adminCheck = await isAdmin(ctx);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية إعادة تعيين الإعدادات");

    // حالياً فقط نجاح العملية
    return { success: true };
  },
});
