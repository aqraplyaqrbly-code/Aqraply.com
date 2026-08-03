import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import bcrypt from "bcryptjs";
import { internal } from "./_generated/api";
import { getAuthUserId } from "./auth";

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
export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // البحث عن المستخدم بالبريد الإلكتروني
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // لا نكشف وجود المستخدم لأسباب أمنية
      return {
        success: true,
        message: "إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة إعادة تعيين كلمة المرور",
      };
    }

    // تنظيف رموز OTP قديمة منتهية الصلاحية
    const oldOTPs = await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.email).eq("identifierType", "email")
      )
      .collect();

    for (const otp of oldOTPs) {
      if (otp.expiresAt < Date.now()) {
        await ctx.db.delete(otp._id);
      }
    }

    // التحقق من محاولات متكررة (حماية من الهجمات)
    const recentOTPs = oldOTPs.filter(
      (otp) => otp.createdAt > Date.now() - 300000 // آخر 5 دقائق
    );

    if (recentOTPs.length >= 3) {
      throw new ConvexError("عدد محاولات الطلب كثير. الرجاء المحاولة لاحقاً");
    }

    // إنشاء OTP جديد
    const otp = generateSecureOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 دقائق

    // حفظ OTP
    await ctx.db.insert("otpVerifications", {
      userId: user._id,
      identifier: args.email,
      identifierType: "email",
      otp,
      otpHash: otp, // في وضع التطوير، نستخدم OTP نفسه كـ hash
      expiresAt,
      createdAt: Date.now(),
      isVerified: false,
      attempts: 0,
      maxAttempts: 3,
    });

    // TODO: إرسال OTP على الإيميل
    console.log(`Password reset OTP for ${args.email}: ${otp}`);
    
    try {
      // مثال مع خدمة إرسال بريد إلكتروني
      // const nodemailer = require("nodemailer");
      // const transporter = nodemailer.createTransporter({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });
      // await transporter.sendMail({
      //   to: args.email,
      //   subject: "كود إعادة تعيين كلمة المرور",
      //   html: `<p>كود إعادة تعيين كلمة المرور الخاص بك هو:</p>
      //          <h2 style="text-align: center; font-size: 32px; color: #333;">${otp}</h2>
      //          <p>هذا الكود صالح لمدة 10 دقائق فقط</p>
      //          <p>إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة</p>`,
      // });
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
export const verifyResetOTP = mutation({
  args: {
    email: v.string(),
    otp: v.string(),
  },
  handler: async (ctx, args) => {
    const otpRecord = await ctx.db
      .query("otpVerifications")
      .withIndex("by_identifier_type", (q) =>
        q.eq("identifier", args.email).eq("identifierType", "email")
      )
      .first();

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
    if (otpRecord.otpHash !== args.otp) {
      await ctx.db.patch(otpRecord._id, {
        attempts: otpRecord.attempts + 1,
      });
      throw new ConvexError("رمز التحقق غير صحيح");
    }

    // العثور على المستخدم
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // تحديث OTP كـ verified
    await ctx.db.patch(otpRecord._id, {
      isVerified: true,
      verifiedAt: Date.now(),
    });

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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(args.newPassword, 10);

    // العثور على المستخدم وتحديث كلمة المرور
    await ctx.runMutation(internal.passwordResetInternal.updateUserPassword, {
      email: args.email,
      hashedPassword,
    });

    // حذف OTP بعد الاستخدام
    await ctx.runMutation(internal.passwordResetInternal.deleteOtp, { otpId: otpRecord._id });

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
      const isMatch = await bcrypt.compare(args.currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new ConvexError("كلمة المرور الحالية غير صحيحة");
      }
    } else {
      throw new ConvexError("لا يمكن تغيير كلمة المرور. يرجى استخدام إعادة تعيين كلمة المرور");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(args.newPassword, 10);

    // تحديث كلمة المرور
    await ctx.runMutation(internal.passwordResetInternal.updateUserPasswordById, {
      userId,
      hashedPassword,
    });

    return {
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    };
  },
});
