import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Migration: Update all profiles with storeId
// This migration will update all profiles to include their storeId if they own a store
export const updateProfileStoreId = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all profiles
    const allProfiles = await ctx.db
      .query("profiles")
      .collect();

    let updatedCount = 0;

    for (const profile of allProfiles) {
      // Skip if already has storeId
      if (profile.storeId) {
        continue;
      }

      // Find store owned by this user
      const store = await ctx.db
        .query("stores")
        .withIndex("by_owner", (q) => q.eq("ownerId", profile.userId))
        .first();

      if (store) {
        await ctx.db.patch(profile._id, {
          storeId: store._id,
        });
        updatedCount++;
      }
    }

    return { updatedCount };
  },
});
