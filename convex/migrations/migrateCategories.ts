import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { mapOldCategoryToNew } from "../../src/constants/categories";

/**
 * Migration script to update old category names to new mainCategory/subcategory structure
 * This ensures backward compatibility for existing stores and products
 */
export const migrateCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all stores
    const stores = await ctx.db.query("stores").collect();

    let storesUpdated = 0;

    for (const store of stores) {
      // Skip if already has mainCategory
      if (store.mainCategory) {
        continue;
      }

      // Map old category to new structure
      if (store.category) {
        const mapped = mapOldCategoryToNew(store.category);
        
        await ctx.db.patch(store._id, {
          mainCategory: mapped.mainCategory,
          subcategory: mapped.subcategory,
        });
        
        storesUpdated++;
      }
    }

    // Get all products
    const products = await ctx.db.query("products").collect();

    let productsUpdated = 0;

    for (const product of products) {
      // Skip if already has mainCategory
      if (product.mainCategory) {
        continue;
      }

      // Map old category to new structure
      if (product.category) {
        const mapped = mapOldCategoryToNew(product.category);
        
        await ctx.db.patch(product._id, {
          mainCategory: mapped.mainCategory,
          subcategory: mapped.subcategory,
        });
        
        productsUpdated++;
      }
    }
    
    return {
      storesUpdated,
      productsUpdated,
      totalStores: stores.length,
      totalProducts: products.length,
    };
  },
});

/**
 * Migration script to migrate a specific store by ID
 */
export const migrateStoreById = mutation({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    // Skip if already has mainCategory
    if (store.mainCategory) {
      return { success: true, message: "Store already migrated", storeId: args.storeId };
    }

    // Map old category to new structure
    if (store.category) {
      const mapped = mapOldCategoryToNew(store.category);
      
      await ctx.db.patch(args.storeId, {
        mainCategory: mapped.mainCategory,
        subcategory: mapped.subcategory,
      });
      
      return {
        success: true,
        message: `Migrated: ${store.category} -> ${mapped.mainCategory}/${mapped.subcategory}`,
        storeId: args.storeId,
        oldCategory: store.category,
        newMainCategory: mapped.mainCategory,
        newSubcategory: mapped.subcategory,
      };
    }

    return { success: false, message: "No category to migrate", storeId: args.storeId };
  },
});

/**
 * Migration script to migrate products for a specific store
 */
export const migrateStoreProducts = mutation({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    let updated = 0;

    for (const product of products) {
      // Skip if already has mainCategory
      if (product.mainCategory) {
        continue;
      }

      // Map old category to new structure
      if (product.category) {
        const mapped = mapOldCategoryToNew(product.category);
        
        await ctx.db.patch(product._id, {
          mainCategory: mapped.mainCategory,
          subcategory: mapped.subcategory,
        });
        
        updated++;
      }
    }

    return {
      success: true,
      storeId: args.storeId,
      productsUpdated: updated,
      totalProducts: products.length,
    };
  },
});
