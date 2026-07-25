import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// الحصول على محفظة المستخدم
export const getMyWallet = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return wallet;
  },
});

// إضافة رصيد للمحفظة
export const addBalance = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    if (args.amount <= 0) {
      throw new ConvexError("المبلغ يجب أن يكون أكبر من صفر");
    }

    let wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("wallets", {
        userId,
        balance: args.amount,
        totalEarnings: args.amount,
        totalSpent: 0,
        currency: "EGP",
        lastTransactionAt: Date.now(),
      });
      const newWallet = await ctx.db.get(walletId);
      if (!newWallet) {
        throw new ConvexError("فشل إنشاء المحفظة");
      }
      wallet = newWallet;
    } else {
      await ctx.db.patch(wallet._id, {
        balance: wallet.balance + args.amount,
        totalEarnings: wallet.totalEarnings + args.amount,
      });
    }

    // تسجيل المعاملة
    await ctx.db.insert("walletTransactions", {
      walletId: wallet._id,
      userId,
      type: "credit",
      amount: args.amount,
      description: args.description,
      descriptionAr: args.descriptionAr,
      balance: wallet.balance + args.amount,
      currency: "EGP",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// خصم من المحفظة
export const deductBalance = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    if (args.amount <= 0) {
      throw new ConvexError("المبلغ يجب أن يكون أكبر من صفر");
    }

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!wallet) {
      throw new ConvexError("المحفظة غير موجودة");
    }

    if (wallet.balance < args.amount) {
      throw new ConvexError("الرصيد غير كافٍ");
    }

    await ctx.db.patch(wallet._id, {
      balance: wallet.balance - args.amount,
      totalSpent: wallet.totalSpent + args.amount,
    });

    // تسجيل المعاملة
    await ctx.db.insert("walletTransactions", {
      userId,
      walletId: wallet._id,
      type: "withdrawal",
      amount: args.amount,
      description: "Withdrawal from wallet",
      descriptionAr: "سحب من المحفظة",
      orderId: args.orderId,
      balance: wallet.balance - args.amount,
      currency: "EGP",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// الحصول على معاملات المحفظة
export const getWalletTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const transactions = await ctx.db
      .query("walletTransactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return transactions;
  },
});
