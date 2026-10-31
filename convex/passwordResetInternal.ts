import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Helper function to hash OTP using crypto.subtle
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + (process.env.OTP_SECRET || "default-secret"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Internal query to get OTP record by email
export const getOtpRecord = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.email).eq("identifierType", "email")
      )
      .first();
  },
});

// Internal query to get all OTPs by email
export const getOTPsByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.email).eq("identifierType", "email")
      )
      .collect();
  },
});

// Internal mutation to create OTP
export const createOTP = internalMutation({
  args: {
    userId: v.id("users"),
    identifier: v.string(),
    identifierType: v.string(),
    otp: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const otpHash = await hashOTP(args.otp);
    await ctx.db.insert("otpVerifications", {
      userId: args.userId,
      identifier: args.identifier,
      identifierType: args.identifierType as any,
      otp: args.otp,
      otpHash,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
      isVerified: false,
      attempts: 0,
      maxAttempts: 3,
    });
  },
});

// Internal mutation to delete OTP
export const deleteOtp = internalMutation({
  args: {
    otpId: v.id("otpVerifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.otpId);
  },
});

// Internal mutation to update user password
export const updateUserPassword = internalMutation({
  args: {
    email: v.string(),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    await ctx.db.patch(user._id, {
      passwordHash: args.hashedPassword,
    });
  },
});

// Internal query to get user by ID
export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Internal mutation to update user password by ID
export const updateUserPasswordById = internalMutation({
  args: {
    userId: v.id("users"),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      passwordHash: args.hashedPassword,
    });
  },
});

// Internal mutation to increment OTP attempts
export const incrementOtpAttempts = internalMutation({
  args: {
    otpId: v.id("otpVerifications"),
  },
  handler: async (ctx, args) => {
    const otpRecord = await ctx.db.get(args.otpId);
    if (otpRecord) {
      await ctx.db.patch(args.otpId, {
        attempts: otpRecord.attempts + 1,
      });
    }
  },
});

// Internal mutation to mark OTP as verified
export const markOtpVerified = internalMutation({
  args: {
    otpId: v.id("otpVerifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.otpId, {
      isVerified: true,
      verifiedAt: Date.now(),
    });
  },
});
