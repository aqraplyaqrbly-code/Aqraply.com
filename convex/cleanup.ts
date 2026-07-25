import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

// حذف OTP tokens منتهية الصلاحية
export const deleteExpiredOtps = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredOtps = await ctx.db
      .query("phoneOtps")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    let deleted = 0;
    for (const otp of expiredOtps) {
      await ctx.db.delete(otp._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired OTPs` };
  },
});

// حذف password reset tokens منتهية الصلاحية
export const deleteExpiredPasswordResetTokens = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    let deleted = 0;
    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired password reset tokens` };
  },
});

// حذف sessions منتهية الصلاحية
export const deleteExpiredSessions = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_expires", (q) => q.lt("expiresAt", now))
      .collect();

    let deleted = 0;
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired sessions` };
  },
});

// حذف auth verification tokens منتهية الصلاحية
export const deleteExpiredVerificationTokens = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("authVerificationTokens")
      .filter((q) => q.lt(q.field("expires"), now))
      .collect();

    let deleted = 0;
    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired verification tokens` };
  },
});

// حذف auth verification codes منتهية الصلاحية
export const deleteExpiredVerificationCodes = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredCodes = await ctx.db
      .query("authVerificationCodes")
      .filter((q) => q.lt(q.field("expirationTime"), now))
      .collect();

    let deleted = 0;
    for (const code of expiredCodes) {
      await ctx.db.delete(code._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired verification codes` };
  },
});

// حذف auth refresh tokens منتهية الصلاحية
export const deleteExpiredRefreshTokens = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("authRefreshTokens")
      .filter((q) => q.lt(q.field("expirationTime"), now))
      .collect();

    let deleted = 0;
    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired refresh tokens` };
  },
});

// حذف auth refresh tokens المشكلة التي تشير إلى authSessions
export const deleteProblematicRefreshTokens = mutation({
  handler: async (ctx) => {
    const allTokens = await ctx.db.query("authRefreshTokens").collect();
    
    let deleted = 0;
    for (const token of allTokens) {
      // Try to get the session - if it fails or returns null, delete the token
      try {
        const session = await ctx.db.get(token.sessionId as any);
        if (!session) {
          await ctx.db.delete(token._id);
          deleted++;
        }
      } catch (error) {
        // Session ID is invalid, delete the token
        await ctx.db.delete(token._id);
        deleted++;
      }
    }

    return { deleted, message: `Deleted ${deleted} problematic refresh tokens` };
  },
});

// Audit users table for authentication inconsistencies
export const auditUsersTable = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    const issues = {
      usersWithoutPasswordHash: [] as string[],
      usersWithPasswordButNoHash: [] as string[],
      usersWithUppercaseEmails: [] as string[],
      usersWithTrailingSpaces: [] as string[],
      duplicateEmails: [] as string[],
      totalUsers: users.length,
    };

    const emailCount = new Map<string, number>();

    for (const user of users) {
      // Check for passwordHash
      if (!user.passwordHash) {
        issues.usersWithoutPasswordHash.push(user._id);
      }

      // Check for password field but no passwordHash
      if (user.password && !user.passwordHash) {
        issues.usersWithPasswordButNoHash.push(user._id);
      }

      // Check for uppercase emails
      if (user.email && user.email !== user.email.toLowerCase()) {
        issues.usersWithUppercaseEmails.push(user.email);
      }

      // Check for trailing spaces
      if (user.email && user.email !== user.email.trim()) {
        issues.usersWithTrailingSpaces.push(user.email);
      }

      // Count emails for duplicates
      if (user.email) {
        const normalized = user.email.toLowerCase().trim();
        emailCount.set(normalized, (emailCount.get(normalized) || 0) + 1);
      }
    }

    // Find duplicates
    for (const [email, count] of emailCount.entries()) {
      if (count > 1) {
        issues.duplicateEmails.push(email);
      }
    }

    return issues;
  },
});

// Migration: Fix users with password field but no passwordHash
export const migratePasswordToHash = action({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.authInternal.getAllUsers);
    let migrated = 0;
    let errors = 0;

    for (const user of users) {
      if (user.password && !user.passwordHash) {
        try {
          // Hash the plaintext password
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await ctx.runMutation(internal.authInternal.upgradeUserPassword, {
            userId: user._id,
            hashedPassword,
          });
          migrated++;
        } catch (error) {
          console.error(`Failed to migrate user ${user._id}:`, error);
          errors++;
        }
      }
    }

    return {
      migrated,
      errors,
      message: `Migrated ${migrated} users, ${errors} errors`,
    };
  },
});

