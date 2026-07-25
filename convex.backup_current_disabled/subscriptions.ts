import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// الحصول على جميع باقات الاشتراك النشطة
export const getActivePlans = query({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return plans.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// الحصول على اشتراك المتجر الحالي
export const getStoreSubscription = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض اشتراك هذا المتجر");
    }

    const subscription = await ctx.db
      .query("storeSubscriptions")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!subscription) {
      return null;
    }

    const plan = await ctx.db.get(subscription.planId);
    return { ...subscription, plan };
  },
});

// الاشتراك في باقة
export const subscribeToPlan = mutation({
  args: {
    storeId: v.id("stores"),
    planId: v.id("subscriptionPlans"),
    autoRenew: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لإدارة اشتراك هذا المتجر");
    }

    const plan = await ctx.db.get(args.planId);
    if (!plan || !plan.isActive) {
      throw new ConvexError("الباقة غير متاحة");
    }

    // إلغاء الاشتراك الحالي إن وجد
    const currentSubscription = await ctx.db
      .query("storeSubscriptions")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (currentSubscription) {
      await ctx.db.patch(currentSubscription._id, {
        status: "cancelled",
      });
    }

    const now = Date.now();
    const endDate = now + plan.duration * 24 * 60 * 60 * 1000;

    // إنشاء اشتراك جديد
    const subscriptionId = await ctx.db.insert("storeSubscriptions", {
      storeId: args.storeId,
      planId: args.planId,
      startDate: now,
      endDate,
      status: "active",
      autoRenew: args.autoRenew,
      paymentStatus: "paid",
      amount: plan.price,
    });

    // تحديث بيانات المتجر
    await ctx.db.patch(args.storeId, {
      subscriptionType: plan.name,
      subscriptionExpiresAt: endDate,
      commissionRate: plan.commissionRate,
    });

    // إنشاء إشعار
    await ctx.db.insert("notifications", {
      userId,
      title: "Subscription Activated",
      titleAr: "تم تفعيل الاشتراك",
      message: `Your subscription to ${plan.name} is now active`,
      messageAr: `تم تفعيل اشتراكك في باقة ${plan.nameAr}`,
      type: "system",
      isRead: false,
    });

    return subscriptionId;
  },
});

// التحقق من انتهاء الاشتراكات (يتم تشغيله دورياً)
export const checkExpiredSubscriptions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSubscriptions = await ctx.db
      .query("storeSubscriptions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const subscription of expiredSubscriptions) {
      if (subscription.endDate < now) {
        await ctx.db.patch(subscription._id, {
          status: "expired",
        });

        const store = await ctx.db.get(subscription.storeId);
        if (store) {
          await ctx.db.patch(subscription.storeId, {
            subscriptionType: "free",
            commissionRate: 15, // العمولة الافتراضية
          });

          // إشعار صاحب المتجر
          await ctx.db.insert("notifications", {
            userId: store.ownerId,
            title: "Subscription Expired",
            titleAr: "انتهى الاشتراك",
            message: "Your subscription has expired. Renew now to continue enjoying premium features.",
            messageAr: "انتهى اشتراكك. جدد الآن للاستمرار في الاستفادة من المميزات",
            type: "system",
            isRead: false,
          });
        }
      }
    }

    return { checked: expiredSubscriptions.length };
  },
});

// إنشاء باقة اشتراك جديدة (للإدارة فقط)
export const createSubscriptionPlan = mutation({
  args: {
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
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من صلاحيات الإدارة
    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile || userProfile.role !== "admin") {
      throw new ConvexError("ليس لديك صلاحية لإنشاء خطط الاشتراك");
    }

    const planId = await ctx.db.insert("subscriptionPlans", {
      name: args.name,
      nameAr: args.nameAr,
      description: args.description,
      descriptionAr: args.descriptionAr,
      price: args.price,
      duration: args.duration,
      features: args.features,
      featuresAr: args.featuresAr,
      maxProducts: args.maxProducts,
      commissionRate: args.commissionRate,
      isFeatured: args.isFeatured,
      isActive: true,
      displayOrder: args.displayOrder,
    });

    return planId;
  },
});
