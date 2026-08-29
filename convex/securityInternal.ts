import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Find user by identifier (email or phone)
export const findUserByIdentifier = query({
  args: {
    identifier: v.string(),
    identifierType: v.union(v.literal("email"), v.literal("phone")),
  },
  handler: async (ctx, args) => {
    let user;
    if (args.identifierType === "email") {
      user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", args.identifier))
        .first();
    } else {
      user = await ctx.db
        .query("users")
        .withIndex("phone", (q) => q.eq("phone", args.identifier))
        .first();
    }
    return user;
  },
});

// Get all OTPs for a user
export const getUserOTPs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const otps = await ctx.db
      .query("otpVerifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return otps;
  },
});

// Delete an OTP
export const deleteOTP = mutation({
  args: {
    otpId: v.id("otpVerifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.otpId);
  },
});

// Store OTP
export const storeOTP = mutation({
  args: {
    userId: v.id("users"),
    identifier: v.string(),
    identifierType: v.union(v.literal("email"), v.literal("phone")),
    otp: v.string(),
    otpHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    attempts: v.number(),
    maxAttempts: v.number(),
    isVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("otpVerifications", {
      userId: args.userId,
      identifier: args.identifier,
      identifierType: args.identifierType,
      otp: args.otp,
      otpHash: args.otpHash,
      expiresAt: args.expiresAt,
      createdAt: args.createdAt,
      attempts: args.attempts,
      maxAttempts: args.maxAttempts,
      isVerified: args.isVerified,
    });
  },
});

// Log security event
export const logSecurityEvent = mutation({
  args: {
    eventType: v.string(),
    userId: v.optional(v.id("users")),
    success: v.boolean(),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("securityLogs", {
      userId: args.userId,
      eventType: args.eventType,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      details: args.details,
      success: args.success,
      timestamp: Date.now(),
    });
  },
});
