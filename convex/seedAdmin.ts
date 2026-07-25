import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";

/**
 * Seed Script for Creating First Admin Account
 * 
 * This action creates the first admin account with secure credentials.
 * It should only be run once during initial setup.
 * 
 * USAGE:
 * Run this from the Convex dashboard or via:
 * npx convex run seedAdmin --args '{"email":"admin@aqraply.com","password":"SecurePassword123!","fullName":"Admin User"}'
 */

export const seedAdmin = action({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId: Id<"users">; profileId: Id<"profiles">; message: string; credentials: { email: string; note: string } }> => {
    // Normalize email
    const email = args.email.trim().toLowerCase();

    // Check if admin already exists
    const existingUser = await ctx.runQuery(internal.authInternal.findUserByEmail, { email });

    if (existingUser) {
      throw new ConvexError("Admin account already exists");
    }

    // Check if any admin profile exists
    const existingAdminProfile = await ctx.runQuery(internal.authInternal.getAdminProfile);

    if (existingAdminProfile) {
      throw new ConvexError("An admin already exists in the system");
    }

    // Validate password length
    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Create user account using internal mutation
    const userId: Id<"users"> = await ctx.runMutation(internal.authInternal.createUserWithPassword, {
      email,
      passwordHash: hashedPassword,
    });

    // Create admin profile using internal mutation
    const profileId: Id<"profiles"> = await ctx.runMutation(internal.authInternal.createAdminProfile, {
      userId,
      fullName: args.fullName,
      email,
    });

    // Create admin permissions using internal mutation
    await ctx.runMutation(internal.authInternal.createAdminPermissions, {
      userId,
    });

    return {
      success: true,
      userId,
      profileId,
      message: "Admin account created successfully",
      credentials: {
        email: args.email,
        note: "Use the provided password to sign in. Store credentials securely.",
      },
    };
  },
});

/**
 * Reset Admin Password
 * Use this if you need to reset the admin password
 */
export const resetAdminPassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!profile || profile.role !== "admin") {
      throw new ConvexError("User is not an admin");
    }

    // Validate password length
    if (args.newPassword.length < 8) {
      throw new ConvexError("Password must be at least 8 characters");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(args.newPassword, 10);

    // Update the password with hash
    await ctx.db.patch(user._id, {
      passwordHash: hashedPassword,
    });

    return {
      success: true,
      message: "Admin password reset successfully",
    };
  },
});
