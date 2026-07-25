import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// الحصول على كل منتجات التاجر (من كل متاجره)
export const getMyProducts = query({
  args: {
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // جلب كل متاجر التاجر
    const myStores = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    if (myStores.length === 0) {
      return [];
    }

    const storeIds = myStores.map(s => s._id);
    const availableOnly = args.availableOnly ?? false;

    // جلب كل المنتجات من كل المتاجر
    const allProducts = [];
    for (const storeId of storeIds) {
      let products;
      if (availableOnly) {
        products = await ctx.db
          .query("products")
          .withIndex("by_store", (q) => q.eq("storeId", storeId))
                    .collect();
      } else {
        products = await ctx.db
          .query("products")
          .withIndex("by_store", (q) => q.eq("storeId", storeId))
          .collect();
      }
      
      // إضافة معلومات المتجر لكل منتج
      const productsWithStore = products.map(p => ({
        ...p,
        storeName: myStores.find(s => s._id === p.storeId)?.nameAr || "",
      }));
      
      allProducts.push(...productsWithStore);
    }

    return allProducts;
  },
});

// الحصول على منتجات متجر معين
export const getStoreProducts = query({
  args: {
    storeId: v.id("stores"),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const availableOnly = args.availableOnly ?? true;

    if (availableOnly) {
      return await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
                .collect();
    } else {
      return await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
        .collect();
    }
  },
});

// الحصول على منتج واحد بواسطة ID (للتحديث المباشر للسعر في السلة)
export const getProduct = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// إضافة منتج جديد مع صور متعددة
export const createProduct = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    weight: v.optional(v.string()), // الوزن
    images: v.array(v.string()), // صور متعددة
    category: v.string(),
    quantity: v.optional(v.number()), // كمية المخزون (اختياري)
    colors: v.optional(v.array(v.string())), // الألوان المتاحة
    preparationTime: v.number(),
    sizes: v.optional(v.array(v.object({
      name: v.string(),
      label: v.string(),
    }))),
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
      throw new ConvexError("ليس لديك صلاحية لإضافة منتجات لهذا المتجر");
    }

    // التحقق من عدد الصور (حد أقصى 10)
    if (args.images.length > 10) {
      throw new ConvexError("الحد الأقصى للصور هو 10 صور");
    }

    const productId = await ctx.db.insert("products", {
      storeId: args.storeId,
      name: args.name,
      nameAr: args.nameAr,
      description: args.description,
      descriptionAr: args.descriptionAr,
      price: args.price,
      originalPrice: args.originalPrice,
      weight: args.weight || "",
      images: args.images || [],
      category: args.category || "",
      colors: args.colors || [],
      isAvailable: true,
      isFeatured: false,
      sizes: args.sizes || [],
      rating: 0,
      reviewCount: 0,
      keywords: [],
      stock: 0,
      minStock: 0,
      unit: "piece",
      unitPrice: args.price,
      materials: [],
      certifications: [],
      sku: "",
      tags: [],
      allergens: [],
    });

    return productId;
  },
});

// تحديث منتج
export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    weight: v.optional(v.string()), // الوزن
    images: v.array(v.string()),
    category: v.string(),
    quantity: v.optional(v.number()), // كمية المخزون (اختياري)
    colors: v.optional(v.array(v.string())), // الألوان المتاحة
    preparationTime: v.number(),
    sizes: v.optional(v.array(v.object({
      name: v.string(),
      label: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    const store = await ctx.db.get(product.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المنتج");
    }

    if (args.images.length > 10) {
      throw new ConvexError("الحد الأقصى للصور هو 10 صور");
    }

    const updateData: any = {
      name: args.name,
      nameAr: args.nameAr,
      description: args.description,
      descriptionAr: args.descriptionAr,
      price: args.price,
      originalPrice: args.originalPrice,
      weight: args.weight,
      images: args.images,
      category: args.category,
      colors: args.colors,
      preparationTime: args.preparationTime,
      sizes: args.sizes,
    };

    // فقط تحديث الكمية إذا تم توفيرها
    if (args.quantity !== undefined) {
      updateData.quantity = args.quantity;
    }

    await ctx.db.patch(args.productId, updateData);

    return { success: true };
  },
});

// تحديث توفر المنتج
export const updateProductAvailability = mutation({
  args: {
    productId: v.id("products"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    const store = await ctx.db.get(product.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لتعديل هذا المنتج");
    }

    await ctx.db.patch(args.productId, {
      isAvailable: args.isAvailable,
    });

    return { success: true };
  },
});

// حذف منتج
export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError("المنتج غير موجود");
    }

    const store = await ctx.db.get(product.storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لحذف هذا المنتج");
    }

    await ctx.db.delete(args.productId);

    return { success: true };
  },
});

// إنشاء رابط رفع صورة
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// الحصول على رابط الصورة من storage ID أو رابط مباشر
export const getFileUrl = query({
  args: { 
    imageId: v.string() // قد يكون storage ID أو رابط مباشر
  },
  handler: async (ctx, args) => {
    // إذا كان الرابط مباشراً (يبدأ بـ http أو https)، أعده كما هو
    if (args.imageId.startsWith("http://") || args.imageId.startsWith("https://")) {
      return args.imageId;
    }

    // وإلا، افترض أنه storage ID وحصل على الرابط
    try {
      return await ctx.storage.getUrl(args.imageId as any);
    } catch (error) {
      // إذا فشل، أعد الـ ID كما هو (قد يكون رابط مباشر لم تتعرف عليه)
      return args.imageId;
    }
  },
});

