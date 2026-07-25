import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// الحصول على المتاجر القريبة بناءً على الموقع
export const getNearbyStores = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radius: v.optional(v.number()), // نصف القطر بالكيلومتر (افتراضي 10 كم)
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const radius = args.radius || 10;
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // حساب المسافة وتصفية المتاجر القريبة
    const nearbyStores = stores
      .map((store) => {
        const distance = calculateDistance(
          args.latitude,
          args.longitude,
          store.location.latitude,
          store.location.longitude
        );
        return { ...store, distance };
      })
      .filter((store) => store.distance <= radius)
      .filter((store) => !args.category || store.category === args.category)
      .sort((a, b) => a.distance - b.distance);

    return nearbyStores;
  },
});

// الحصول على كل المتاجر النشطة
export const getActiveStores = query({
  args: {},
  handler: async (ctx) => {
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return stores;
  },
});

// الحصول على تفاصيل متجر واحد
export const getStoreById = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    return store;
  },
});

// الحصول على متاجر التاجر
export const getMyStores = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const stores = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    return stores;
  },
});

// إنشاء متجر جديد
export const createStore = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    description: v.string(),
    descriptionAr: v.string(),
    descriptionEn: v.optional(v.string()),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    address: v.string(),
    addressAr: v.string(),
    deliveryFee: v.number(),
    minOrderAmount: v.number(),
    estimatedDeliveryTime: v.number(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const storeId = await ctx.db.insert("stores", {
      name: args.name,
      nameAr: args.nameAr,
      nameEn: args.nameEn || args.name,
      description: args.description,
      descriptionAr: args.descriptionAr,
      descriptionEn: args.descriptionEn || args.description,
      category: args.category,
      imageUrl: args.imageUrl,
      imageId: args.imageId,
      ownerId: userId,
      location: {
        latitude: args.latitude,
        longitude: args.longitude,
        address: args.address,
        addressAr: args.addressAr,
      },
      rating: 5.0,
      totalOrders: 0,
      isActive: true,
      subscriptionType: "free",
      commissionRate: 15, // عمولة افتراضية 15%
      deliveryFee: args.deliveryFee,
      minOrderAmount: args.minOrderAmount,
      estimatedDeliveryTime: args.estimatedDeliveryTime,
      phone: args.phone || "",
      address: args.address,
    });

    return storeId;
  },
});

// تحديث بيانات المتجر
export const updateStore = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    address: v.string(),
    addressAr: v.string(),
    deliveryFee: v.number(),
    minOrderAmount: v.number(),
    estimatedDeliveryTime: v.number(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    if (store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المتجر");
    }

    await ctx.db.patch(args.storeId, {
      name: args.name,
      nameAr: args.nameAr,
      description: args.description,
      descriptionAr: args.descriptionAr,
      category: args.category,
      imageUrl: args.imageUrl,
      imageId: args.imageId,
      location: {
        latitude: args.latitude,
        longitude: args.longitude,
        address: args.address,
        addressAr: args.addressAr,
      },
      deliveryFee: args.deliveryFee,
      minOrderAmount: args.minOrderAmount,
      estimatedDeliveryTime: args.estimatedDeliveryTime,
      phone: args.phone || store.phone,
    });

    return { success: true };
  },
});

// تحديث حالة المتجر
export const updateStoreStatus = mutation({
  args: {
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    if (store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المتجر");
    }

    await ctx.db.patch(args.storeId, {
      isActive: args.isActive,
    });

    return { success: true };
  },
});

// توليد رابط رفع صورة المتجر
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// دالة مساعدة لحساب المسافة بين نقطتين (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // تقريب لرقم عشري واحد
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
