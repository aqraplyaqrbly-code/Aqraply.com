import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// Create a balance top-up request
export const createBalanceRequest = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    amount: v.number(),
    paymentMethod: v.string(), // e.g., "bank_transfer", "cash", "card"
    notes: v.optional(v.string()),
    receiptImageId: v.optional(v.id("_storage")),
    receiptImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    if (args.amount <= 0) {
      throw new ConvexError("المبلغ يجب أن يكون أكبر من صفر");
    }

    // Check if user already has a pending request
    const existingRequest = await ctx.db
      .query("balanceRequests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (existingRequest) {
      throw new ConvexError("لديك طلب شحن معلق بالفعل. يرجى انتظار معالجته");
    }

    const requestId = await ctx.db.insert("balanceRequests", {
      userId,
      amount: args.amount,
      paymentMethod: args.paymentMethod,
      notes: args.notes,
      receiptImageId: args.receiptImageId,
      receiptImageUrl: args.receiptImageUrl,
      status: "pending",
      createdAt: Date.now(),
    });

    return { success: true, requestId };
  },
});

// Get all balance requests (Admin only)
export const getAllBalanceRequests = query({
  args: {
    sessionToken: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      return [];
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      return [];
    }

    let requests = await ctx.db.query("balanceRequests").collect();

    if (args.status) {
      requests = requests.filter((r) => r.status === args.status);
    }

    // Sort by createdAt descending
    requests.sort((a, b) => b.createdAt - a.createdAt);

    // Add image URLs for requests with images
    const requestWithUrls = await Promise.all(
      requests.map(async (request) => {
        if (request.receiptImageId) {
          const imageUrl = await ctx.storage.getUrl(request.receiptImageId);
          return { ...request, receiptImageUrl: imageUrl };
        }
        return request;
      })
    );

    return requestWithUrls;
  },
});

// Get user's balance requests
export const getUserBalanceRequests = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      return [];
    }

    const requests = await ctx.db
      .query("balanceRequests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Sort by createdAt descending
    requests.sort((a, b) => b.createdAt - a.createdAt);

    // Add image URLs for requests with images
    const requestWithUrls = await Promise.all(
      requests.map(async (request) => {
        if (request.receiptImageId) {
          const imageUrl = await ctx.storage.getUrl(request.receiptImageId);
          return { ...request, receiptImageUrl: imageUrl };
        }
        return request;
      })
    );

    return requestWithUrls;
  },
});

// Approve a balance request (Admin only)
export const approveBalanceRequest = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    requestId: v.id("balanceRequests"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المدير يمكنه الموافقة على الطلبات");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (request.status !== "pending") {
      throw new ConvexError("الطلب تمت معالجته بالفعل");
    }

    // Get or create user's wallet
    let wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", request.userId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("wallets", {
        userId: request.userId,
        balance: request.amount,
        totalEarnings: request.amount,
        totalSpent: 0,
        currency: "EGP",
        lastTransactionAt: Date.now(),
      });
      wallet = await ctx.db.get(walletId);
    } else {
      await ctx.db.patch(wallet._id, {
        balance: wallet.balance + request.amount,
        totalEarnings: (wallet.totalEarnings ?? 0) + request.amount,
      });
    }

    // Record transaction
    if (wallet) {
      await ctx.db.insert("walletTransactions", {
        userId: request.userId,
        walletId: wallet._id,
        type: "credit",
        amount: request.amount,
        description: `Balance top-up request approved`,
        descriptionAr: `تمت الموافقة على طلب شحن الرصيد`,
        balance: wallet.balance + request.amount,
        currency: "EGP",
        createdAt: Date.now(),
      });
    }

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "approved",
      processedAt: Date.now(),
      processedBy: userId,
    });

    return { success: true };
  },
});

// Reject a balance request (Admin only)
export const rejectBalanceRequest = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    requestId: v.id("balanceRequests"),
    rejectionReason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // Check if user is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المدير يمكنه رفض الطلبات");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new ConvexError("الطلب غير موجود");
    }

    if (request.status !== "pending") {
      throw new ConvexError("الطلب تمت معالجته بالفعل");
    }

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "rejected",
      rejectionReason: args.rejectionReason,
      processedAt: Date.now(),
      processedBy: userId,
    });

    return { success: true };
  },
});
