import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// الحصول على جميع الكباتن (للإدارة)
export const getAllCaptains = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لعرض الكباتن");
    }

    const captains = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "captain"))
      .collect();

    return captains;
  },
});

// الحصول على الكباتن المتاحين
export const getAvailableCaptains = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لعرض الكباتن");
    }

    const captains = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "captain"))
      .collect();

    return captains.filter((captain) => captain.isActive && captain.isOnline);
  },
});

// تحديث حالة الكابتن
export const updateCaptainStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, isOnline } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("ليس لديك صلاحية لتحديث حالة الكابتن");
    }

    await ctx.db.patch(profile._id, {
      isOnline: isOnline,
      lastSeen: Date.now(),
    });

    return { success: true };
  },
});
