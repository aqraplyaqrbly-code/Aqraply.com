import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthUserId } from "./auth";
import { Resend } from "resend";
import type { Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";

// Helper function to hash OTP using crypto.subtle
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + (process.env.OTP_SECRET || "default-secret"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper function to generate OTP
function generateSecureOTP(): string {
  const min = 100000;
  const max = 999999;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random = array[0] / (0xFFFFFFFF + 1);
  const otp = Math.floor(random * (max - min + 1)) + min;
  return otp.toString();
}

// طلب إعادة تعيين كلمة المرور - يرسل OTP على الإيميل
export const requestPasswordReset = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // البحث عن المستخدم بالبريد الإلكتروني
    const user = await ctx.runQuery(internal.authInternal.findUserByEmail, { email });

    if (!user) {
      // لا نكشف وجود المستخدم لأسباب أمنية
      return {
        success: true,
        message: "إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة إعادة تعيين كلمة المرور",
      };
    }

    // تنظيف رموز OTP قديمة منتهية الصلاحية
    const oldOTPs = await ctx.runQuery(internal.passwordResetInternal.getOTPsByEmail, { email });

    for (const otp of oldOTPs) {
      if (otp.expiresAt < Date.now()) {
        await ctx.runMutation(internal.passwordResetInternal.deleteOtp, { otpId: otp._id });
      }
    }

    // التحقق من محاولات متكررة (حماية من الهجمات)
    const recentOTPs = oldOTPs.filter(
      (otp: any) => otp.createdAt > Date.now() - 300000 // آخر 5 دقائق
    );

    if (recentOTPs.length >= 3) {
      throw new ConvexError("عدد محاولات الطلب كثير. الرجاء المحاولة لاحقاً");
    }

    // إنشاء OTP جديد
    const otp = generateSecureOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 دقائق

    // حفظ OTP
    await ctx.runMutation(internal.passwordResetInternal.createOTP, {
      userId: user._id,
      identifier: email,
      identifierType: "email",
      otp,
      expiresAt,
    });

    // إرسال OTP على الإيميل باستخدام Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
        to: email,
        subject: "كود إعادة تعيين كلمة المرور",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">إعادة تعيين كلمة المرور</h2>
            <p>مرحباً،</p>
            <p>كود إعادة تعيين كلمة المرور الخاص بك هو:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="font-size: 32px; color: #333; margin: 0; letter-spacing: 3px;">${otp}</h1>
            </div>
            <p>هذا الكود صالح لمدة 10 دقائق فقط</p>
            <p>إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة وعدم مشاركتها مع أحد</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              هذا رسالة آلية، يرجى عدم الرد عليها
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("خطأ في إرسال البريد الإلكتروني:", error);
      // لا نرمي خطأ هنا لأن هذا مجرد إرسال - الكود مخزن بالفعل
    }

    return {
      success: true,
      message: "إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة تحتوي على كود التحقق",
    };
  },
});

// التحقق من OTP
export const verifyResetOTP = action({
  args: {
    email: v.string(),
    otp: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId: Id<"users">; message: string }> => {
    const email = args.email.trim().toLowerCase();

    const otpRecord = await ctx.runQuery(internal.passwordResetInternal.getOtpRecord, { email });

    if (!otpRecord) {
      throw new ConvexError("رمز التحقق غير صحيح");
    }

    if (otpRecord.isVerified) {
      throw new ConvexError("رمز التحقق مستخدم بالفعل");
    }

    if (otpRecord.expiresAt < Date.now()) {
      throw new ConvexError("رمز التحقق منتهي الصلاحية");
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      throw new ConvexError("تم تجاوز الحد الأقصى للمحاولات. الرجاء طلب رمز جديد");
    }

    // التحقق من OTP
    const expectedHash = await hashOTP(args.otp);
    if (expectedHash !== otpRecord.otpHash) {
      await ctx.runMutation(internal.passwordResetInternal.incrementOtpAttempts, { otpId: otpRecord._id });
      throw new ConvexError("رمز التحقق غير صحيح");
    }

    // العثور على المستخدم
    const user: any = await ctx.runQuery(internal.authInternal.findUserByEmail, { email });

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // تحديث OTP كـ verified
    await ctx.runMutation(internal.passwordResetInternal.markOtpVerified, { otpId: otpRecord._id });

    return {
      success: true,
      userId: user._id,
      message: "رمز التحقق صحيح",
    };
  },
});

