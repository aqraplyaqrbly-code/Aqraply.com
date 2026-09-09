import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

// Set product as sponsored
export const setProductSponsored = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    productId: v.id("products"),
    isSponsored: v.boolean(),
    priority: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Verify user owns the store
    const store = await ctx.db.get(product.storeId);
    if (!store || store.ownerId !== userId) {
      throw new Error("You don't have permission to sponsor this product");
    }

    // If setting as sponsored, calculate and deduct cost from wallet
    if (args.isSponsored && args.startDate && args.endDate) {
      const days = Math.ceil((args.endDate - args.startDate) / (1000 * 60 * 60 * 24));
      const priority = args.priority || 1;
      const dailyRate = 50; // EGP per day
      const priorityMultiplier = priority > 1 ? 1.5 : 1;
      const cost = Math.round(days * dailyRate * priorityMultiplier);

      // Get or create user's wallet
      let wallet = await ctx.db
        .query("wallets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (!wallet) {
        const walletId = await ctx.db.insert("wallets", {
          userId,
          balance: 0,
          totalSpent: 0,
          currency: "EGP",
          lastTransactionAt: Date.now(),
        });
        wallet = await ctx.db.get(walletId);
      }

      if (!wallet || wallet.balance < cost) {
        const currentBalance = wallet?.balance || 0;
        throw new ConvexError(`الرصيد غير كافٍ. التكلفة: ${cost} EGP، الرصيد الحالي: ${currentBalance} EGP`);
      }

      // Deduct from wallet
      await ctx.db.patch(wallet._id, {
        balance: wallet.balance - cost,
        totalSpent: (wallet.totalSpent || 0) + cost,
      });

      // Record transaction
      await ctx.db.insert("walletTransactions", {
        userId,
        walletId: wallet._id,
        type: "withdrawal",
        amount: cost,
        description: `Sponsored product: ${product.name}`,
        descriptionAr: `إعلان ممول: ${product.name}`,
        balance: wallet.balance - cost,
        currency: "EGP",
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(args.productId, {
      isSponsored: args.isSponsored,
      sponsoredPriority: args.priority || 1,
      sponsoredStartDate: args.startDate || Date.now(),
      sponsoredEndDate: args.endDate,
    });

    return { success: true };
  },
});

// Get sponsored products for homepage
export const getSponsoredProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 4;
    const now = Date.now();

    // Get active sponsored products
    const sponsoredProducts = await ctx.db
      .query("products")
      .withIndex("by_sponsored", (q) => q.eq("isSponsored", true))
      .collect();

    // Filter by date range and sort by priority
    const activeSponsored = sponsoredProducts
      .filter(p => {
        const startDate = p.sponsoredStartDate || 0;
        const endDate = p.sponsoredEndDate || Infinity;
        return startDate <= now && endDate >= now && p.isAvailable;
      })
      .sort((a, b) => (b.sponsoredPriority || 1) - (a.sponsoredPriority || 1))
      .slice(0, limit);

    return activeSponsored;
  },
});

// Get sponsored products for a specific store
export const getStoreSponsoredProducts = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sponsoredProducts = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    return sponsoredProducts.filter(p => {
      const startDate = p.sponsoredStartDate || 0;
      const endDate = p.sponsoredEndDate || Infinity;
      return p.isSponsored === true && startDate <= now && endDate >= now;
    });
  },
});

// Get sponsored products statistics
export const getSponsoredStats = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sponsoredProducts = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const activeSponsored = sponsoredProducts.filter(p => {
      const startDate = p.sponsoredStartDate || 0;
      const endDate = p.sponsoredEndDate || Infinity;
      return p.isSponsored === true && startDate <= now && endDate >= now;
    });

    const expiredSponsored = sponsoredProducts.filter(p => {
      const endDate = p.sponsoredEndDate || Infinity;
      return p.isSponsored === true && endDate < now;
    });

    return {
      total: sponsoredProducts.filter(p => p.isSponsored).length,
      active: activeSponsored.length,
      expired: expiredSponsored.length,
    };
  },
});
