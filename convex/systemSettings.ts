import { query, mutation, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

const settingsFields = {
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
};

const defaultSettings = {
  siteName: "Aqraply",
  siteNameAr: "أقرابلي",
  siteDescription: "Online all products delivery platform",
  siteDescriptionAr: "منصة توصيل جميع المنتجات عبر الإنترنت",
  contactEmail: "support@aqraply.com",
  contactPhone: "+201234567890",
  supportEmail: "support@aqraply.com",
  supportPhone: "+201234567890",
  address: "القاهرة، مصر",
  addressAr: "القاهرة، مصر",
  currency: "EGP",
  currencySymbol: "EGP",
  language: "ar",
  timezone: "Africa/Cairo",
  maintenanceMode: false,
  allowRegistration: true,
  emailVerificationRequired: false,
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
  walletPhone: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  },
  paymentMethods: {
    cash: true,
    card: true,
    wallet: true,
  },
  deliveryOptions: {
    standard: true,
    express: true,
    scheduled: false,
  },
};

async function requireAdmin(ctx: MutationCtx, sessionToken?: string | null) {
  const userId = await getAuthUserId(ctx, sessionToken);
  if (!userId) {
    throw new ConvexError("يجب تسجيل الدخول أولاً");
  }
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
    throw new ConvexError("ليس لديك صلاحية لتعديل إعدادات النظام");
  }
}

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("systemSettings").first();
    return settings ? { ...defaultSettings, ...settings } : defaultSettings;
  },
});

export const updateSettings = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    ...settingsFields,
  },
  handler: async (ctx, args) => {
    const { sessionToken, ...settingsData } = args;
    await requireAdmin(ctx, sessionToken);

    const patch = { ...settingsData, updatedAt: Date.now() };
    const existingSettings = await ctx.db.query("systemSettings").first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, patch);
      return await ctx.db.get(existingSettings._id);
    }

    const settingsId = await ctx.db.insert("systemSettings", {
      ...defaultSettings,
      ...patch,
      createdAt: Date.now(),
    });
    return await ctx.db.get(settingsId);
  },
});

// تطبيق إعدادات النظام على جميع المتاجر
export const applySettingsToAllStores = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    // جلب إعدادات النظام الحالية
    const systemSettings = await ctx.db.query("systemSettings").first();
    if (!systemSettings) {
      throw new ConvexError("لا توجد إعدادات نظام");
    }

    // جلب جميع المتاجر
    const stores = await ctx.db.query("stores").collect();

    // تحديث كل متجر بالإعدادات الجديدة
    let updatedCount = 0;
    for (const store of stores) {
      const updateData: any = {
        updatedAt: Date.now(),
      };

      // تحديث رسوم التوصيل
      if (systemSettings.deliveryFee !== undefined) {
        updateData.deliveryFee = systemSettings.deliveryFee;
      }

      // تحديث نسبة العمولة
      if (systemSettings.commissionRate !== undefined) {
        updateData.commissionRate = systemSettings.commissionRate;
      }

      // تحديث الحد الأدنى للطلب
      if (systemSettings.minOrderAmount !== undefined) {
        updateData.minOrderAmount = systemSettings.minOrderAmount;
      }

      // تحديث حد التوصيل المجاني
      if (systemSettings.freeDeliveryThreshold !== undefined) {
        updateData.freeDeliveryThreshold = systemSettings.freeDeliveryThreshold;
      }

      await ctx.db.patch(store._id, updateData);
      updatedCount++;
    }

    return { updatedCount, message: `تم تحديث ${updatedCount} متجر` };
  },
});
