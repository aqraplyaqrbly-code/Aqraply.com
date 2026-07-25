import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

// الحصول على إشعارات المستخدم
export const getUserNotifications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 50;
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

// الحصول على عدد الإشعارات غير المقروءة
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return notifications.length;
  },
});

// تعليم إشعار كمقروء
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new ConvexError("الإشعار غير موجود");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return { success: true };
  },
});

// تعليم جميع الإشعارات كمقروءة
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }

    return { count: notifications.length };
  },
});

// إنشاء إشعار (للاستخدام الداخلي)
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    titleAr: v.string(),
    message: v.string(),
    messageAr: v.string(),
    type: v.string(),
    relatedOrderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      titleAr: args.titleAr,
      message: args.message,
      messageAr: args.messageAr,
      type: args.type,
      isRead: false,
      relatedOrderId: args.relatedOrderId,
    });

    return notificationId;
  },
});

// إرسال إشعار لجميع المستخدمين (للإدارة)
export const broadcastNotification = mutation({
  args: {
    title: v.string(),
    titleAr: v.string(),
    message: v.string(),
    messageAr: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من صلاحيات الإدارة
    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile || userProfile.role !== "admin") {
      throw new ConvexError("ليس لديك صلاحية لإرسال الإشعارات");
    }

    const users = await ctx.db.query("users").collect();

    for (const user of users) {
      await ctx.db.insert("notifications", {
        userId: user._id,
        title: args.title,
        titleAr: args.titleAr,
        message: args.message,
        messageAr: args.messageAr,
        type: args.type,
        isRead: false,
      });
    }

    return { sent: users.length };
  },
});