// إعادة تعيين كلمة المرور (Action to support bcrypt)
export const resetPassword = action({
  args: {
    email: v.string(),
    otp: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // التحقق من OTP
    const otpRecord = await ctx.runQuery(internal.passwordResetInternal.getOtpRecord, {
      email: args.email,
    });

    if (!otpRecord) {
      throw new ConvexError("رمز التحقق غير صحيح");
    }

    if (!otpRecord.isVerified) {
      throw new ConvexError("يجب التحقق من رمز التحقق أولاً");
    }

    if (otpRecord.expiresAt < Date.now()) {
      await ctx.runMutation(internal.passwordResetInternal.deleteOtp, { otpId: otpRecord._id });
      throw new ConvexError("رمز التحقق منتهي الصلاحية");
    }

    // التحقق من طول كلمة المرور الجديدة
    if (args.newPassword.length < 6) {
      throw new ConvexError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    // Hash the new password using crypto.subtle
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(args.newPassword + (process.env.PASSWORD_SECRET || "default-secret"));
    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // العثور على المستخدم وتحديث كلمة المرور
    await ctx.runMutation(internal.passwordResetInternal.updateUserPassword, {
      email: args.email,
      hashedPassword,
    });

    // حذف OTP بعد الاستخدام
    await ctx.runMutation(internal.passwordResetInternal.deleteOtp, { otpId: otpRecord._id });

    // إرسال إيميل تأكيد تغيير كلمة المرور
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
        to: args.email,
        subject: "تم تغيير كلمة المرور بنجاح",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">تم تغيير كلمة المرور</h2>
            <p>مرحباً،</p>
            <p>تم تغيير كلمة المرور لحسابك بنجاح.</p>
            <p>إذا كنت أنت من قام بهذا التغيير، فلا داعي للقلق.</p>
            <p>إذا لم تكن أنت من قام بتغيير كلمة المرور، يرجى التواصل معنا فوراً أو استخدام خاصية استعادة كلمة المرور.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              هذا رسالة آلية، يرجى عدم الرد عليها
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("خطأ في إرسال البريد الإلكتروني للتأكيد:", error);
    }

    return {
      success: true,
      message: "تم إعادة تعيين كلمة المرور بنجاح",
    };
  },
});

// تغيير كلمة المرور للمستخدم المسجل دخوله
export const changePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول لتغيير كلمة المرور");
    }

    // التحقق من طول كلمة المرور الجديدة
    if (args.newPassword.length < 6) {
      throw new ConvexError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
    }

    if (args.currentPassword === args.newPassword) {
      throw new ConvexError("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية");
    }

    // جلب بيانات المستخدم
    const user = await ctx.runQuery(internal.passwordResetInternal.getUserById, { userId });
    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // التحقق من كلمة المرور الحالية
    if (user.passwordHash) {
      const encoder = new TextEncoder();
      const currentPasswordData = encoder.encode(args.currentPassword + (process.env.PASSWORD_SECRET || "default-secret"));
      const currentHashBuffer = await crypto.subtle.digest("SHA-256", currentPasswordData);
      const currentHashArray = Array.from(new Uint8Array(currentHashBuffer));
      const currentHash = currentHashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      if (currentHash !== user.passwordHash) {
        throw new ConvexError("كلمة المرور الحالية غير صحيحة");
      }
    } else {
      throw new ConvexError("لا يمكن تغيير كلمة المرور. يرجى استخدام إعادة تعيين كلمة المرور");
    }

    // Hash the new password using crypto.subtle
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(args.newPassword + (process.env.PASSWORD_SECRET || "default-secret"));
    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // تحديث كلمة المرور
    await ctx.runMutation(internal.passwordResetInternal.updateUserPasswordById, {
      userId,
      hashedPassword,
    });

    // إرسال إيميل تأكيد تغيير كلمة المرور
    try {
      const user = await ctx.runQuery(internal.passwordResetInternal.getUserById, { userId });
      if (user && user.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
          to: user.email,
          subject: "تم تغيير كلمة المرور بنجاح",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; text-align: center;">تم تغيير كلمة المرور</h2>
              <p>مرحباً،</p>
              <p>تم تغيير كلمة المرور لحسابك بنجاح.</p>
              <p>إذا كنت أنت من قام بهذا التغيير، فلا داعي للقلق.</p>
              <p>إذا لم تكن أنت من قام بتغيير كلمة المرور، يرجى التواصل معنا فوراً أو استخدام خاصية استعادة كلمة المرور.</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                هذا رسالة آلية، يرجى عدم الرد عليها
              </p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("خطأ في إرسال البريد الإلكتروني للتأكيد:", error);
    }

    return {
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    };
  },
});
