import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

const DEFAULT_ADMIN_EMAILS = ["markezzat39@gmail.com"];

function getAdminEmails(): string[] {
  // In Convex, process.env is not available. Use hardcoded values or Convex secrets
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
    role: v.union(v.literal("customer"), v.literal("merchant"), v.literal("captain")),
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

    // Check if captain approval is required from system settings
    const systemSettings = await ctx.db.query("systemSettings").first();
    const requireCaptainApproval = systemSettings?.captainApprovalRequired ?? true;
    const requireStoreApproval = systemSettings?.storeApprovalRequired ?? true;

    // Determine if approval is required based on role
    const needsApproval =
      (role === "captain" && requireCaptainApproval) ||
      (role === "merchant" && requireStoreApproval);

    const profileId = await ctx.db.insert("profiles", {
      userId,
      role: role,
      fullName: fullName,
      phone: phone,
      phoneVerified: false,
      isActive: !needsApproval, // Only active if approval not required
      isOnline: !needsApproval,
      isApproved: !needsApproval, // Set approval status
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
      isOwner: false, // Always false for registration - owner assigned server-side
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
        // Promote to admin only, NOT owner
        await ctx.db.patch(existingProfile._id, { role: "admin" });
        return { ok: true as const, promoted: true as const };
      }
      // Already admin
      return { ok: true as const, promoted: false as const };
    }

    // Create admin profile without owner status
    const profileId = await ctx.db.insert("profiles", {
      userId,
      role: "admin",
      fullName: "مدير النظام",
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
      isOwner: false, // Admin does not automatically get owner status
    });

    return { ok: true as const, created: true as const, profileId };
  },
});

// REMOVED: makeOwner - Security vulnerability
// This function was removed as it allowed any authenticated user to promote themselves to Owner.
// Use setOwnerByEmail with proper owner authorization instead.

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

// Set user as owner by email (for initial setup - Owner only)
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

    // Check if current user is owner
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!currentProfile || !currentProfile.isOwner) {
      throw new ConvexError("غير مصرح - فقط المالك يمكنه تعيين مالك");
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email.trim().toLowerCase()))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // Prevent modifying own isOwner status
    if (user._id === userId) {
      throw new ConvexError("لا يمكن تعديل حالة المالك الخاصة بك");
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
    });

    return { success: true };
  },
});

// Save FCM Token for push notifications
export const saveFcmToken = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    fcmToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, fcmToken } = args;
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

    // Update profile with FCM token
    await ctx.db.patch(profile._id, {
      fcmToken: fcmToken,
    });

    return { success: true };
  },
});
