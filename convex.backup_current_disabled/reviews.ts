import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// إنشاء مراجعة جديدة للمتجر
export const createStoreReview = mutation({
  args: {
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من أن المستخدم هو صاحب الطلب
    const order = await ctx.db.get(args.orderId);
    if (!order || order.customerId !== userId) {
      throw new ConvexError("لا يمكنك تقييم هذا الطلب");
    }

    // التحقق من أن الطلب مكتمل
    if (order.status !== "delivered") {
      throw new ConvexError("يمكن تقييم الطلبات المكتملة فقط");
    }

    // التحقق من عدم وجود تقييم سابق
    const existingReview = await ctx.db
      .query("storeReviews")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
    
    if (existingReview) {
      throw new ConvexError("لقد قمت بتقييم هذا الطلب من قبل");
    }

    // التحقق من التقييم (1-5)
    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError("التقييم يجب أن يكون بين 1 و 5");
    }

    // إنشاء المراجعة
    const reviewId = await ctx.db.insert("storeReviews", {
      storeId: args.storeId,
      customerId: userId,
      orderId: args.orderId,
      rating: args.rating,
      comment: args.comment,
      isVerified: true,
      helpfulCount: 0,
      createdAt: Date.now(),
    });

    // تحديث متوسط تقييم المتجر
    await updateStoreRating(ctx, args.storeId);

    return reviewId;
  },
});

// إنشاء مراجعة جديدة للمنتج
export const createProductReview = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من أن المستخدم هو صاحب الطلب
    const order = await ctx.db.get(args.orderId);
    if (!order || order.customerId !== userId) {
      throw new ConvexError("لا يمكنك تقييم هذا الطلب");
    }

    // التحقق من أن الطلب مكتمل
    if (order.status !== "delivered") {
      throw new ConvexError("يمكن تقييم الطلبات المكتملة فقط");
    }

    // التحقق من أن المنتج موجود في الطلب
    const productInOrder = order.items.some(item => item.productId === args.productId);
    if (!productInOrder) {
      throw new ConvexError("المنتج غير موجود في هذا الطلب");
    }

    // التحقق من عدم وجود تقييم سابق
    const existingReview = await ctx.db
      .query("productReviews")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();
    
    if (existingReview) {
      throw new ConvexError("لقد قمت بتقييم هذا المنتج من قبل");
    }

    // التحقق من التقييم (1-5)
    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError("التقييم يجب أن يكون بين 1 و 5");
    }

    // إنشاء المراجعة
    const reviewId = await ctx.db.insert("productReviews", {
      productId: args.productId,
      storeId: args.storeId,
      customerId: userId,
      orderId: args.orderId,
      rating: args.rating,
      comment: args.comment,
      isVerified: true,
      helpfulCount: 0,
      createdAt: Date.now(),
    });

    // تحديث متوسط تقييم المنتج
    await updateProductRating(ctx, args.productId);

    return reviewId;
  },
});

// الحصول على مراجعات المتجر
export const getStoreReviews = query({
  args: {
    storeId: v.id("stores"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("storeReviews")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .take(args.limit || 50);

    // جلب بيانات العملاء
    const reviewsWithCustomers = await Promise.all(
      reviews.map(async (review) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", review.customerId))
          .first();
        return {
          ...review,
          customerName: profile?.fullName || "عميل",
        };
      })
    );

    return reviewsWithCustomers;
  },
});

// الحصول على مراجعات المنتج
export const getProductReviews = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("productReviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(args.limit || 50);

    // جلب بيانات العملاء
    const reviewsWithCustomers = await Promise.all(
      reviews.map(async (review) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", review.customerId))
          .first();
        return {
          ...review,
          customerName: profile?.fullName || "عميل",
        };
      })
    );

    return reviewsWithCustomers;
  },
});

// الحصول على تقييمات العميل
export const getCustomerReviews = query({
  args: {
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId || userId !== args.customerId) {
      throw new ConvexError("لا يمكنك عرض تقييمات هذا العميل");
    }

    // جلب تقييمات المتاجر
    const storeReviews = await ctx.db
      .query("storeReviews")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .collect();

    // جلب تقييمات المنتجات
    const productReviews = await ctx.db
      .query("productReviews")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .collect();

    return {
      storeReviews,
      productReviews,
    };
  },
});

// تحديث متوسط تقييم المتجر
async function updateStoreRating(ctx: any, storeId: Id<"stores">) {
  const reviews = await ctx.db
    .query("storeReviews")
    .withIndex("by_store", (q: any) => q.eq("storeId", storeId))
    .collect();

  if (reviews.length === 0) {
    await ctx.db.patch(storeId, { rating: 0 });
    return;
  }

  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await ctx.db.patch(storeId, { rating: averageRating });
}

// تحديث متوسط تقييم المنتج
async function updateProductRating(ctx: any, productId: Id<"products">) {
  const reviews = await ctx.db
    .query("productReviews")
    .withIndex("by_product", (q: any) => q.eq("productId", productId))
    .collect();

  if (reviews.length === 0) {
    await ctx.db.patch(productId, { rating: 0, reviewCount: 0 });
    return;
  }

  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await ctx.db.patch(productId, { 
    rating: averageRating, 
    reviewCount: reviews.length 
  });
}

// تحديث عدد "مفيد" للمراجعة
export const markReviewHelpful = mutation({
  args: {
    reviewId: v.id("storeReviews"),
    reviewType: v.union(v.literal("store"), v.literal("product")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    let review: any;
    if (args.reviewType === "store") {
      review = await ctx.db.get(args.reviewId);
    } else {
      review = await ctx.db.get(args.reviewId);
    }

    if (!review) {
      throw new ConvexError("المراجعة غير موجودة");
    }

    // زيادة عدد "مفيد"
    await ctx.db.patch(args.reviewId, {
      helpfulCount: review.helpfulCount + 1,
    });

    return { success: true };
  },
});
