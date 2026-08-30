import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "./auth";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { internal } from "./_generated/api";

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

// Helper function to send OTP email via Resend
async function sendOTPEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رمز التحقق - Aqraply</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 36px;
            margin-bottom: 20px;
          }
          .otp-container {
            background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%);
            border: 2px solid #f97316;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
          }
          .otp {
            font-size: 48px;
            font-weight: bold;
            color: #dc2626;
            letter-spacing: 8px;
            margin: 20px 0;
          }
          .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            text-align: right;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .footer a {
            color: #f97316;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Aqraply - أقربلي</h1>
          </div>
          <div class="content">
            <div class="logo">🔐</div>
            <h2 style="color: #1f2937; margin-bottom: 10px;">رمز التحقق</h2>
            <p class="message">
              مرحباً بك في Aqraply - أقربلي
              <br><br>
              لقد طلبت إعادة تعيين كلمة المرور لحسابك
              <br>
              استخدم رمز التحقق التالي لإكمال العملية:
            </p>
            <div class="otp-container">
              <div class="otp">${otp}</div>
            </div>
            <p class="message">
              هذا الرمز صالح لمدة 10 دقائق فقط
              <br>
              إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة
            </p>
            <div class="warning">
              ⚠️ <strong>تحذير هام:</strong>
              <br>
              لا تشارك هذا الرمز مع أي شخص، حتى لو ادعى أنه من فريق Aqraply
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Aqraply - أقربلي. جميع الحقوق محفوظة.</p>
            <p>
              تحتاج إلى مساعدة؟ 
              <a href="mailto:support@aqraply.com">تواصل معنا</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "رمز التحقق - Aqraply - أقربلي",
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Get all OTPs for a user (internal)
export const getUserOTPsInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const otps = await ctx.db
      .query("otpVerifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return otps;
  },
});

// Delete an OTP (internal)
export const deleteOTPInternal = internalMutation({
  args: {
    otpId: v.id("otpVerifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.otpId);
  },
});

// Store OTP (internal)
export const storeOTPInternal = internalMutation({
  args: {
    userId: v.id("users"),
    identifier: v.string(),
    identifierType: v.union(v.literal("email"), v.literal("phone")),
    otp: v.string(),
    otpHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    attempts: v.number(),
    maxAttempts: v.number(),
    isVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("otpVerifications", {
      userId: args.userId,
      identifier: args.identifier,
      identifierType: args.identifierType,
      otp: args.otp,
      otpHash: args.otpHash,
      expiresAt: args.expiresAt,
      createdAt: args.createdAt,
      attempts: args.attempts,
      maxAttempts: args.maxAttempts,
      isVerified: args.isVerified,
    });
  },
});

// Log security event (internal)
export const logSecurityEventInternal = internalMutation({
  args: {
    eventType: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("password_reset_request"),
      v.literal("password_reset_complete"),
      v.literal("password_change"),
      v.literal("otp_verification"),
      v.literal("failed_login"),
      v.literal("failed_otp"),
      v.literal("account_created"),
      v.literal("account_deleted")
    ),
    userId: v.optional(v.id("users")),
    success: v.boolean(),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("securityLogs", {
      userId: args.userId,
      eventType: args.eventType,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      details: args.details,
      success: args.success,
      timestamp: Date.now(),
    });
  },
});

// Request OTP for password reset
export const requestPasswordResetOTP = action({
  args: {
    identifier: v.string(), // email or phone
    identifierType: v.union(v.literal("email"), v.literal("phone")),
  },
  handler: async (ctx, args) => {
    // Find user by email or phone
    let user;
    if (args.identifierType === "email") {
      user = await ctx.runQuery(internal.authInternal.findUserByEmail, { email: args.identifier });
    } else {
      user = await ctx.runQuery(internal.authInternal.findUserByPhone, { phone: args.identifier });
    }

    // Don't reveal if user exists for security
    if (!user) {
      return {
        success: true,
        message: "إذا كان البريد الإلكتروني أو رقم الهاتف مسجلاً، ستصلك رسالة التحقق",
      };
    }

    // Clean up expired OTPs
    const oldOTPs = await ctx.runQuery(internal.security.getUserOTPsInternal, {
      userId: user._id,
    });

    for (const otp of oldOTPs) {
      if (otp.expiresAt < Date.now()) {
        await ctx.runMutation(internal.security.deleteOTPInternal, { otpId: otp._id });
      }
    }

    // Check rate limiting (max 3 OTPs in 10 minutes)
    const recentOTPs = oldOTPs.filter(
      (otp: any) => otp.createdAt > Date.now() - 600000 // 10 minutes
    );

    if (recentOTPs.length >= 3) {
      throw new ConvexError("عدد محاولات الطلب كثير. الرجاء المحاولة بعد 10 دقائق");
    }

    // Generate secure OTP
    const otp = generateSecureOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    await ctx.runMutation(internal.security.storeOTPInternal, {
      userId: user._id,
      identifier: args.identifier,
      identifierType: args.identifierType,
      otp,
      otpHash,
      expiresAt,
      createdAt: Date.now(),
      attempts: 0,
      maxAttempts: 5,
      isVerified: false,
    });

    // Log security event
    await ctx.runMutation(internal.security.logSecurityEventInternal, {
      eventType: "password_reset_request",
      userId: user._id,
      success: true,
      details: `OTP sent to ${args.identifierType}: ${args.identifier}`,
    });

    // Send OTP via Email if identifier is email
    let emailSent = false;
    let emailError = "";
    if (args.identifierType === "email") {
      const emailResult = await sendOTPEmail(args.identifier, otp);
      emailSent = emailResult.success;
      emailError = emailResult.error || "";
      
      if (!emailSent) {
        console.error("Failed to send OTP email:", emailError);
        // Still return success for security (don't reveal if email failed)
      }
    }

    return {
      success: true,
      message: emailSent ? "تم إرسال رمز التحقق بنجاح" : "تم إنشاء رمز التحقق",
      otp, // Return OTP for development
      emailSent,
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
