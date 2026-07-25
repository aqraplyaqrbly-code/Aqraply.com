import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";

// الحصول على إشعارات المستخدم
export const getUserNotifications = query({
  args: {
    sessionToken: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, limit } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      return [];
    }

    const limitFinal = limit || 50;
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limitFinal);

    return notifications;
  },
});

// الحصول على عدد الإشعارات غير المقروءة
export const getUnreadCount = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
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
  args: {
    sessionToken: v.optional(v.string()),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, notificationId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const notification = await ctx.db.get(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new ConvexError("الإشعار غير موجود");
    }

    await ctx.db.patch(notificationId, {
      isRead: true,
    });

    return { success: true };
  },
});

// تعليم جميع الإشعارات كمقروءة
export const markAllAsRead = mutation({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
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
    sessionToken: v.optional(v.string()),
    title: v.string(),
    titleAr: v.string(),
    message: v.string(),
    messageAr: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, title, titleAr, message, messageAr, type } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    // التحقق من صلاحيات الإدارة
    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile || (userProfile.role !== "admin" && userProfile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لإرسال الإشعارات");
    }

    const users = await ctx.db.query("users").collect();

    for (const user of users) {
      await ctx.db.insert("notifications", {
        userId: user._id,
        title: title,
        titleAr: titleAr,
        message: message,
        messageAr: messageAr,
        type: type,
        isRead: false,
      });
    }

    return { sent: users.length };
  },
});
