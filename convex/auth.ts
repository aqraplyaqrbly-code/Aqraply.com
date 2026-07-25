import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateSessionToken(): string {
  // Generate a random session token
  return Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2);
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  // Check if it's a bcrypt hash (starts with $2, $2a, or $2b)
  if (storedHash.startsWith("$2") || storedHash.startsWith("$2a") || storedHash.startsWith("$2b")) {
    return bcrypt.compare(password, storedHash);
  }

  // Legacy: plain text comparison for old accounts
  // This will be upgraded to bcrypt on successful login
  return password === storedHash;
}

// Custom getAuthUserId for use in other Convex functions
// This function extracts the user ID from the session token in the request headers or args
export async function getAuthUserId(ctx: any, sessionToken?: string | null): Promise<Id<"users"> | null> {
  // First try to get session token from args (for queries/mutations)
  let token = sessionToken;
  
  // Debug logging
  console.log("[getAuthUserId] Received sessionToken:", sessionToken);
  
  // If not in args, try to get from request headers (for actions)
  if (!token) {
    token = ctx.request?.headers?.get("x-session-token") || null;
  }
  
  if (!token) {
    console.log("[getAuthUserId] No token found, returning null");
    return null;
  }

  console.log("[getAuthUserId] Looking for session with token:", token);

  // Find session in sessions table
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  console.log("[getAuthUserId] Found session:", session ? "YES" : "NO");

  if (!session) {
    console.log("[getAuthUserId] ERROR: Session not found in database");
    return null;
  }

  // Check if session expired
  if (session.expiresAt && session.expiresAt < Date.now()) {
    console.log("[getAuthUserId] ERROR: Session expired at:", new Date(session.expiresAt).toISOString());
    // Cannot delete in this context, just return null
    return null;
  }

  console.log("[getAuthUserId] Authenticated userId:", session.userId);
  return session.userId;
}

// Helper function to get auth user ID from query args
export async function getAuthUserIdFromArgs(ctx: any): Promise<Id<"users"> | null> {
  const sessionToken = ctx.args?.sessionToken || null;
  return getAuthUserId(ctx, sessionToken);
}

// Custom Sign In - Pure Custom Auth (Action to support bcrypt)
export const signIn = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; sessionToken: string; userId: Id<"users"> }> => {
    const email = normalizeEmail(args.email);

    console.log("[signIn] Input email:", args.email);
    console.log("[signIn] Normalized email:", email);

    // Find user by email
    const user = await ctx.runQuery(internal.authInternal.findUserByEmail, { email });

    console.log("[signIn] Found user:", user ? "YES" : "NO");
    if (user) {
      console.log("[signIn] User ID:", user._id);
      console.log("[signIn] User email:", user.email);
      console.log("[signIn] User passwordHash:", user.passwordHash ? "EXISTS" : "MISSING");
      console.log("[signIn] User passwordHash type:", user.passwordHash?.startsWith("$2") ? "BCRYPT" : "PLAINTEXT");
    }

    if (!user) {
      console.log("[signIn] ERROR: User not found");
      throw new ConvexError("Invalid credentials");
    }

    if (!user.passwordHash) {
      console.log("[signIn] ERROR: User has no passwordHash");
      throw new ConvexError("Invalid credentials");
    }

    // Verify password
    let isPasswordValid: boolean;
    if (user.passwordHash.startsWith("$2") || user.passwordHash.startsWith("$2a") || user.passwordHash.startsWith("$2b")) {
      console.log("[signIn] Using bcrypt comparison");
      isPasswordValid = await bcrypt.compare(args.password, user.passwordHash);
      console.log("[signIn] Bcrypt comparison result:", isPasswordValid);
    } else {
      // Legacy: plain text comparison
      console.log("[signIn] Using plaintext comparison");
      isPasswordValid = args.password === user.passwordHash;
      console.log("[signIn] Plaintext comparison result:", isPasswordValid);
    }

    if (!isPasswordValid) {
      console.log("[signIn] ERROR: Password verification failed");
      throw new ConvexError("Invalid credentials");
    }

    // Upgrade legacy plain text passwords to bcrypt hash
    if (!user.passwordHash.startsWith("$2") && !user.passwordHash.startsWith("$2a") && !user.passwordHash.startsWith("$2b")) {
      console.log("[signIn] Upgrading plaintext password to bcrypt");
      const hashedPassword = await bcrypt.hash(args.password, 10);
      await ctx.runMutation(internal.authInternal.upgradeUserPassword, {
        userId: user._id,
        hashedPassword,
      });
      console.log("[signIn] Password upgraded successfully");
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    console.log("[signIn] Generated sessionToken");

    // Store session using internal mutation
    await ctx.runMutation(internal.authInternal.createSession, {
      userId: user._id,
      token: sessionToken,
    });
    console.log("[signIn] Session created successfully");

    console.log("[signIn] Login successful for user:", user._id);

    return {
      success: true,
      sessionToken,
      userId: user._id,
    };
  },
});

