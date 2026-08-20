import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Firebase Cloud Messaging configuration
// Replace with actual Firebase Server Key from Firebase Console -> Project Settings -> Cloud Messaging
const FIREBASE_SERVER_KEY = "AAAA"; 

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

    // Send notification via Firebase Cloud Messaging
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
