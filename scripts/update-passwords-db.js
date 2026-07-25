#!/usr/bin/env node

import { ConvexClient } from "convex/browser";
import crypto from "crypto";

const client = new ConvexClient(
  "https://quick-cormorant-163.convex.cloud"
);

// Hash password
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function resetAllPasswords() {
  try {
    console.log("🔄 جاري تحديث كلمات المرور لجميع المستخدمين...");
    
    // We need to use a direct HTTP call instead
    const response = await fetch(
      "https://quick-cormorant-163.convex.cloud/resetAllPasswords",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTH_SECRET}`,
        },
        body: JSON.stringify({}),
      }
    );

    const result = await response.json();
    console.log("✅", result.message || "اكتمل التحديث");
    return result;
  } catch (error) {
    console.error("❌ خطأ:", error.message);
  }
}

resetAllPasswords();
