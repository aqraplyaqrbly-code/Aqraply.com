import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

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
