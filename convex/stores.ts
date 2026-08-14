import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { checkRateLimit } from "./rateLimit";

export const getActiveStores = query({
  handler: async (ctx) => {
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // Convert imageId to imageUrl for all stores
    return await Promise.all(
      stores.map(async (store) => {
        let imageUrl = store.imageUrl;
        if (store.imageId && !imageUrl) {
          try {
            const url = await ctx.storage.getUrl(store.imageId);
            imageUrl = url || undefined;
          } catch (error) {
            console.error("Failed to get image URL:", error);
          }
        }
        return {
          ...store,
          imageUrl: imageUrl || store.imageUrl,
        };
      })
    );
  },
});

export const getStoreById = query({
  args: {
    storeId: v.id("stores"),
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return null;
    }

    const userId = await getAuthUserId(ctx, args.sessionToken);
    
    // Check if user is authorized (store owner or admin)
    let isAuthorized = false;
    if (userId) {
      const userProfile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      
      const isAdminOrOwner = userProfile && 
        (userProfile.role === "admin" || userProfile.role === "owner" || userProfile.isOwner);
      const isStoreOwner = store.ownerId === userId;
      
      isAuthorized = isAdminOrOwner || isStoreOwner;
    }

    // Convert imageId to imageUrl if it exists
    let imageUrl = store.imageUrl;
    if (store.imageId && !imageUrl) {
      try {
        const url = await ctx.storage.getUrl(store.imageId);
        imageUrl = url || undefined;
      } catch (error) {
        console.error("Failed to get image URL:", error);
      }
    }

    // Return public data for everyone, sensitive data only for authorized users
    const publicData = {
      _id: store._id,
      name: store.name,
      nameAr: store.nameAr,
      description: store.description,
      descriptionAr: store.descriptionAr,
      category: store.category,
      imageUrl: imageUrl || store.imageUrl,
      rating: store.rating,
      isActive: store.isActive,
      location: {
        address: store.location.address,
        addressAr: store.location.addressAr,
        // Hide detailed coordinates for public access
        latitude: isAuthorized ? store.location.latitude : null,
        longitude: isAuthorized ? store.location.longitude : null,
      },
      // Hide sensitive data for public access
      phone: isAuthorized ? store.phone : null,
      ownerId: isAuthorized ? store.ownerId : null,
      commissionRate: isAuthorized ? store.commissionRate : null,
      subscriptionType: isAuthorized ? store.subscriptionType : null,
      createdAt: store.createdAt,
    };

    return publicData;
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
    sessionToken: v.optional(v.string()),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin/owner or the owner being requested
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const isAdminOrOwner = profile && 
      (profile.role === "admin" || profile.role === "owner" || profile.isOwner);
    
    // Only allow access if user is admin/owner or requesting their own stores
    if (!isAdminOrOwner && args.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض هذه المتاجر");
    }

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

    // Rate limiting: 1 store per day per user
    await checkRateLimit(ctx, userId.toString(), "createStore", 1, 24 * 60 * 60 * 1000);

    // Check if store approval is required from system settings
    const systemSettings = await ctx.db.query("systemSettings").first();
    const requireApproval = systemSettings?.storeApprovalRequired ?? true;

    // Price validation
    if (args.deliveryFee < 0) {
      throw new ConvexError("رسوم التوصيل يجب أن تكون أكبر من أو تساوي صفر");
    }
    if (args.minOrderAmount < 0) {
      throw new ConvexError("الحد الأدنى للطلب يجب أن يكون أكبر من أو يساوي صفر");
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
      isActive: !requireApproval, // Only active if approval not required
      isOnline: !requireApproval,
      isApproved: !requireApproval, // Set approval status
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

    // Price validation
    if (updateData.deliveryFee < 0) {
      throw new ConvexError("رسوم التوصيل يجب أن تكون أكبر من أو تساوي صفر");
    }
    if (updateData.minOrderAmount < 0) {
      throw new ConvexError("الحد الأدنى للطلب يجب أن يكون أكبر من أو يساوي صفر");
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

// Approve store (admin only)
export const approveStore = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية للموافقة على المتاجر");
    }

    const store = await ctx.db.get(storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    await ctx.db.patch(storeId, {
      isApproved: true,
      isActive: true,
      isOnline: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Reject store (admin only)
export const rejectStore = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, reason } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لرفض المتاجر");
    }

    const store = await ctx.db.get(storeId);
    if (!store) {
      throw new ConvexError("المتجر غير موجود");
    }

    await ctx.db.patch(storeId, {
      isApproved: false,
      isActive: false,
      isOnline: false,
      rejectionReason: reason,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get pending stores (admin only)
export const getPendingStores = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لعرض المتاجر المعلقة");
    }

    const stores = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("isApproved"), false))
      .collect();

    // Convert imageId to imageUrl for all stores
    return await Promise.all(
      stores.map(async (store) => {
        let imageUrl = store.imageUrl;
        if (store.imageId && !imageUrl) {
          try {
            const url = await ctx.storage.getUrl(store.imageId);
            imageUrl = url || undefined;
          } catch (error) {
            console.error("Failed to get image URL:", error);
          }
        }
        return {
          ...store,
          imageUrl: imageUrl || store.imageUrl,
        };
      })
    );
  },
});