// Custom Sign Up - Pure Custom Auth (Action to support bcrypt)
export const signUp = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; sessionToken: string; userId: Id<"users"> }> => {
    const email = normalizeEmail(args.email);

    // Check if user already exists
    const existing = await ctx.runQuery(internal.authInternal.findUserByEmail, { email });

    if (existing) {
      throw new ConvexError("Account already exists");
    }

    // Validate password length
    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Create user using internal mutation
    const userId: Id<"users"> = await ctx.runMutation(internal.authInternal.createUserWithPassword, {
      email,
      passwordHash: hashedPassword,
    });

    // Generate session token
    const sessionToken = generateSessionToken();

    // Store session using internal mutation
    await ctx.runMutation(internal.authInternal.createSession, {
      userId,
      token: sessionToken,
    });

    return {
      success: true,
      sessionToken,
      userId,
    };
  },
});

// Custom Sign Out - Pure Custom Auth
export const signOut = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Delete session
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Get Current User - Pure Custom Auth
export const getCurrentUser = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionToken) {
      return null;
    }

    // Find session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.sessionToken))
      .first();

    if (!session) {
      return null;
    }

    // Check if session expired
    if (session.expiresAt && session.expiresAt < Date.now()) {
      // Cannot delete in query context, just return null
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    // Get profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    // Check if suspended
    if (profile && profile.isSuspended) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      profile,
    };
  },
});

// Create user profile mutation
export const createUserProfile = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    password: v.string(),
    fullName: v.string(),
    role: v.string(),
    location: v.optional(
      v.object({
        address: v.string(),
        addressAr: v.string(),
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user ID (either from args or from context)
    let userId = args.userId;

    if (!userId) {
      const authUserId = await getAuthUserId(ctx, args.sessionToken);
      if (!authUserId) {
        throw new ConvexError("يجب تسجيل الدخول أولاً");
      }
      userId = authUserId as any;
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId!))
      .first();

    if (existingProfile) {
      throw new ConvexError("الملف الشخصي موجود بالفعل");
    }

    // Check if phone already exists (if provided)
    if (args.phone) {
      const existingProfileByPhone = await ctx.db
        .query("profiles")
        .withIndex("by_phone", (q) => q.eq("phone", args.phone!))
        .first();

      if (existingProfileByPhone) {
        throw new ConvexError("رقم الهاتف مستخدم بالفعل");
      }
    }

    // Create user profile
    const profileId = await ctx.db.insert("profiles", {
      userId: userId!,
      role: args.role as "customer" | "merchant" | "captain" | "admin" | "owner",
      fullName: args.fullName,
      phone: args.phone || "",
      phoneVerified: false,
      isActive: true,
      isOnline: true,
      lastSeen: Date.now(),
      registrationDate: Date.now(),
      location: args.location ?? {
        address: "",
        addressAr: "",
        latitude: 0,
        longitude: 0,
      },
      isSuspended: false,
      isOwner: args.role === "owner",
    });

    return {
      success: true,
      userId: userId!,
      profileId,
    };
  },
});

// Reset all passwords to a default value (Action to support bcrypt)
export const resetAllPasswords = action({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.authInternal.getAllUsers);
    const newPassword = "Password123!";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let updated = 0;
    for (const user of users) {
      if (user.email) {
        // Update the user with hashed password using internal mutation
        await ctx.runMutation(internal.authInternal.upgradeUserPassword, {
          userId: user._id,
          hashedPassword,
        });
        updated++;
      }
    }

    return {
      success: true,
      updated,
      message: `تم تحديث ${updated} مستخدم`,
      credentials: {
        password: newPassword,
        note: "استخدم هذه كلمة المرور لجميع المستخدمين",
      },
    };
  },
});

