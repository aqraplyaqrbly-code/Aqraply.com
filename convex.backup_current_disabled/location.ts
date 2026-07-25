import { v } from "convex/values";
import { query } from "./_generated/server";

// Calculate distance between two points using Haversine formula
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

export const getNearbyStores = query({
  args: {
    userLatitude: v.number(),
    userLongitude: v.number(),
    maxDistance: v.optional(v.number()), // in kilometers
  },
  handler: async (ctx, args) => {
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q: any) => q.eq("isActive", true))
      .collect();

    const maxDistance = args.maxDistance || 50; // Default 50km radius

    const storesWithDistance = stores
      .map((store: any) => {
        const distance = calculateDistance(
          args.userLatitude,
          args.userLongitude,
          store.location.latitude,
          store.location.longitude
        );
        return {
          ...store,
          distance
        };
      })
      .filter((store: any) => store.distance <= maxDistance)
      .sort((a: any, b: any) => a.distance - b.distance);

    return storesWithDistance;
  },
});

export const getStoreDistance = query({
  args: {
    storeId: v.id("stores"),
    userLatitude: v.number(),
    userLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    const distance = calculateDistance(
      args.userLatitude,
      args.userLongitude,
      store.location.latitude,
      store.location.longitude
    );

    return distance;
  },
});
