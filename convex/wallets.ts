import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// الحصول على محفظة المستخدم
export const getMyWallet = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
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
    sessionToken: v.optional(v.string()),
    amount: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, amount, description, descriptionAr } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    if (amount <= 0) {
      throw new ConvexError("المبلغ يجب أن يكون أكبر من صفر");
    }

    let wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("wallets", {
        userId,
        balance: amount,
        totalEarnings: amount,
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
        balance: wallet.balance + amount,
        totalEarnings: (wallet.totalEarnings ?? 0) + amount,
      });
    }

    // تسجيل المعاملة
    await ctx.db.insert("walletTransactions", {
      walletId: wallet._id,
      userId,
      type: "credit",
      amount: amount,
      description: description,
      descriptionAr: descriptionAr,
      balance: wallet.balance + amount,
      currency: "EGP",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// خصم من المحفظة
export const deductBalance = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    amount: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    const { sessionToken, amount, description, descriptionAr, orderId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    if (amount <= 0) {
      throw new ConvexError("المبلغ يجب أن يكون أكبر من صفر");
    }

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!wallet) {
      throw new ConvexError("المحفظة غير موجودة");
    }

    if (wallet.balance < amount) {
      throw new ConvexError("الرصيد غير كافٍ");
    }

    await ctx.db.patch(wallet._id, {
      balance: wallet.balance - amount,
      totalSpent: (wallet.totalSpent ?? 0) + amount,
    });

    // تسجيل المعاملة
    await ctx.db.insert("walletTransactions", {
      userId,
      walletId: wallet._id,
      type: "withdrawal",
      amount: amount,
      description: "Withdrawal from wallet",
      descriptionAr: "سحب من المحفظة",
      orderId: orderId,
      balance: wallet.balance - amount,
      currency: "EGP",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// الحصول على معاملات المحفظة
export const getWalletTransactions = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
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
