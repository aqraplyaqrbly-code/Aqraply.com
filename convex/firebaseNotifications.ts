"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";
import { GoogleAuth } from "google-auth-library";

// Firebase Cloud Messaging configuration - HTTP v1 API
const FIREBASE_PROJECT_ID = "aqraply-a8035";

// دالة جلب Access Token تلقائياً من مفاتيح Service Account
async function getAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  // معالجة المفتاح السري بأمان وتنسيق الأسطر
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (!clientEmail || !privateKey) {
    throw new ConvexError("Missing Firebase credentials in Convex environment variables");
  }

  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
  } catch (error: any) {
    console.error("❌ Auth Error Details:", error);
    throw new ConvexError(`Firebase Auth Failed: ${error.message || error}`);
  }
}

// Send notification to a specific user using FCM HTTP v1 API
export const sendPushNotification = action({
  args: {
    fcmToken: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.record(v.string(), v.any())),
  },
  handler: async (ctx, args) => {
    const { fcmToken, title, body, data } = args;

    // تحويل كل قيم الـ data إلى Strings لتفادي رفض Firebase FCM
    const formattedData: Record<string, string> = {};
    if (data) {
      Object.keys(data).forEach((key) => {
        formattedData[key] = String(data[key]);
      });
    }

    // إضافة البيانات الأساسية في data فقط لمنع الإشعار المزدوج
    formattedData["title"] = title;
    formattedData["body"] = body;
    formattedData["url"] = "https://aqraply.com";

    // Prepare message for HTTP v1 API - data only to prevent duplicate notifications
    const message = {
      message: {
        token: fcmToken,
        data: formattedData,
      },
    };

    try {
      // 1. توليد التوكن
      const accessToken = await getAccessToken();

      // 2. إرسال الطلب لـ FCM
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new ConvexError(`FCM API Error [${response.status}]: ${errorText}`);
      }

      const result = await response.json();
      return { success: true, result };
    } catch (error: any) {
      console.error("❌ Final Execution Error:", error);
      // إرسال تفاصيل الخطأ الحقيقي بدلاً من رسالة عامة
      throw new ConvexError(error.message || "Failed to send push notification");
    }
  },
});