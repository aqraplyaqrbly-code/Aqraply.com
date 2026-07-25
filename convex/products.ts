import { query, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

const sizeValidator = v.optional(
  v.array(
    v.object({
      name: v.string(),
      label: v.string(),
    })
  )
);

async function assertStoreOwner(
  ctx: MutationCtx,
  storeId: Id<"stores">,
  userId: Id<"users">
) {
  const store = await ctx.db.get(storeId);
  if (!store) {
    throw new ConvexError("المتجر غير موجود");
  }
  if (store.ownerId !== userId) {
    throw new ConvexError("ليس لديك صلاحية لهذا المتجر");
  }
  return store;
}

// Get all products with images
export const getAllProductsWithImages = query({
  args: {
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const products = args.availableOnly
      ? await ctx.db
          .query("products")
          .withIndex("by_available", (q) => q.eq("isAvailable", true))
          .collect()
      : await ctx.db.query("products").collect();

    return products.map((product) => ({
      ...product,
      images: product.images?.length ? product.images : product.imageIds || [],
    }));
  },
});

// Get store products with images
export const getStoreProductsWithImages = query({
  args: {
    storeId: v.id("stores"),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let productsQuery = ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId));

    if (args.availableOnly) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("isAvailable"), true)
      );
    }

    const products = await productsQuery.collect();

    return products.map((product) => ({
      ...product,
      // Use imageIds (storage IDs) instead of images (direct URLs) for proper image resolution
      images: product.imageIds?.length ? product.imageIds.map(id => String(id)) : product.images || [],
    }));
  },
});

// Merchant: all products across owned stores
export const getMyProducts = query({
  args: {
    sessionToken: v.optional(v.string()),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, availableOnly } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const myStores = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    if (myStores.length === 0) {
      return [];
    }

    const storeIds = myStores.map((s) => s._id);
    const availableOnlyFinal = availableOnly ?? false;
    const allProducts = [];

    for (const storeId of storeIds) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", storeId))
        .collect();

      const filtered = availableOnlyFinal
        ? products.filter((p) => p.isAvailable)
        : products;

      const productsWithStore = filtered.map((p) => ({
        ...p,
        // Use imageIds (storage IDs) instead of images (direct URLs) for proper image resolution
        images: p.imageIds?.length ? p.imageIds.map(id => String(id)) : p.images || [],
        storeName: myStores.find((s) => s._id === p.storeId)?.nameAr || "",
      }));

      allProducts.push(...productsWithStore);
    }

    return allProducts;
  },
});

export const getStoreProducts = query({
  args: {
    storeId: v.id("stores"),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const availableOnly = args.availableOnly ?? true;
    if (availableOnly) {
      return products.filter((p) => p.isAvailable);
    }
    return products;
  },
});

export const getProduct = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

export const getProductWithImage = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    // Use imageIds (storage IDs) instead of images (direct URLs) for proper image resolution
    return {
      ...product,
      images: product.imageIds?.length ? product.imageIds.map(id => String(id)) : product.images || [],
    };
  },
});

export const getAllProducts = query({
  args: {
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();
    if (args.availableOnly) {
      products = products.filter((p) => p.isAvailable === true);
    }
    // Use imageIds (storage IDs) instead of images (direct URLs) for proper image resolution
    return products.map((product) => ({
      ...product,
      images: product.imageIds?.length ? product.imageIds.map(id => String(id)) : product.images || [],
    }));
  },
});

export const createProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    code: v.optional(v.string()),
    weight: v.optional(v.union(v.number(), v.string())),
    preparationTime: v.optional(v.number()),
    quantity: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    colors: v.optional(v.array(v.string())),
    sizes: sizeValidator,
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, ...productData } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    await assertStoreOwner(ctx, storeId, userId);

    const images = productData.images || [];
    if (images.length > 10) {
      throw new ConvexError("الحد الأقصى للصور هو 10 صور");
    }

    const productId = await ctx.db.insert("products", {
      storeId: storeId,
      name: productData.name,
      nameAr: productData.nameAr,
      description: productData.description,
      descriptionAr: productData.descriptionAr,
      price: productData.price,
      originalPrice: productData.originalPrice,
      code: productData.code,
      weight: productData.weight,
      preparationTime: productData.preparationTime,
      quantity: productData.quantity ?? 0,
      images,
      imageIds: productData.imageIds,
      category: productData.category,
      colors: productData.colors ?? [],
      sizes: productData.sizes ?? [],
      isAvailable: productData.isAvailable ?? true,
      rating: 0,
      reviewCount: 0,
      totalRatings: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    storeId: v.optional(v.id("stores")),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    code: v.optional(v.string()),
    weight: v.optional(v.union(v.number(), v.string())),
    preparationTime: v.optional(v.number()),
    quantity: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    colors: v.optional(v.array(v.string())),
    sizes: sizeValidator,
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, storeId: _storeId, ...updateData } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    await assertStoreOwner(ctx, product.storeId, userId);

    if (updateData.images && updateData.images.length > 10) {
      throw new ConvexError("الحد الأقصى للصور هو 10 صور");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }

    await ctx.db.patch(productId, patch);
    return { success: true };
  },
});

export const updateProductAvailability = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId, isAvailable } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    await assertStoreOwner(ctx, product.storeId, userId);

    await ctx.db.patch(productId, {
      isAvailable: isAvailable,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteProduct = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, productId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    await assertStoreOwner(ctx, product.storeId, userId);

    await ctx.db.delete(productId);
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

export const updateAllProductsWithImages = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    const imageUrls = [
      "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592286927505-1fed6e2ac5d5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
    ];

    let updatedCount = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.images || product.images.length === 0) {
        await ctx.db.patch(product._id, {
          images: [imageUrls[i % imageUrls.length]],
        });
        updatedCount++;
      }
    }

    return {
      success: true,
      message: `تم تحديث ${updatedCount} منتج بصور`,
      total: products.length,
    };
  },
});

export const seedProductsWithImages = mutation({
  args: {},
  handler: async (ctx) => {
    const stores = await ctx.db.query("stores").collect();
    if (stores.length === 0) {
      throw new ConvexError("لا توجد متاجر - يجب إنشاء متجر أولاً");
    }

    const storeId = stores[0]._id;
    const sampleProducts = [
      {
        name: "Coffee Maker",
        nameAr: "ماكينة القهوة",
        description: "Professional coffee maker",
        descriptionAr: "ماكينة قهوة احترافية",
        price: 250,
        originalPrice: 350,
        images: [
          "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 15,
      },
      {
        name: "Wireless Headphones",
        nameAr: "سماعات لاسلكية",
        description: "High quality wireless headphones",
        descriptionAr: "سماعات لاسلكية عالية الجودة",
        price: 150,
        originalPrice: 200,
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 25,
      },
    ];

    let created = 0;
    for (const sample of sampleProducts) {
      await ctx.db.insert("products", {
        storeId,
        ...sample,
        isAvailable: true,
        rating: 0,
        reviewCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      created++;
    }

    return { success: true, created };
  },
});
