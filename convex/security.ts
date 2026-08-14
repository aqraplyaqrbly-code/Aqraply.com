import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "./auth";
import bcrypt from "bcryptjs";

// Helper function to generate secure OTP
function generateSecureOTP(): string {
  // Generate 6-digit cryptographically secure random OTP
  const min = 100000;
  const max = 999999;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random = array[0] / (0xFFFFFFFF + 1);
  const otp = Math.floor(random * (max - min + 1)) + min;
  return otp.toString();
}

// Helper function to hash OTP
async function hashOTP(otp: string): Promise<string> {
  // Always hash OTP for security - removed development bypass
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + (process.env.OTP_SECRET || "default-secret"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper function to hash token
async function hashToken(token: string): Promise<string> {
  // In development, return plain token for easier testing
  if (process.env.NODE_ENV === "development" || !process.env.TOKEN_SECRET) {
    return token;
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(token + process.env.TOKEN_SECRET);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper function to log security events
async function logSecurityEvent(
  ctx: any,
  eventType: any,
  userId?: any,
  success: boolean = true,
  details?: string,
  ipAddress?: string,
  userAgent?: string
) {
  await ctx.db.insert("securityLogs", {
    userId,
    eventType,
    ipAddress,
    userAgent,
    details,
    success,
    timestamp: Date.now(),
  });
}

// Request OTP for password reset
export const requestPasswordResetOTP = mutation({
  args: {
    identifier: v.string(), // email or phone
    identifierType: v.union(v.literal("email"), v.literal("phone")),
  },
  handler: async (ctx, args) => {
    // Find user by email or phone
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

    // Don't reveal if user exists for security
    if (!user) {
      return {
        success: true,
        message: "إذا كان البريد الإلكتروني أو رقم الهاتف مسجلاً، ستصلك رسالة التحقق",
      };
    }

    // Clean up expired OTPs
    const oldOTPs = await ctx.db
      .query("otpVerifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const otp of oldOTPs) {
      if (otp.expiresAt < Date.now()) {
        await ctx.db.delete(otp._id);
      }
    }

    // Check rate limiting (max 3 OTPs in 10 minutes)
    const recentOTPs = oldOTPs.filter(
      (otp) => otp.createdAt > Date.now() - 600000 // 10 minutes
    );

    if (recentOTPs.length >= 3) {
      throw new ConvexError("عدد محاولات الطلب كثير. الرجاء المحاولة بعد 10 دقائق");
    }

    // Generate secure OTP
    const otp = generateSecureOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    await ctx.db.insert("otpVerifications", {
      userId: user._id,
      identifier: args.identifier,
      identifierType: args.identifierType,
      otp, // Store plain OTP for sending (will be deleted after verification)
      otpHash,
      expiresAt,
      createdAt: Date.now(),
      attempts: 0,
      maxAttempts: 5,
      isVerified: false,
    });

    // Log security event
    await logSecurityEvent(
      ctx,
      "password_reset_request",
      user._id,
      true,
      `OTP sent to ${args.identifierType}: ${args.identifier}`
    );

    // TODO: Send OTP via Email/SMS/WhatsApp
    console.log(`OTP for ${args.identifier}: ${otp}`);

    return {
      success: true,
      message: "تم إرسال رمز التحقق بنجاح",
    };
  },
});

// Verify OTP
export const verifyOTP = mutation({
  args: {
    identifier: v.string(),
    identifierType: v.union(v.literal("email"), v.literal("phone")),
    otp: v.string(),
  },
  handler: async (ctx, args) => {
    // Find OTP record
    const otpRecord = await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.identifier).eq("identifierType", args.identifierType)
      )
      .first();

    if (!otpRecord) {
      await logSecurityEvent(
        ctx,
        "failed_otp",
        undefined,
        false,
        `Invalid OTP for ${args.identifier}`
      );
      throw new ConvexError("رمز التحقق غير صحيح");
    }

    if (otpRecord.isVerified) {
      throw new ConvexError("رمز التحقق مستخدم بالفعل");
    }

    if (otpRecord.expiresAt < Date.now()) {
      await logSecurityEvent(
        ctx,
        "failed_otp",
        otpRecord.userId,
        false,
        `Expired OTP for ${args.identifier}`
      );
      throw new ConvexError("رمز التحقق منتهي الصلاحية");
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await logSecurityEvent(
        ctx,
        "failed_otp",
        otpRecord.userId,
        false,
        `Max attempts reached for ${args.identifier}`
      );
      throw new ConvexError("تم تجاوز الحد الأقصى للمحاولات. الرجاء طلب رمز جديد");
    }

    // Verify OTP
    const providedOTPHash = await hashOTP(args.otp);
    if (providedOTPHash !== otpRecord.otpHash) {
      // Increment attempts
      await ctx.db.patch(otpRecord._id, {
        attempts: otpRecord.attempts + 1,
      });

      await logSecurityEvent(
        ctx,
        "failed_otp",
        otpRecord.userId,
        false,
        `Invalid OTP attempt ${otpRecord.attempts + 1}/${otpRecord.maxAttempts} for ${args.identifier}`
      );

      throw new ConvexError("رمز التحقق غير صحيح");
    }

    // Mark as verified
    await ctx.db.patch(otpRecord._id, {
      isVerified: true,
      verifiedAt: Date.now(),
    });

    // Log security event
    await logSecurityEvent(
      ctx,
      "otp_verification",
      otpRecord.userId,
      true,
      `OTP verified for ${args.identifier}`
    );

    return {
      success: true,
      userId: otpRecord.userId,
      message: "تم التحقق بنجاح",
    };
  },
});

// Reset password after OTP verification
export const resetPasswordWithOTP = mutation({
  args: {
    identifier: v.string(),
    identifierType: v.union(v.literal("email"), v.literal("phone")),
    otp: v.string(),
    newPassword: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate passwords match
    if (args.newPassword !== args.confirmPassword) {
      throw new ConvexError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
    }

    // Validate password strength
    if (args.newPassword.length < 8) {
      throw new ConvexError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }

    // Find and verify OTP
    const otpRecord = await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.identifier).eq("identifierType", args.identifierType)
      )
      .first();

    if (!otpRecord || !otpRecord.isVerified) {
      throw new ConvexError("يجب التحقق من رمز OTP أولاً");
    }

    if (otpRecord.expiresAt < Date.now()) {
      throw new ConvexError("رمز التحقق منتهي الصلاحية");
    }

    // Update user password with hash
    const hashedPassword = await bcrypt.hash(args.newPassword, 10);
    await ctx.db.patch(otpRecord.userId, {
      passwordHash: hashedPassword,
    });

    // Delete OTP record
    await ctx.db.delete(otpRecord._id);

    // Log security event
    await logSecurityEvent(
      ctx,
      "password_reset_complete",
      otpRecord.userId,
      true,
      `Password reset for ${args.identifier}`
    );

    return {
      success: true,
      message: "تم إعادة تعيين كلمة المرور بنجاح",
    };
  },
});

