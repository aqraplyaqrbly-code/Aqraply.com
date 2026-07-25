import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// إنشاء ملف شخصي للمستخدم
export const createProfile = mutation({
  args: {
    role: v.string(),
    fullName: v.string(),
    phone: v.string(),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من عدم وجود ملف شخصي مسبقاً
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new ConvexError("لديك ملف شخصي بالفعل");
    }

    // التحقق من عدم تكرار رقم الهاتف
    const phoneExists = await ctx.db
      .query("profiles")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (phoneExists) {
      throw new ConvexError("رقم الهاتف مستخدم بالفعل");
    }

    // إنشاء الملف الشخصي
    const profileId = await ctx.db.insert("profiles", {
      userId,
      role: args.role,
      fullName: args.fullName,
      phone: args.phone,
      phoneVerified: false,
      isActive: true,
      isOnline: true,
      lastSeen: Date.now(),
      registrationDate: Date.now(),
      businessName: args.businessName,
      businessNameAr: args.businessNameAr,
      vehicleType: args.vehicleType,
      vehicleNumber: args.vehicleNumber,
      isSuspended: false,
    });

    // إنشاء محفظة للمستخدم
    await ctx.db.insert("wallets", {
      userId,
      balance: 0,
      totalEarnings: 0,
      totalSpent: 0,
      currency: "EGP",
      lastTransactionAt: Date.now(),
    });

    return profileId;
  },
});

// جلب الملف الشخصي للمستخدم الحالي
export const getCurrentProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
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

// تحديث الملف الشخصي
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    // التحقق من رقم الهاتف إذا تم تغييره
    if (args.phone && args.phone !== profile.phone) {
      // التحقق من صحة رقم الهاتف
      if (!/^01[0-9]{9}$/.test(args.phone)) {
        throw new ConvexError("رقم الهاتف غير صحيح");
      }

      const phoneExists = await ctx.db
        .query("profiles")
        .withIndex("by_phone", (q) => q.eq("phone", args.phone as string))
        .first();

      if (phoneExists) {
        throw new ConvexError("رقم الهاتف مستخدم بالفعل");
      }
    }

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (args.email && args.email !== profile.email) {
      // التحقق من صحة البريد الإلكتروني
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
        throw new ConvexError("البريد الإلكتروني غير صحيح");
      }
    }

    // التحقق من الاسم الكامل
    if (args.fullName && args.fullName.trim().length < 3) {
      throw new ConvexError("الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل");
    }

    // التحقق من رقم المركبة
    if (args.vehicleNumber && args.vehicleNumber.trim().length < 2) {
      throw new ConvexError("رقم المركبة يجب أن يحتوي على حرفين على الأقل");
    }

    // التحقق من نوع المركبة
    if (args.vehicleType && !["car", "motorcycle", "bicycle", "truck", "van"].includes(args.vehicleType)) {
      throw new ConvexError("نوع المركبة غير صحيح");
    }

    // تحديث البيانات
    const updateData: any = {
      ...args,
      lastSeen: Date.now(),
    };

    // إزالة الحقول الفارغة
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === "" || updateData[key] === null) {
        delete updateData[key];
      }
    });

    await ctx.db.patch(profile._id, updateData);

    return profile._id;
  },
});

// تحديث حالة الاتصال
export const updateOnlineStatus = mutation({
  args: {
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    await ctx.db.patch(profile._id, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });

    return { success: true };
  },
});

// رفع صورة الملف الشخصي
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
