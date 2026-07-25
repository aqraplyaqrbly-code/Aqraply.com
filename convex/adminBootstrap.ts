import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS;
  if (fromEnv) {
    return fromEnv.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  }
  return ["markezzat39@gmail.com"];
}

export const resetAdminPassword = action({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args)
: Promise<{ userId: string; email: string }> => {
    const email = normalizeEmail(args.email);
    if (!getAdminEmails().includes(email)) {
      throw new ConvexError("هذا البريد غير مصرح له كمدير");
    }
    if (args.password.length < 8) {
      throw new ConvexError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);

    const exists = await ctx.runQuery(
      internal.adminBootstrapInternal.hasPasswordAccount,
      { email },
    );

    if (exists) {
      await ctx.runMutation(internal.adminBootstrapInternal.updateAdminPassword, {
        email,
        passwordHash: hashedPassword,
      });
    } else {
      await ctx.runMutation(internal.adminBootstrapInternal.createAdminUser, {
        email,
        passwordHash: hashedPassword,
      });
    }

    return await ctx.runMutation(
      internal.adminBootstrapInternal.ensureAdminProfileInternal,
      { email, fullName: args.fullName },
    );
  },
});

export const setupAdminPasswordAccount = action({
  args: {
    setupKey: v.string(),
    email: v.string(),
    password: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args)
: Promise<{ userId: string; email: string }> => {
    const expected = process.env.ADMIN_SETUP_KEY ?? "aqraply-dev-setup";
    if (args.setupKey !== expected) {
      throw new ConvexError("مفتاح الإعداد غير صحيح");
    }

    const email = normalizeEmail(args.email);
    if (args.password.length < 8) {
      throw new ConvexError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);

    const exists = await ctx.runQuery(
      internal.adminBootstrapInternal.hasPasswordAccount,
      { email },
    );

    if (exists) {
      await ctx.runMutation(internal.adminBootstrapInternal.updateAdminPassword, {
        email,
        passwordHash: hashedPassword,
      });
    } else {
      await ctx.runMutation(internal.adminBootstrapInternal.createAdminUser, {
        email,
        passwordHash: hashedPassword,
      });
    }

    return await ctx.runMutation(
      internal.adminBootstrapInternal.ensureAdminProfileInternal,
      { email, fullName: args.fullName },
    );
  },
});
