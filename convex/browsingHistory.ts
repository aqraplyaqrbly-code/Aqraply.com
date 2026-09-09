import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./auth";

// Save product view to browsing history
export const saveProductView = mutation({
  args: {
    productId: v.id("products"),
    sessionId: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    await ctx.db.insert("browsingHistory", {
      userId: userId || undefined,
      sessionId: args.sessionId,
      productId: args.productId,
      timestamp: Date.now(),
      duration: args.duration,
    });
  },
});

// Get user's browsing history
export const getBrowsingHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const effectiveUserId = args.userId || userId;
    const limit = args.limit || 20;

    if (effectiveUserId) {
      // Get history for authenticated user
      const history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
        .order("desc")
        .take(limit);
      
      return history;
    } else if (args.sessionId) {
      // Get history for anonymous user
      const history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .order("desc")
        .take(limit);
      
      return history;
    }
    
    return [];
  },
});

// Get recently viewed products with full product details
export const getRecentlyViewedProducts = query({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const effectiveUserId = args.userId || userId;
    const limit = args.limit || 8;

    let history;
    if (effectiveUserId) {
      history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
        .order("desc")
        .take(limit);
    } else if (args.sessionId) {
      history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .order("desc")
        .take(limit);
    } else {
      return [];
    }

    // Get unique product IDs (most recent view for each product)
    const uniqueProductIds = new Set();
    const productIds: Id<"products">[] = [];
    
    for (const item of history) {
      if (!uniqueProductIds.has(item.productId)) {
        uniqueProductIds.add(item.productId);
        productIds.push(item.productId);
      }
    }

    // Fetch product details
    const products = [];
    for (const productId of productIds) {
      const product = await ctx.db.get(productId);
      if (product) {
        products.push(product);
      }
    }

    return products;
  },
});

// Clear browsing history
export const clearBrowsingHistory = mutation({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    if (userId) {
      // Clear history for authenticated user
      const history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      
      for (const item of history) {
        await ctx.db.delete(item._id);
      }
    } else if (args.sessionId) {
      // Clear history for anonymous user
      const history = await ctx.db
        .query("browsingHistory")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
      
      for (const item of history) {
        await ctx.db.delete(item._id);
      }
    }
  },
});
