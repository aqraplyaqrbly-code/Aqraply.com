import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const hasPasswordAccount = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), email))
      .first();
    return user !== null && user.passwordHash !== undefined;
  },
});

export const createAdminUser = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash: args.passwordHash,
      createdAt: Date.now(),
    });
    return { userId };
  },
});

export const updateAdminPassword = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), email))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    await ctx.db.patch(user._id, { passwordHash: args.passwordHash });
  },
});

export const ensureAdminProfileInternal = internalMutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), email))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      await ctx.db.insert("profiles", {
        userId: user._id,
        role: "admin",
        fullName: args.fullName ?? "مدير النظام",
        phone: "0000000000",
        phoneVerified: false,
        isActive: true,
        isOnline: true,
        isApproved: true,
        lastSeen: Date.now(),
        registrationDate: Date.now(),
        location: {
          address: "",
          addressAr: "",
          latitude: 0,
          longitude: 0,
        },
        isSuspended: false,
        isOwner: false,
      });
    } else if (profile.role !== "admin") {
      await ctx.db.patch(profile._id, { role: "admin" });
    }

    return { userId: user._id as Id<"users">, email };
  },
});
