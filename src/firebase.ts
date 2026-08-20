import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// نفس إعدادات firebaseConfig الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCZAwUUcQZqC2AFr2aMMJY9fFtA20LTj-E",
  authDomain: "aqraply-a8035.firebaseapp.com",
  projectId: "aqraply-a8035",
  storageBucket: "aqraply-a8035.firebasestorage.app",
  messagingSenderId: "866048841660",
  appId: "1:866048841660:web:f4d062ecc3bc6b4416fdb9",
  measurementId: "G-RS4BN5X6BG"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// دالة طلب إذن الإشعارات والحصول على الـ Token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        // احصل على VAPID Key من Firebase Console -> Project Settings -> Cloud Messaging -> Web Configuration -> Key Pair
        vapidKey: "BPwgSQ_GqZfIabrPEuQNrbp4-LsQwAFEZRhEAH_sRjBY0-Fn1aX4sIXjabWPyGaOBhbYD4mrco7KhhYSe9UpkIU"
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("تم رفض إذن الإشعارات");
      return null;
    }
  } catch (error) {
    console.error("خطأ أثناء جلب FCM Token:", error);
    return null;
  }
};
