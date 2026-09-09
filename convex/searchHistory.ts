import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

// Save search to history
export const saveSearch = mutation({
  args: {
    searchTerm: v.string(),
    resultsCount: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    await ctx.db.insert("searchHistory", {
      userId: userId || undefined,
      sessionId: args.sessionId,
      searchTerm: args.searchTerm,
      resultsCount: args.resultsCount,
      timestamp: Date.now(),
    });
  },
});

// Get user's search history
export const getSearchHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const effectiveUserId = args.userId || userId;
    const limit = args.limit || 10;

    if (effectiveUserId) {
      // Get history for authenticated user
      const history = await ctx.db
        .query("searchHistory")
        .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
        .order("desc")
        .take(limit);
      
      return history;
    } else if (args.sessionId) {
      // Get history for anonymous user
      const history = await ctx.db
        .query("searchHistory")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .order("desc")
        .take(limit);
      
      return history;
    }
    
    return [];
  },
});

// Get popular searches (across all users)
export const getPopularSearches = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const allSearches = await ctx.db
      .query("searchHistory")
      .order("desc")
      .take(100); // Get recent searches
    
    // Count frequency of each search term
    const searchCounts = new Map<string, number>();
    allSearches.forEach(search => {
      const term = search.searchTerm.toLowerCase();
      searchCounts.set(term, (searchCounts.get(term) || 0) + 1);
    });
    
    // Sort by frequency and return top searches
    const sortedSearches = Array.from(searchCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term]) => term);
    
    return sortedSearches;
  },
});

// Clear search history
export const clearSearchHistory = mutation({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    if (userId) {
      // Clear history for authenticated user
      const history = await ctx.db
        .query("searchHistory")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      
      for (const item of history) {
        await ctx.db.delete(item._id);
      }
    } else if (args.sessionId) {
      // Clear history for anonymous user
      const history = await ctx.db
        .query("searchHistory")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
      
      for (const item of history) {
        await ctx.db.delete(item._id);
      }
    }
  },
});
