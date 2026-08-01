import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Internal mutation to create user with hashed password
export const createUserWithPassword = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: Date.now(),
    });
    return userId;
  },
});

// Internal mutation to create session
export const createSession = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("[createSession] Creating session for userId:", args.userId);
    console.log("[createSession] Session token:", args.token);
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    console.log("[createSession] Expires at:", new Date(expiresAt).toISOString());
    
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      createdAt: Date.now(),
      expiresAt,
    });
    
    console.log("[createSession] Session created with ID:", sessionId);
    return sessionId;
  },
});

// Internal mutation to delete sessions
export const deleteSessions = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
  },
});

// Internal mutation to upgrade password to hash
export const upgradeUserPassword = internalMutation({
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

// Internal query to find user by email
export const findUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("[findUserByEmail] Searching for email:", args.email);
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.email))
      .first();
    console.log("[findUserByEmail] Found user:", user ? "YES" : "NO");
    if (user) {
      console.log("[findUserByEmail] User ID:", user._id);
      console.log("[findUserByEmail] User email:", user.email);
      console.log("[findUserByEmail] User has passwordHash:", user.passwordHash ? "YES" : "NO");
      console.log("[findUserByEmail] User has password:", user.password ? "YES" : "NO");
    }
    return user;
  },
});

// Internal query to get all users
export const getAllUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Internal query to check if admin profile exists
export const getAdminProfile = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
  },
});

// Internal mutation to create admin profile
export const createAdminProfile = internalMutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("profiles", {
      userId: args.userId,
      role: "admin",
      fullName: args.fullName,
      phone: "",
      phoneVerified: true,
      email: args.email,
      avatar: undefined,
      isActive: true,
      isOnline: false,
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
  },
});

// Internal mutation to create admin permissions
export const createAdminPermissions = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminPermissions", {
      userId: args.userId,
      manage_users: true,
      manage_orders: true,
      manage_stores: true,
      manage_products: true,
      manage_captains: true,
      manage_notifications: true,
      view_reports: true,
      manage_settings: true,
      view_activity_logs: true,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
