import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// التحقق من أن المستخدم مدير
export const isAdmin = async (ctx: any, sessionToken?: string | null) => {
  const userId = await getAuthUserId(ctx, sessionToken);
  if (!userId) return false;

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  return (profile?.role === "admin" || profile?.role === "owner") && !profile.isSuspended;
};

// الحصول على جميع المتاجر مع صلاحيات المدير
export const getAllStoresAsAdmin = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminCheck = await isAdmin(ctx, args.sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية للوصول إلى هذه البيانات");

    return await ctx.db.query("stores").collect();
  },
});

// الحصول على جميع منتجات متجر معين كـ مدير
export const getStoreProductsAsAdmin = query({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية للوصول إلى هذه البيانات");

    return await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", storeId))
      .collect();
  },
});

// الحصول على بيانات التاجر كـ مدير
export const getMerchantProfileAsAdmin = query({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية للوصول إلى هذه البيانات");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();

    if (!profile) throw new ConvexError("الملف الشخصي غير موجود");

    return profile;
  },
});

// تعديل أي متجر كـ مدير
export const updateAnyStoreAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    updates: v.object({
      nameAr: v.optional(v.string()),
      nameEn: v.optional(v.string()),
      descriptionAr: v.optional(v.string()),
      descriptionEn: v.optional(v.string()),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
      imageUrl: v.optional(v.string()),
      estimatedDeliveryTime: v.optional(v.number()),
      commissionRate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    console.log("updateAnyStoreAsAdmin called:", args);
    const { sessionToken, storeId, updates } = args;
    
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتعديل المتاجر");

    const store = await ctx.db.get(storeId);
    if (!store) throw new ConvexError("المتجر غير موجود");

    console.log("Store found:", store);
    console.log("Applying updates:", updates);

    await ctx.db.patch(storeId, updates);

    console.log("Store updated successfully");
    return { success: true };
  },
});

// تعديل أي منتج كـ مدير
export const updateAnyProductAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    updates: v.object({
      nameAr: v.optional(v.string()),
      nameEn: v.optional(v.string()),
      descriptionAr: v.optional(v.string()),
      descriptionEn: v.optional(v.string()),
      price: v.optional(v.number()),
      quantity: v.optional(v.number()),
      isAvailable: v.optional(v.boolean()),
      images: v.optional(v.array(v.string())),
      category: v.optional(v.string()),
      colors: v.optional(v.array(v.string())),
      sizes: v.optional(v.array(v.object({ name: v.string(), label: v.string() }))),
      preparationTime: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, updates } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتعديل المنتجات");

    const product = await ctx.db.get(productId);
    if (!product) throw new ConvexError("المنتج غير موجود");

    await ctx.db.patch(productId, updates);
    
    return { success: true };
  },
});

// حذف أي منتج كـ مدير
export const deleteAnyProductAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لحذف المنتجات");

    const product = await ctx.db.get(productId);
    if (!product) throw new ConvexError("المنتج غير موجود");

    await ctx.db.delete(productId);

    return { success: true };
  },
});

// تعديل بيانات أي تاجر كـ مدير
export const updateAnyMerchantAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
    updates: v.object({
      fullName: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      isSuspended: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId, updates } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتعديل التجار");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();

    if (!profile) throw new ConvexError("الملف الشخصي غير موجود");
    if (profile.role !== "merchant") throw new ConvexError("هذا المستخدم ليس تاجراً");

    await ctx.db.patch(profile._id, updates);

    return { success: true };
  },
});

// إخفاء/إظهار منتج كـ مدير
export const toggleProductVisibilityAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, isVisible } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتعديل المنتجات");

    const product = await ctx.db.get(productId);
    if (!product) throw new ConvexError("المنتج غير موجود");

    await ctx.db.patch(productId, { 
      isAvailable: isVisible 
    });

    return { success: true };
  },
});

// تعطيل/تفعيل متجر كـ مدير
export const toggleStoreStatusAsAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, isActive } = args;
    const adminCheck = await isAdmin(ctx, sessionToken);
    if (!adminCheck) throw new ConvexError("ليس لديك صلاحية لتعديل المتاجر");

    const store = await ctx.db.get(storeId);
    if (!store) throw new ConvexError("المتجر غير موجود");

    await ctx.db.patch(storeId, { isActive });

    return { success: true };
  },
});