// Change password for authenticated user
export const changePassword = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    currentPassword: v.string(),
    newPassword: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, currentPassword, newPassword, confirmPassword } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new ConvexError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new ConvexError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
    }

    // Validate new password is different from current
    if (currentPassword === newPassword) {
      throw new ConvexError("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية");
    }

    // Get current user
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // Verify current password
    if (user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new ConvexError("كلمة المرور الحالية غير صحيحة");
      }
    }

    // Update password with hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await ctx.db.patch(userId, {
      passwordHash: hashedPassword,
    });

    // Log security event
    await logSecurityEvent(
      ctx,
      "password_change",
      userId,
      true,
      "Password changed by user"
    );

    return {
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    };
  },
});

// Get security logs for a user (admin only)
export const getUserSecurityLogs = query({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId, limit } = args;
    const currentUserId = await getAuthUserId(ctx, sessionToken);
    if (!currentUserId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin or requesting their own logs
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner" && currentUserId !== userId)) {
      throw new ConvexError("ليس لديك صلاحية لعرض السجلات الأمنية");
    }

    const logs = await ctx.db
      .query("securityLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit || 50);

    return logs;
  },
});

// Get recent failed login attempts
export const getFailedLoginAttempts = query({
  args: {
    identifier: v.string(),
  },
  handler: async (ctx, args) => {
    const recentAttempts = await ctx.db
      .query("securityLogs")
      .withIndex("by_event", (q) => q.eq("eventType", "failed_login"))
      .filter((q) => q.eq(q.field("details"), args.identifier))
      .collect();

    const recent = recentAttempts.filter(
      (log) => log.timestamp > Date.now() - 15 * 60 * 1000 // 15 minutes
    );

    return recent.length;
  },
});
