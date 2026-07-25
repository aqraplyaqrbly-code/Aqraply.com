import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// الحصول على العروض النشطة لمتجر
export const getStorePromotions = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const promotions = await ctx.db
      .query("promotions")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // تصفية العروض السارية فقط
    return promotions.filter(
      (promo) => promo.startDate <= now && promo.endDate >= now
    );
  },
});

// إنشاء عرض ترويجي
export const createPromotion = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    productId: v.id("products"),
    title: v.string(),
    titleAr: v.string(),
    discountPercentage: v.number(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, productId, title, titleAr, discountPercentage, startDate, endDate } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لإنشاء عروض لهذا المتجر");
    }

    const product = await ctx.db.get(productId);
    if (!product || product.storeId !== storeId) {
      throw new ConvexError("المنتج غير موجود أو لا ينتمي لهذا المتجر");
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new ConvexError("نسبة الخصم يجب أن تكون بين 0 و 100");
    }

    const promotionId = await ctx.db.insert("promotions", {
      storeId: storeId,
      productId: productId,
      title: title,
      titleAr: titleAr,
      discountPercentage: discountPercentage,
      startDate: startDate,
      endDate: endDate,
      isActive: true,
    });

    // تحديث سعر المنتج
    const discountedPrice = product.price * (1 - discountPercentage / 100);
    await ctx.db.patch(productId, {
      originalPrice: product.price,
      price: Math.round(discountedPrice * 100) / 100,
    });

    return promotionId;
  },
});

// إلغاء عرض ترويجي
export const cancelPromotion = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    promotionId: v.id("promotions"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, promotionId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const promotion = await ctx.db.get(promotionId);
    if (!promotion) {
      throw new ConvexError("العرض غير موجود");
    }

    const store = await ctx.db.get(promotion.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لإلغاء هذا العرض");
    }

    await ctx.db.patch(promotionId, {
      isActive: false,
    });

    // إعادة السعر الأصلي للمنتج
    const product = await ctx.db.get(promotion.productId);
    if (product && product.originalPrice) {
      await ctx.db.patch(promotion.productId, {
        price: product.originalPrice,
        originalPrice: undefined,
      });
    }

    return { success: true };
  },
});

// الحصول على المنتجات المميزة
export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const featured = await ctx.db
      .query("featuredProducts")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // تصفية المنتجات السارية فقط
    const activeFeatured = featured.filter(
      (item) => item.startDate <= now && item.endDate >= now
    );

    // جلب تفاصيل المنتجات
    const products = await Promise.all(
      activeFeatured.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        const store = product ? await ctx.db.get(product.storeId) : null;
        return { ...item, product, store };
      })
    );

    return products
      .filter((item) => item.product && item.store)
      .sort((a, b) => a.position - b.position);
  },
});

// تمييز منتج (للإدارة أو للمتجر بعد الدفع)
export const featureProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    position: v.number(),
    duration: v.number(), // بالأيام
    paymentAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, position, duration, paymentAmount } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    const store = await ctx.db.get(product.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتمييز هذا المنتج");
    }

    const now = Date.now();
    const endDate = now + duration * 24 * 60 * 60 * 1000;

    const featuredId = await ctx.db.insert("featuredProducts", {
      productId: productId,
      storeId: product.storeId,
      position: position,
      startDate: now,
      endDate,
      isActive: true,
      paymentAmount: paymentAmount,
    });

    // تحديث حالة المنتج
    await ctx.db.patch(productId, {
      isFeatured: true,
    });

    return featuredId;
  },
});

// التحقق من صلاحية كوبون
export const validateCoupon = query({
  args: {
    code: v.string(),
    storeId: v.id("stores"),
    orderAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!coupon) {
      throw new ConvexError("الكوبون غير موجود");
    }

    if (!coupon.isActive) {
      throw new ConvexError("الكوبون غير نشط");
    }

    const now = Date.now();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new ConvexError("الكوبون منتهي الصلاحية");
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new ConvexError("تم استخدام الكوبون بالكامل");
    }

    if (args.orderAmount < coupon.minOrderAmount) {
      throw new ConvexError(
        `الحد الأدنى للطلب هو ${coupon.minOrderAmount} EGP`
      );
    }

    // التحقق من المتاجر المسموح بها
    if (
      coupon.applicableStores &&
      coupon.applicableStores.length > 0 &&
      !coupon.applicableStores.includes(args.storeId)
    ) {
      throw new ConvexError("الكوبون غير صالح لهذا المتجر");
    }

    // حساب الخصم
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (args.orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      coupon,
    };
  },
});

// تطبيق كوبون على طلب
export const applyCoupon = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    code: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, code, orderId } = args;
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
      throw new ConvexError("الطلب غير موجود");
    }

    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .first();

    if (!coupon || !coupon.isActive) {
      throw new ConvexError("الكوبون غير صالح");
    }

    const orderSubtotal = order.subtotal ?? order.totalAmount;

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // تحديث الطلب
    await ctx.db.patch(args.orderId, {
      couponCode: args.code,
      discount: Math.round(discount * 100) / 100,
      subtotal: orderSubtotal,
      total: orderSubtotal + order.deliveryFee - discount,
    });

    // تحديث عدد استخدامات الكوبون
    await ctx.db.patch(coupon._id, {
      usedCount: coupon.usedCount + 1,
    });

    return { success: true, discount };
  },
});
