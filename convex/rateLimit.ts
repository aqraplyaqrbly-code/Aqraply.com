import { ConvexError } from "convex/values";
import type { MutationCtx } from "./_generated/server";

// Generic rate limiting helper function
// This function checks and increments rate limit in a single transaction to prevent race conditions
export async function checkRateLimit(
  ctx: MutationCtx,
  identifier: string,
  action: string,
  maxAttempts: number,
  windowMs: number
): Promise<void> {
  const now = Date.now();
  const windowStart = now - (now % windowMs);

  // Check if rate limit record exists for this identifier and action
  const existingRateLimit = await ctx.db
    .query("authRateLimits")
    .withIndex("by_identifier_action", (q: any) =>
      q.eq("identifier", identifier).eq("action", action)
    )
    .first();

  if (existingRateLimit) {
    // Check if the window has expired
    if (existingRateLimit.windowStart < windowStart) {
      // Window expired, reset counter
      await ctx.db.patch(existingRateLimit._id, {
        windowStart,
        attempts: 1,
      });
    } else {
      // Window still active, check if limit exceeded
      if (existingRateLimit.attempts >= maxAttempts) {
        const timeRemaining = Math.ceil((existingRateLimit.windowStart + windowMs - now) / 1000);
        let timeUnit: string;
        let timeValue: number;

        if (windowMs >= 86400000) {
          // Day-based windows
          timeUnit = "يوم";
          timeValue = Math.ceil(timeRemaining / 86400);
        } else if (windowMs >= 3600000) {
          // Hour-based windows
          timeUnit = "ساعة";
          timeValue = Math.ceil(timeRemaining / 3600);
        } else if (windowMs >= 60000) {
          // Minute-based windows
          timeUnit = "دقيقة";
          timeValue = Math.ceil(timeRemaining / 60);
        } else {
          // Second-based windows
          timeUnit = "ثانية";
          timeValue = timeRemaining;
        }
        throw new ConvexError(`لقد تجاوزت الحد الأقصى. الرجاء المحاولة بعد ${timeValue} ${timeUnit}`);
      }
      // Increment counter
      await ctx.db.patch(existingRateLimit._id, {
        attempts: existingRateLimit.attempts + 1,
      });
    }
  } else {
    // Create new rate limit record
    await ctx.db.insert("authRateLimits", {
      identifier,
      action,
      windowStart,
      attempts: 1,
    });
  }
}
