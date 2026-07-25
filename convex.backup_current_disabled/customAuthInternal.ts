import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Internal query to get user by ID
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Internal query to get user by email
export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Internal query to get user by phone
export const getUserByPhone = internalQuery({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
  },
});

// Internal query to get session by token
export const getSessionByToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
  },
});

// Internal query to get profile by userId
export const getProfileByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Internal query to get reset token by token
export const getResetTokenByToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
  },
});

// Internal mutation to create user
export const createUser = internalMutation({
  args: {
    email: v.string(),
    phone: v.string(),
    passwordHash: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      phone: args.phone,
      passwordHash: args.passwordHash,
      role: args.role,
      isSuspended: false,
      createdAt: Date.now(),
    });
    return userId;
  },
});

// Internal mutation to create session
export const createSession = internalMutation({
  args: { userId: v.id("users"), token: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      createdAt: Date.now(),
    });
  },
});

// Internal mutation to create profile
export const createProfile = internalMutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    phone: v.string(),
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("profiles", {
      userId: args.userId,
      role: args.role,
      fullName: args.fullName,
      phone: args.phone,
      email: args.email,
      phoneVerified: false,
      isActive: true,
      isOnline: true,
      lastSeen: Date.now(),
      registrationDate: Date.now(),
    });
  },
});

// Internal mutation to delete session
export const deleteSession = internalMutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
  },
});

// Internal mutation to update password
export const updatePassword = internalMutation({
  args: { userId: v.id("users"), passwordHash: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      passwordHash: args.passwordHash,
    });
  },
});

// Internal mutation to create password reset token
export const createPasswordResetToken = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await ctx.db.insert("passwordResetTokens", {
      userId: args.userId,
      token: args.token,
      expiresAt,
      isUsed: false,
      createdAt: Date.now(),
      email: args.email,
    });
  },
});

// Internal mutation to update reset token
export const markResetTokenUsed = internalMutation({
  args: { resetTokenId: v.id("passwordResetTokens") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resetTokenId, {
      isUsed: true,
      usedAt: Date.now(),
    });
  },
});