// حذف security logs القديمة (أكثر من 30 يوم)
export const deleteOldSecurityLogs = mutation({
  args: {
    daysOld: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysOld || 30;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const oldLogs = await ctx.db
      .query("securityLogs")
      .filter((q) => q.lt(q.field("timestamp"), cutoff))
      .collect();

    let deleted = 0;
    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} security logs older than ${days} days` };
  },
});

// حذف notifications القديمة (أكثر من 7 أيام)
export const deleteOldNotifications = mutation({
  args: {
    daysOld: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysOld || 7;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const oldNotifications = await ctx.db
      .query("notifications")
      .collect();

    let deleted = 0;
    for (const notification of oldNotifications) {
      if (notification._creationTime && notification._creationTime < cutoff) {
        await ctx.db.delete(notification._id);
        deleted++;
      }
    }

    return { deleted, message: `Deleted ${deleted} notifications older than ${days} days` };
  },
});

// حذف coupons منتهية الصلاحية
export const deleteExpiredCoupons = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredCoupons = await ctx.db
      .query("coupons")
      .filter((q) => q.lt(q.field("validUntil"), now))
      .collect();

    let deleted = 0;
    for (const coupon of expiredCoupons) {
      await ctx.db.delete(coupon._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired coupons` };
  },
});

