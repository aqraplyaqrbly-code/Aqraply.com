import { query } from "./_generated/server";
import { v } from "convex/values";

// List of all tables in the database
const TABLES = [
  "users",
  "profiles",
  "stores",
  "products",
  "orders",
  "reviews",
  "phoneOtps",
  "passwordResetTokens",
  "otpVerifications",
  "securityLogs",
  "systemSettings",
  "authAccounts",
  "sessions",
  "authVerificationTokens",
  "authRefreshTokens",
  "authVerificationCodes",
  "authVerifiers",
  "authRateLimits",
  "storeReviews",
  "productReviews",
  "reviewLikes",
  "wallets",
  "walletTransactions",
  "coupons",
  "notifications",
  "subscriptionPlans",
  "storeSubscriptions",
  "promotions",
  "featuredProducts",
  "adminPermissions",
] as const;

export const exportAllData = query({
  args: {
    tables: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const tablesToExport = args.tables || TABLES;
    const backup: Record<string, any[]> = {};
    const metadata = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      tables: tablesToExport,
      counts: {} as Record<string, number>,
    };

    for (const tableName of tablesToExport) {
      try {
        // @ts-ignore - Dynamic table access
        const data = await ctx.db.query(tableName).collect();
        backup[tableName] = data;
        metadata.counts[tableName] = data.length;
      } catch (error) {
        console.error(`Failed to export table ${tableName}:`, error);
        backup[tableName] = [];
        metadata.counts[tableName] = 0;
      }
    }

    return {
      metadata,
      data: backup,
    };
  },
});

export const getTableNames = query({
  handler: async () => {
    return TABLES;
  },
});
