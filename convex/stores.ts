import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getActiveStores = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getStoreById = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.storeId);
  },
});

export const getMyStores = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const getStoresByOwner = query({
  args: {
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});

export const createStore = mutation({
  args: {
    sessionToken: v.optional(v.string()),
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
    const { sessionToken, ...storeData } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
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
      imageId: args.imageId as Id<"_storage"> | undefined,
      ownerId: userId,
      location: {
        latitude: args.latitude,
        longitude: args.longitude,
        address: args.address,
        addressAr: args.addressAr,
      },
      rating: 5,
      totalRatings: 0,
      isActive: true,
      isOnline: true,
      subscriptionType: "free",
      commissionRate: 15,
      deliveryFee: args.deliveryFee,
      minOrderAmount: args.minOrderAmount,
      estimatedDeliveryTime: args.estimatedDeliveryTime,
      phone: args.phone || "",
      address: args.address,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return storeId;
  },
});

export const updateStore = mutation({
  args: {
    sessionToken: v.optional(v.string()),
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
    const { sessionToken, storeId, ...updateData } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    if (store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المتجر");
    }

    await ctx.db.patch(storeId, {
      name: updateData.name,
      nameAr: updateData.nameAr,
      description: updateData.description,
      descriptionAr: updateData.descriptionAr,
      category: updateData.category,
      imageUrl: updateData.imageUrl,
      imageId: updateData.imageId as Id<"_storage"> | undefined,
      location: {
        latitude: updateData.latitude,
        longitude: updateData.longitude,
        address: updateData.address,
        addressAr: updateData.addressAr,
      },
      deliveryFee: updateData.deliveryFee,
      minOrderAmount: updateData.minOrderAmount,
      estimatedDeliveryTime: updateData.estimatedDeliveryTime,
      phone: updateData.phone ?? store.phone,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const updateStoreStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, isActive } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    if (store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المتجر");
    }

    await ctx.db.patch(storeId, {
      isActive: isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
