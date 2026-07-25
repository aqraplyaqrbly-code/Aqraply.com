import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// جلب إعدادات النظام
export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("systemSettings").first();
    return settings || null;
  },
});

// تحديث إعدادات النظام
export const updateSettings = mutation({
  args: {
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
    enableUserRegistration: v.optional(v.boolean()),
    allowRegistration: v.optional(v.boolean()),
    enableEmailVerification: v.optional(v.boolean()),
    enablePhoneVerification: v.optional(v.boolean()),
    emailVerificationRequired: v.optional(v.boolean()),
    phoneVerificationRequired: v.optional(v.boolean()),
    requirePhoneVerification: v.optional(v.boolean()),
    commissionRate: v.optional(v.float64()),
    defaultCommissionRate: v.optional(v.float64()),
    captainCommissionRate: v.optional(v.float64()),
    storeApprovalRequired: v.optional(v.boolean()),
    captainApprovalRequired: v.optional(v.boolean()),
    autoAcceptOrders: v.optional(v.boolean()),
    orderTimeoutMinutes: v.optional(v.float64()),
    maxProductsPerStore: v.optional(v.float64()),
    enableReviews: v.optional(v.boolean()),
    enableRatings: v.optional(v.boolean()),
    enableNotifications: v.optional(v.boolean()),
    enableEmailNotifications: v.optional(v.boolean()),
    enableSMSNotifications: v.optional(v.boolean()),
    enablePushNotifications: v.optional(v.boolean()),
    minOrderAmount: v.optional(v.float64()),
    freeDeliveryThreshold: v.optional(v.float64()),
    deliveryFee: v.optional(v.float64()),
    taxRate: v.optional(v.float64()),
    walletPhone: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
    paymentMethods: v.optional(v.object({
      cash: v.optional(v.boolean()),
      card: v.optional(v.boolean()),
      wallet: v.optional(v.boolean()),
    })),
    deliveryOptions: v.optional(v.object({
      standard: v.optional(v.boolean()),
      express: v.optional(v.boolean()),
      scheduled: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const existingSettings = await ctx.db.query("systemSettings").first();
    
    if (existingSettings) {
      // تحديث الإعدادات الموجودة
      await ctx.db.patch(existingSettings._id, args);
      return await ctx.db.get(existingSettings._id);
    } else {
      // إنشاء إعدادات جديدة
      const settingsId = await ctx.db.insert("systemSettings", args);
      return await ctx.db.get(settingsId);
    }
  },
});
