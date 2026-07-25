import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

const DEFAULT_ADMIN_EMAILS = ["markezzat39@gmail.com"];

function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS;
  if (fromEnv) {
    return fromEnv.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  }
  return DEFAULT_ADMIN_EMAILS;
}

// Get current user profile
export const getCurrentProfile = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

// Create profile
export const createProfile = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("merchant"), v.literal("captain"), v.literal("admin"), v.literal("owner")),
    fullName: v.string(),
    phone: v.string(),
    location: v.optional(
      v.object({
        address: v.string(),
        addressAr: v.string(),
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, role, fullName, phone, location, businessName, businessNameAr, vehicleType, vehicleNumber } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      // Return existing profile instead of throwing error (idempotent)
      return existingProfile._id;
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      role: role,
      fullName: fullName,
      phone: phone,
      phoneVerified: false,
      isActive: true,
      isOnline: true,
      lastSeen: Date.now(),
      registrationDate: Date.now(),
      location: location ?? {
        address: "",
        addressAr: "",
        latitude: 0,
        longitude: 0,
      },
      businessName: businessName,
      businessNameAr: businessNameAr,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber,
      isSuspended: false,
      isOwner: false,
    });

    return profileId;
  },
});

/** Grants admin role for allowlisted emails (e.g. after bootstrap or role mismatch). */
export const ensureAdminRole = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }
    // Ensure we have a user document (not a store or other table)
    if ("email" in user === false) {
      throw new ConvexError("Invalid user data");
    }
    const email = user.email?.trim().toLowerCase();
    if (!email || !getAdminEmails().includes(email)) {
      return { ok: false as const, reason: "not_admin_email" as const };
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      if (existingProfile.role !== "admin") {
        await ctx.db.patch(existingProfile._id, { role: "admin", isOwner: true });
        return { ok: true as const, promoted: true as const };
      }
      // Ensure isOwner is true for admin emails
      if (!existingProfile.isOwner) {
        await ctx.db.patch(existingProfile._id, { isOwner: true });
      }
      return { ok: true as const, promoted: false as const };
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      role: "admin",
      fullName: "مدير النظام",
      phone: "0000000000",
      phoneVerified: false,
      isActive: true,
      isOnline: true,
      lastSeen: Date.now(),
      registrationDate: Date.now(),
      location: {
        address: "",
        addressAr: "",
        latitude: 0,
        longitude: 0,
      },
      isSuspended: false,
      isOwner: true, // Set isOwner to true for admin emails
    });

    return { ok: true as const, created: true as const, profileId };
  },
});

/** Make current user owner (for development/testing) */
export const makeOwner = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!existingProfile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    await ctx.db.patch(existingProfile._id, {
      role: "admin",
      isOwner: true,
    });

    return { ok: true as const };
  },
});

// Update profile
export const updateProfile = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.object({
      address: v.string(),
      addressAr: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const { sessionToken, fullName, phone, location } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, { fullName, phone, location });
    return profile._id;
  },
});

// Set user as owner by email (for initial setup)
export const setOwnerByEmail = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, email } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email.trim().toLowerCase()))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // Find profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    // Update profile to be owner and admin
    await ctx.db.patch(profile._id, {
      isOwner: true,
      role: "admin",
    });

    return { success: true };
  },
});

// Update online status
export const updateOnlineStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, isOnline } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    // Update online status with timestamp tracking
    await ctx.db.patch(profile._id, {
      isOnline: isOnline,
      lastSeen: Date.now(),
      // Set connectedAt when going online, undefined when going offline
      ...(isOnline ? { connectedAt: Date.now() } : { connectedAt: undefined }),
    });

    return { success: true };
  },
});
