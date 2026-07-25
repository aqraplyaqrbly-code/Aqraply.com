import { query } from "./_generated/server";
import { v } from "convex/values";

// Calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get nearby stores
export const getNearbyStores = query({
  args: {
    userLatitude: v.number(),
    userLongitude: v.number(),
    maxDistance: v.optional(v.number()), // in kilometers
  },
  handler: async (ctx, args) => {
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const maxDistance = args.maxDistance || 20; // default 20km

    const nearbyStores = stores
      .map(store => {
        if (!store.location) return null;
        
        const distance = calculateDistance(
          args.userLatitude,
          args.userLongitude,
          store.location.latitude,
          store.location.longitude
        );
        
        return { ...store, distance };
      })
      .filter((store): store is NonNullable<typeof store> => store !== null && store.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return nearbyStores;
  },
});
