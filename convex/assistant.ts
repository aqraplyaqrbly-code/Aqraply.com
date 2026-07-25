"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة Aqraply للتوصيل في مصر.
ساعد المستخدمين بالعربية (مصري/فصحى مبسطة) في:
- تصفح المتاجر والمنتجات
- كيفية التسجيل كعميل أو تاجر أو كابتن
- تتبع الطلبات والتوصيل
- أسئلة عامة عن المنصة
كن مختصراً وودوداً. إذا لم تعرف إجابة محددة، وجّه المستخدم لدعم المنصة.`;

export const chat = action({
  args: {
    message: v.string(),
    history: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
  },
  returns: v.object({ reply: v.string() }),
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("مفتاح OpenAI غير مُعدّ في Convex. تواصل مع الإدارة.");
    }

    const trimmed = args.message.trim();
    if (!trimmed) {
      throw new Error("الرسالة فارغة");
    }

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(args.history ?? []),
      { role: "user" as const, content: trimmed },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error: ${response.status} ${errorText.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("لم يصل رد من المساعد");
    }

    return { reply };
  },
});