// حذف promotions منتهية الصلاحية
export const deleteExpiredPromotions = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredPromotions = await ctx.db
      .query("promotions")
      .filter((q) => q.lt(q.field("endDate"), now))
      .collect();

    let deleted = 0;
    for (const promotion of expiredPromotions) {
      await ctx.db.delete(promotion._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired promotions` };
  },
});

// حذف featured products منتهية الصلاحية
export const deleteExpiredFeaturedProducts = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expiredFeatured = await ctx.db
      .query("featuredProducts")
      .filter((q) => q.lt(q.field("endDate"), now))
      .collect();

    let deleted = 0;
    for (const featured of expiredFeatured) {
      await ctx.db.delete(featured._id);
      deleted++;
    }

    return { deleted, message: `Deleted ${deleted} expired featured products` };
  },
});

// دالة تنظيف شاملة
export const cleanupAll = mutation({
  handler: async (ctx) => {
    const results = [];
    
    // حذف OTP tokens منتهية الصلاحية
    const now = Date.now();
    const expiredOtps = await ctx.db.query("phoneOtps").filter((q) => q.lt(q.field("expiresAt"), now)).collect();
    for (const otp of expiredOtps) {
      await ctx.db.delete(otp._id);
    }
    results.push({ deleted: expiredOtps.length, message: `Deleted ${expiredOtps.length} expired OTPs` });

    // حذف password reset tokens منتهية الصلاحية
    const expiredPasswordTokens = await ctx.db.query("passwordResetTokens").filter((q) => q.lt(q.field("expiresAt"), now)).collect();
    for (const token of expiredPasswordTokens) {
      await ctx.db.delete(token._id);
    }
    results.push({ deleted: expiredPasswordTokens.length, message: `Deleted ${expiredPasswordTokens.length} expired password reset tokens` });

    // حذف sessions منتهية الصلاحية
    const expiredSessions = await ctx.db.query("sessions").withIndex("by_expires", (q) => q.lt("expiresAt", now)).collect();
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }
    results.push({ deleted: expiredSessions.length, message: `Deleted ${expiredSessions.length} expired sessions` });

    // حذف auth refresh tokens المشكلة
    const allRefreshTokens = await ctx.db.query("authRefreshTokens").collect();
    let deletedRefreshTokens = 0;
    for (const token of allRefreshTokens) {
      try {
        const session = await ctx.db.get(token.sessionId as any);
        if (!session) {
          await ctx.db.delete(token._id);
          deletedRefreshTokens++;
        }
      } catch (error) {
        await ctx.db.delete(token._id);
        deletedRefreshTokens++;
      }
    }
    results.push({ deleted: deletedRefreshTokens, message: `Deleted ${deletedRefreshTokens} problematic refresh tokens` });

    // حذف verification tokens منتهية الصلاحية
    const expiredVerificationTokens = await ctx.db.query("authVerificationTokens").filter((q) => q.lt(q.field("expires"), now)).collect();
    for (const token of expiredVerificationTokens) {
      await ctx.db.delete(token._id);
    }
    results.push({ deleted: expiredVerificationTokens.length, message: `Deleted ${expiredVerificationTokens.length} expired verification tokens` });

    // حذف verification codes منتهية الصلاحية
    const expiredVerificationCodes = await ctx.db.query("authVerificationCodes").filter((q) => q.lt(q.field("expirationTime"), now)).collect();
    for (const code of expiredVerificationCodes) {
      await ctx.db.delete(code._id);
    }
    results.push({ deleted: expiredVerificationCodes.length, message: `Deleted ${expiredVerificationCodes.length} expired verification codes` });

    // حذف refresh tokens منتهية الصلاحية
    const expiredRefreshTokens = await ctx.db.query("authRefreshTokens").filter((q) => q.lt(q.field("expirationTime"), now)).collect();
    for (const token of expiredRefreshTokens) {
      await ctx.db.delete(token._id);
    }
    results.push({ deleted: expiredRefreshTokens.length, message: `Deleted ${expiredRefreshTokens.length} expired refresh tokens` });

    // حذف security logs القديمة (30 يوم)
    const daysOld = 30;
    const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    const oldSecurityLogs = await ctx.db.query("securityLogs").filter((q) => q.lt(q.field("timestamp"), cutoff)).collect();
    for (const log of oldSecurityLogs) {
      await ctx.db.delete(log._id);
    }
    results.push({ deleted: oldSecurityLogs.length, message: `Deleted ${oldSecurityLogs.length} security logs older than ${daysOld} days` });

    // حذف notifications القديمة (7 أيام)
    const notificationsDaysOld = 7;
    const notificationsCutoff = Date.now() - (notificationsDaysOld * 24 * 60 * 60 * 1000);
    const oldNotifications = await ctx.db.query("notifications").collect();
    let deletedNotifications = 0;
    for (const notification of oldNotifications) {
      if (notification._creationTime && notification._creationTime < notificationsCutoff) {
        await ctx.db.delete(notification._id);
        deletedNotifications++;
      }
    }
    results.push({ deleted: deletedNotifications, message: `Deleted ${deletedNotifications} notifications older than ${notificationsDaysOld} days` });

    // حذف coupons منتهية الصلاحية
    const expiredCoupons = await ctx.db.query("coupons").filter((q) => q.lt(q.field("validUntil"), now)).collect();
    for (const coupon of expiredCoupons) {
      await ctx.db.delete(coupon._id);
    }
    results.push({ deleted: expiredCoupons.length, message: `Deleted ${expiredCoupons.length} expired coupons` });

    // حذف promotions منتهية الصلاحية
    const expiredPromotions = await ctx.db.query("promotions").filter((q) => q.lt(q.field("endDate"), now)).collect();
    for (const promotion of expiredPromotions) {
      await ctx.db.delete(promotion._id);
    }
    results.push({ deleted: expiredPromotions.length, message: `Deleted ${expiredPromotions.length} expired promotions` });

    // حذف featured products منتهية الصلاحية
    const expiredFeatured = await ctx.db.query("featuredProducts").filter((q) => q.lt(q.field("endDate"), now)).collect();
    for (const featured of expiredFeatured) {
      await ctx.db.delete(featured._id);
    }
    results.push({ deleted: expiredFeatured.length, message: `Deleted ${expiredFeatured.length} expired featured products` });

    const totalDeleted = results.reduce((sum: number, r: any) => sum + r.deleted, 0);

    return {
      totalDeleted,
      results,
      message: `Cleaned up ${totalDeleted} records total`,
    };
  },
});

// query للحصول على إحصائيات قاعدة البيانات
export const getDatabaseStats = query({
  handler: async (ctx) => {
    const tables = [
      "users", "profiles", "stores", "products", "orders", "reviews",
      "phoneOtps", "passwordResetTokens", "otpVerifications", "securityLogs",
      "systemSettings", "authAccounts", "sessions", "authVerificationTokens",
      "authRefreshTokens", "authVerificationCodes", "authVerifiers", "authRateLimits",
      "storeReviews", "productReviews", "reviewLikes", "wallets", "walletTransactions",
      "coupons", "notifications", "subscriptionPlans", "storeSubscriptions",
      "promotions", "featuredProducts", "adminPermissions",
    ];

    const stats: Record<string, number> = {};

    for (const table of tables) {
      try {
        // @ts-ignore
        const count = await ctx.db.query(table).collect();
        stats[table] = count.length;
      } catch (error) {
        stats[table] = 0;
      }
    }

    return stats;
  },
});
