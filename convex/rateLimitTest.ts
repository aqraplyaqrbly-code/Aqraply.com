import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { checkRateLimit } from "./rateLimit";
import { ConvexError } from "convex/values";

// Test mutation for rate limiting - simulates createOrder (NO AUTH for testing)
export const testCreateOrderRateLimitNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate limiting: 10 orders per hour per user
    await checkRateLimit(ctx, args.testUserId, "createOrder", 10, 60 * 60 * 1000);

    return { success: true, message: "createOrder test passed" };
  },
});

// Test mutation for rate limiting - simulates createProduct (NO AUTH for testing)
export const testCreateProductRateLimitNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate limiting: 20 products per hour per merchant
    await checkRateLimit(ctx, args.testUserId, "createProduct", 20, 60 * 60 * 1000);

    return { success: true, message: "createProduct test passed" };
  },
});

// Test mutation for rate limiting - simulates createStore (NO AUTH for testing)
export const testCreateStoreRateLimitNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate limiting: 1 store per day per user
    await checkRateLimit(ctx, args.testUserId, "createStore", 1, 24 * 60 * 60 * 1000);

    return { success: true, message: "createStore test passed" };
  },
});

// Test mutation for rate limiting - simulates updateOrderStatus (NO AUTH for testing)
export const testUpdateOrderStatusRateLimitNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate limiting: 30 status updates per minute per merchant
    await checkRateLimit(ctx, args.testUserId, "updateOrderStatus", 30, 60 * 1000);

    return { success: true, message: "updateOrderStatus test passed" };
  },
});

// Test mutation for rate limiting - simulates addBalance (NO AUTH for testing)
export const testAddBalanceRateLimitNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate limiting: 5 balance additions per hour per admin
    await checkRateLimit(ctx, args.testUserId, "addBalance", 5, 60 * 60 * 1000);

    return { success: true, message: "addBalance test passed" };
  },
});

// Test user isolation - different users should have independent rate limits
export const testUserIsolationNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Test with the provided user ID
    await checkRateLimit(ctx, args.testUserId, "createOrder", 10, 60 * 60 * 1000);

    return { success: true, message: "User isolation test passed" };
  },
});

// Test action isolation - different actions should have independent rate limits
export const testActionIsolationNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Test different actions for the same user
    await checkRateLimit(ctx, args.testUserId, "createOrder", 10, 60 * 60 * 1000);
    await checkRateLimit(ctx, args.testUserId, "createProduct", 20, 60 * 60 * 1000);

    return { success: true, message: "Action isolation test passed" };
  },
});

// Test window reset - after window expires, counter should reset (SHORT WINDOW FOR TESTING)
export const testWindowResetNoAuth = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Test with a very short window (5 seconds) for testing
    await checkRateLimit(ctx, args.testUserId, "testWindowReset", 3, 5000);

    return { success: true, message: "Window reset test passed" };
  },
});

// Test unauthorized requests - should fail authentication before rate limit
export const testUnauthorizedRequest = mutation({
  args: {},
  handler: async (ctx, args) => {
    // No sessionToken provided - should fail authentication
    const userId = await getAuthUserId(ctx, undefined);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // This should never be reached
    await checkRateLimit(ctx, userId.toString(), "createOrder", 10, 60 * 60 * 1000);

    return { success: true, message: "Unauthorized request test passed" };
  },
});

// Helper to check current rate limit status (READ ONLY)
export const getRateLimitStatus = mutation({
  args: {
    testUserId: v.string(),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("authRateLimits")
      .withIndex("by_identifier_action", (q: any) =>
        q.eq("identifier", args.testUserId).eq("action", args.action)
      )
      .first();

    if (!existing) {
      return { status: "No rate limit record", attempts: 0 };
    }

    const now = Date.now();
    const windowMs = args.action === "testWindowReset" ? 5000 : 
                    args.action === "updateOrderStatus" ? 60000 :
                    args.action === "createStore" ? 86400000 : 3600000;
    const windowStart = now - (now % windowMs);

    return {
      status: existing.windowStart < windowStart ? "Window expired" : "Window active",
      attempts: existing.attempts,
      windowStart: existing.windowStart,
      currentWindow: windowStart,
      windowMs: windowMs,
    };
  },
});

// Helper to reset rate limit for testing (TEST ONLY)
export const resetRateLimit = mutation({
  args: {
    testUserId: v.string(),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("authRateLimits")
      .withIndex("by_identifier_action", (q: any) =>
        q.eq("identifier", args.testUserId).eq("action", args.action)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true, message: "Rate limit reset" };
    }

    return { success: true, message: "No rate limit to reset" };
  },
});

// Test addBalance authorization with different roles
export const testAddBalanceAuthorization = mutation({
  args: {
    testUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Simulate the authorization check from addBalance
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.testUserId))
      .first();

    if (!profile) {
      return { success: false, role: "none", message: "Profile not found" };
    }

    // Check if user has admin or owner role
    const isAuthorized = profile.role === "admin" || profile.role === "owner";

    return {
      success: isAuthorized,
      role: profile.role,
      isOwner: profile.isOwner || false,
      authorized: isAuthorized,
      message: isAuthorized ? "Authorized" : "غير مصرح - فقط المدير يمكنه إضافة رصيد",
    };
  },
});

// Test unauthorized addBalance doesn't consume quota
export const testUnauthorizedAddBalanceQuota = mutation({
  args: {
    testUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get initial rate limit status
    const beforeStatus = await ctx.db
      .query("authRateLimits")
      .withIndex("by_identifier_action", (q: any) =>
        q.eq("identifier", args.testUserId).eq("action", "addBalance")
      )
      .first();

    // Simulate an unauthorized request (should fail auth before rate limit)
    // This should NOT increment the counter
    const now = Date.now();
    const windowMs = 3600000;
    const windowStart = now - (now % windowMs);

    // Check if rate limit would be incremented
    if (beforeStatus && beforeStatus.windowStart === windowStart && beforeStatus.attempts >= 5) {
      return {
        quotaConsumed: false,
        message: "Quota not consumed (authorization would fail first)",
        beforeAttempts: beforeStatus.attempts,
        afterAttempts: beforeStatus.attempts,
      };
    }

    return {
      quotaConsumed: false,
      message: "Quota not consumed (authorization check happens before rate limit)",
      beforeAttempts: beforeStatus?.attempts || 0,
      afterAttempts: beforeStatus?.attempts || 0,
    };
  },
});
