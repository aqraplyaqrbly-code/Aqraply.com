import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { sha256 } from "js-sha256";
import { customAlphabet } from "nanoid";
import { internal } from "./_generated/api";

// ─── Password Hashing ─────────────────────────────────────────────────────
function hashPassword(password: string): string {
  return sha256(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ─── Generate Session Token ───────────────────────────────────────────────
function generateSessionToken(): string {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 64);
  return nanoid();
}

// ─── Sign Up (التسجيل) ───────────────────────────────────────────────────
export const signUp = action({
  args: {
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.string(),
    role: v.union(
      v.literal("customer"),
      v.literal("merchant"),
      v.literal("captain"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args): Promise<{ userId: any; sessionToken: string }> => {
    // التحقق من أن البريد الإلكتروني غير مسجل بالفعل
    const existingUser = await ctx.runQuery(internal.customAuthInternal.getUserByEmail, {
      email: args.email,
    });

    if (existingUser) {
      throw new ConvexError("البريد الإلكتروني مسجل بالفعل");
    }

    // التحقق من أن الهاتف غير مسجل بالفعل
    const existingPhone = await ctx.runQuery(internal.customAuthInternal.getUserByPhone, {
      phone: args.phone,
    });

    if (existingPhone) {
      throw new ConvexError("رقم الهاتف مسجل بالفعل");
    }

    // التحقق من قوة كلمة المرور
    if (args.password.length < 6) {
      throw new ConvexError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    // إنشاء المستخدم
    const userId = await ctx.runMutation(internal.customAuthInternal.createUser, {
      email: args.email,
      phone: args.phone,
      passwordHash: hashPassword(args.password),
      role: args.role,
    });

    // إنشاء جلسة
    const sessionToken = generateSessionToken();
    await ctx.runMutation(internal.customAuthInternal.createSession, {
      userId,
      token: sessionToken,
    });

    // إنشاء ملف شخصي
    await ctx.runMutation(internal.customAuthInternal.createProfile, {
      userId,
      fullName: args.fullName,
      phone: args.phone,
      email: args.email,
      role: args.role,
    });

    return { userId, sessionToken };
  },
});

// ─── Sign In (تسجيل الدخول) ───────────────────────────────────────────
export const signIn = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const user = await ctx.runQuery(internal.customAuthInternal.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      throw new ConvexError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    if (user.isSuspended) {
      throw new ConvexError("الحساب مايقبل الدخول");
    }

    // التحقق من كلمة المرور
    if (!user.passwordHash || !verifyPassword(args.password, user.passwordHash as string)) {
      throw new ConvexError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    // إنشاء جلسة جديدة
    const sessionToken = generateSessionToken();
    await ctx.runMutation(internal.customAuthInternal.createSession, {
      userId: user._id,
      token: sessionToken,
    });

    // الحصول على معلومات المستخدم
    const profile = await ctx.runQuery(internal.customAuthInternal.getProfileByUserId, {
      userId: user._id,
    });

    return {
      userId: user._id,
      sessionToken,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      profile,
    };
  },
});

// ─── Sign Out (تسجيل الخروج) ───────────────────────────────────────────
export const signOut = action({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const session = await ctx.runQuery(internal.customAuthInternal.getSessionByToken, {
      token: args.sessionToken,
    });

    if (session) {
      await ctx.runMutation(internal.customAuthInternal.deleteSession, {
        sessionId: session._id,
      });
    }

    return { success: true };
  },
});

// ─── Get Current User (الحصول على المستخدم الحالي) ────────────────────
export const getCurrentUser = action({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const session = await ctx.runQuery(internal.customAuthInternal.getSessionByToken, {
      token: args.sessionToken,
    });

    if (!session) return null;

    // تحقق من انتهاء الجلسة (24 ساعة)
    const now = Date.now();
    if (now - session.createdAt > 24 * 60 * 60 * 1000) {
      await ctx.runMutation(internal.customAuthInternal.deleteSession, {
        sessionId: session._id,
      });
      return null;
    }

    const user = await ctx.runQuery(internal.customAuthInternal.getUserById, {
      userId: session.userId,
    });

    const profile = await ctx.runQuery(internal.customAuthInternal.getProfileByUserId, {
      userId: session.userId,
    });

    return { user, profile };
  },
});

// ─── Request Password Reset (طلب إعادة تعيين كلمة المرور) ───────────────
export const requestPasswordReset = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const user = await ctx.runQuery(internal.customAuthInternal.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      // لا نكشف عما إذا كان البريد موجوداً أم لا
      return { success: true };
    }

    // إنشاء رمز إعادة التعيين (صحيح لمدة 1 ساعة)
    const resetToken = generateSessionToken();

    await ctx.runMutation(internal.customAuthInternal.createPasswordResetToken, {
      userId: user._id,
      token: resetToken,
      email: args.email,
    });

    return { success: true };
  },
});

// ─── Reset Password (إعادة تعيين كلمة المرور) ──────────────────────────
export const resetPassword = action({
  args: {
    resetToken: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // التحقق من قوة كلمة المرور
    if (args.newPassword.length < 6) {
      throw new ConvexError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    const resetTokenDoc = await ctx.runQuery(internal.customAuthInternal.getResetTokenByToken, {
      token: args.resetToken,
    });

    if (
      !resetTokenDoc ||
      resetTokenDoc.isUsed ||
      Date.now() > resetTokenDoc.expiresAt
    ) {
      throw new ConvexError("رمز إعادة التعيين غير صحيح أو منتهي الصلاحية");
    }

    // تحديث كلمة المرور
    await ctx.runMutation(internal.customAuthInternal.updatePassword, {
      userId: resetTokenDoc.userId,
      passwordHash: hashPassword(args.newPassword),
    });

    await ctx.runMutation(internal.customAuthInternal.markResetTokenUsed, {
      resetTokenId: resetTokenDoc._id,
    });

    return { success: true };
  },
});

// ─── Change Password (تغيير كلمة المرور) ────────────────────────────────
export const changePassword = action({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // التحقق من قوة كلمة المرور الجديدة
    if (args.newPassword.length < 6) {
      throw new ConvexError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    // الحصول على الجلسة والمستخدم
    const session = await ctx.runQuery(internal.customAuthInternal.getSessionByToken, {
      token: args.sessionToken,
    });

    if (!session) {
      throw new ConvexError("جلسة غير صحيحة");
    }

    const user = await ctx.runQuery(internal.customAuthInternal.getUserById, {
      userId: session.userId,
    });

    if (!user) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // التحقق من كلمة المرور الحالية
    if (!user.passwordHash || !verifyPassword(args.currentPassword, user.passwordHash as string)) {
      throw new ConvexError("كلمة المرور الحالية غير صحيحة");
    }

    // تحديث كلمة المرور
    await ctx.runMutation(internal.customAuthInternal.updatePassword, {
      userId: session.userId,
      passwordHash: hashPassword(args.newPassword),
    });

    return { success: true };
  },
});
