import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// إنشاء مراجعة جديدة للمتجر
export const createStoreReview = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, orderId, rating, comment } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const order = await ctx.db.get(orderId);
    if (!order || !profile || order.customerId !== profile._id) {
      throw new ConvexError("لا يمكنك تقييم هذا الطلب");
    }

    if (order.status !== "delivered") {
      throw new ConvexError("يمكن تقييم الطلبات المكتملة فقط");
    }

    const existingReview = await ctx.db
      .query("storeReviews")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .first();

    // التحقق من التقييم (1-5)
    if (rating < 1 || rating > 5) {
      throw new ConvexError("التقييم يجب أن يكون بين 1 و 5");
    }

    // إذا كان هناك تقييم سابق، قم بتحديثه
    if (existingReview) {
      await ctx.db.patch(existingReview._id, {
        rating: rating,
        comment: comment,
        updatedAt: Date.now(),
      });

      // تحديث متوسط تقييم المتجر
      await updateStoreRating(ctx, storeId);

      return existingReview._id;
    }

    // إنشاء المراجعة الجديدة
    const reviewId = await ctx.db.insert("storeReviews", {
      storeId: storeId,
      customerId: userId,
      orderId: orderId,
      rating: rating,
      comment: comment,
      isVerified: true,
      helpfulCount: 0,
      createdAt: Date.now(),
    });

    // تحديث متوسط تقييم المتجر
    await updateStoreRating(ctx, storeId);

    return reviewId;
  },
});

// إنشاء مراجعة جديدة للمنتج
export const createProductReview = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    storeId: v.id("stores"),
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, storeId, orderId, rating, comment } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const order = await ctx.db.get(orderId);
    if (!order || !profile || order.customerId !== profile._id) {
      throw new ConvexError("لا يمكنك تقييم هذا الطلب");
    }

    if (order.status !== "delivered") {
      throw new ConvexError("يمكن تقييم الطلبات المكتملة فقط");
    }

    // التحقق من أن المنتج موجود في الطلب
    const productInOrder = order.items.some(item => item.productId === productId);
    if (!productInOrder) {
      throw new ConvexError("المنتج غير موجود في هذا الطلب");
    }

    // التحقق من عدم وجود تقييم سابق
    const existingReview = await ctx.db
      .query("productReviews")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .first();

    // التحقق من التقييم (1-5)
    if (rating < 1 || rating > 5) {
      throw new ConvexError("التقييم يجب أن يكون بين 1 و 5");
    }

    // إذا كان هناك تقييم سابق، قم بتحديثه
    if (existingReview) {
      await ctx.db.patch(existingReview._id, {
        rating: rating,
        comment: comment,
        updatedAt: Date.now(),
      });

      // تحديث متوسط تقييم المنتج
      await updateProductRating(ctx, productId);

      return existingReview._id;
    }

    // إنشاء المراجعة الجديدة
    const reviewId = await ctx.db.insert("productReviews", {
      productId: productId,
      storeId: storeId,
      customerId: userId,
      orderId: orderId,
      rating: rating,
      comment: comment,
      isVerified: true,
      helpfulCount: 0,
      createdAt: Date.now(),
    });

    // تحديث متوسط تقييم المنتج
    await updateProductRating(ctx, productId);

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
    sessionToken: v.optional(v.string()),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, customerId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId || userId !== customerId) {
      throw new ConvexError("لا يمكنك عرض تقييمات هذا العميل");
    }

    // جلب تقييمات المتاجر
    const storeReviews = await ctx.db
      .query("storeReviews")
      .withIndex("by_customer", (q) => q.eq("customerId", customerId))
      .collect();

    // جلب تقييمات المنتجات
    const productReviews = await ctx.db
      .query("productReviews")
      .withIndex("by_customer", (q) => q.eq("customerId", customerId))
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
    sessionToken: v.optional(v.string()),
    reviewId: v.union(v.id("storeReviews"), v.id("productReviews")),
    reviewType: v.union(v.literal("store"), v.literal("product")),
  },
  handler: async (ctx, args) => {
    const { sessionToken, reviewId, reviewType } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من أن المستخدم لم يقم باللايك من قبل
    const existingLike = await ctx.db
      .query("reviewLikes")
      .withIndex("by_review_and_user", (q) =>
        q.eq("reviewId", reviewId).eq("userId", userId)
      )
      .first();

    if (existingLike) {
      // إذا كان قد قام باللايك من قبل، قم بإزالته
      await ctx.db.delete(existingLike._id);

      // إنقاص عدد "مفيد"
      const review = await ctx.db.get(reviewId);
      if (review) {
        await ctx.db.patch(reviewId, {
          helpfulCount: Math.max(0, review.helpfulCount - 1),
        });
      }

      return { success: true, liked: false };
    }

    // إضافة اللايك الجديد
    await ctx.db.insert("reviewLikes", {
      reviewId: reviewId,
      userId: userId,
      reviewType: reviewType,
      createdAt: Date.now(),
    });

    // زيادة عدد "مفيد"
    const review = await ctx.db.get(reviewId);
    if (review) {
      await ctx.db.patch(reviewId, {
        helpfulCount: review.helpfulCount + 1,
      });
    }

    return { success: true, liked: true };
  },
});

// التحقق مما إذا كان المستخدم قد قام باللايك
export const hasUserLikedReview = query({
  args: {
    sessionToken: v.optional(v.string()),
    reviewId: v.union(v.id("storeReviews"), v.id("productReviews")),
  },
  handler: async (ctx, args) => {
    const { sessionToken, reviewId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      return false;
    }

    const existingLike = await ctx.db
      .query("reviewLikes")
      .withIndex("by_review_and_user", (q) =>
        q.eq("reviewId", reviewId).eq("userId", userId)
      )
      .first();

    return !!existingLike;
  },
});
