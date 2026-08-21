import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";

// Firebase Cloud Messaging configuration
// For HTTP v1 API, you would need:
// - Project ID: aqraply-a8035
// - Service Account credentials (JSON file)
// - OAuth 2.0 access token generation with JWT signing
// 
// For now using Legacy API with Server Key (simpler for Convex environment)
// Set FIREBASE_SERVER_KEY in Convex environment variables
const FIREBASE_SERVER_KEY = "YOUR_FIREBASE_SERVER_KEY_HERE"; // Replace with actual Server Key

// Send notification to a specific user using FCM
export const sendPushNotification = action({
  args: {
    fcmToken: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.record(v.string(), v.any())),
  },
  handler: async (ctx, args) => {
    const { fcmToken, title, body, data } = args;

    // Send notification via Firebase Cloud Messaging (Legacy API)
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: fcmToken,
    };

    try {
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${FIREBASE_SERVER_KEY}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ConvexError(`FCM error: ${errorText}`);
      }

      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw new ConvexError("Failed to send push notification");
    }
  },
});

// Query to get FCM token for a user
export const getUserFcmToken = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return profile?.fcmToken || null;
  },
});