// الحصول على رابط الصورة (مرجع للتوافق مع الكود القديم)
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// الحصول على جميع المنتجات مع روابط الصور المعالجة
export const getAllProductsWithImages = query({
  args: {
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const availableOnly = args.availableOnly ?? false;

    let products = await ctx.db.query("products").collect();

    if (availableOnly) {
      products = products.filter((p) => p.isAvailable === true);
    }

    // لا نعالج الصور هنا - المكون React هو من سيستدعي getFileUrl للحصول على الروابط
    return products;
  },
});

// الحصول على منتجات متجر معين مع روابط الصور
export const getStoreProductsWithImages = query({
  args: {
    storeId: v.id("stores"),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const availableOnly = args.availableOnly ?? true;

    let products;
    if (availableOnly) {
      products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
                .collect();
    } else {
      products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
        .collect();
    }

    // لا نعالج الصور هنا - المكون React هو من سيستدعي getFileUrl للحصول على الروابط
    return products;
  },
});

// الحصول على منتج واحد مع رابط الصورة
export const getProductWithImage = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    // المكون React سيحصل على رابط الصورة باستخدام getFileUrl
    return product;
  },
});

export const getAllProducts = query({
  args: {
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const availableOnly = args.availableOnly ?? false;

    let products = await ctx.db.query("products").collect();

    if (availableOnly) {
      products = products.filter((p) => p.isAvailable === true);
    }

    return products;
  },
});

// تحديث جميع المنتجات بصور من Unsplash (للاختبار)
export const updateAllProductsWithImages = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    
    const imageUrls = [
      "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592286927505-1fed6e2ac5d5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606933248051-5ce98deadffa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    ];

    let updatedCount = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.images || product.images.length === 0) {
        const imageUrl = imageUrls[i % imageUrls.length];
        await ctx.db.patch(product._id, {
          images: [imageUrl],
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

// إضافة منتجات تجريبية مع صور (للاختبار)
export const seedProductsWithImages = mutation({
  args: {},
  handler: async (ctx, args) => {
    // جلب أول متجر في قاعدة البيانات
    const stores = await ctx.db.query("stores").collect();
    
    if (stores.length === 0) {
      throw new ConvexError("لا توجد متاجر - يجب إنشاء متجر أولاً");
    }

    const storeId = stores[0]._id;

    // بيانات المنتجات التجريبية مع صور من Unsplash
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
          "https://images.unsplash.com/photo-1559227615-cd4628902249?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 15,
        colors: ["Black", "Silver"],
        preparationTime: 24,
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
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 25,
        colors: ["Black", "White", "Blue"],
        preparationTime: 48,
      },
      {
        name: "Smartphone Case",
        nameAr: "غطاء الهاتف",
        description: "Protective phone case",
        descriptionAr: "غطاء حماية الهاتف",
        price: 45,
        originalPrice: 75,
        images: [
          "https://images.unsplash.com/photo-1592286927505-1fed6e2ac5d5?w=400&h=400&fit=crop",
        ],
        category: "Accessories",
        quantity: 50,
        colors: ["Red", "Black", "Blue", "Green"],
        preparationTime: 24,
      },
      {
        name: "USB-C Cable",
        nameAr: "كابل USB-C",
        description: "Fast charging USB-C cable",
        descriptionAr: "كابل USB-C سريع الشحن",
        price: 20,
        originalPrice: 35,
        images: [
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
        ],
        category: "Cables",
        quantity: 100,
        colors: ["White", "Black"],
        preparationTime: 24,
      },
      {
        name: "Laptop Stand",
        nameAr: "حامل اللاب توب",
        description: "Adjustable laptop stand",
        descriptionAr: "حامل لاب توب قابل للتعديل",
        price: 80,
        originalPrice: 120,
        images: [
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 20,
        colors: ["Silver", "Black"],
        preparationTime: 48,
      },
      {
        name: "Mechanical Keyboard",
        nameAr: "لوحة مفاتيح ميكانيكية",
        description: "RGB mechanical keyboard",
        descriptionAr: "لوحة مفاتيح ميكانيكية RGB",
        price: 180,
        originalPrice: 250,
        images: [
          "https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1587833971122-ebb16cc7e265?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 12,
        colors: ["Black", "White"],
        preparationTime: 48,
      },
      {
        name: "Monitor",
        nameAr: "شاشة",
        description: "27 inch 4K monitor",
        descriptionAr: "شاشة 27 بوصة 4K",
        price: 450,
        originalPrice: 600,
        images: [
          "https://images.unsplash.com/photo-1606933248051-5ce98deadffa?w=400&h=400&fit=crop",
        ],
        category: "Electronics",
        quantity: 8,
        colors: ["Black"],
        preparationTime: 72,
      },
      {
        name: "Portable Charger",
        nameAr: "شاحن محمول",
        description: "20000mAh portable charger",
        descriptionAr: "شاحن محمول 20000mAh",
        price: 60,
        originalPrice: 90,
        images: [
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
        ],
        category: "Accessories",
        quantity: 40,
        colors: ["Black", "White", "Blue"],
        preparationTime: 24,
      },
    ];

    // إدراج كل منتج تجريبي
    const createdProducts = [];
    for (const product of sampleProducts) {
      const productId = await ctx.db.insert("products", {
        storeId: storeId,
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: product.price,
        originalPrice: product.originalPrice,
        weight: "",
        images: product.images || [],
        category: product.category || "",
        colors: product.colors || [],
        isAvailable: true,
        isFeatured: true,
        sizes: [],
        rating: 0,
        reviewCount: 0,
        keywords: [],
        stock: 0,
        minStock: 0,
        unit: "piece",
        unitPrice: product.price,
        materials: [],
        certifications: [],
        sku: "",
        tags: [],
        allergens: [],
      });
      createdProducts.push(productId);
    }

    return {
      success: true,
      message: `تم إنشاء ${createdProducts.length} منتج تجريبي`,
      count: createdProducts.length,
    };
  },
});
