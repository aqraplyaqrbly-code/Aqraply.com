import { mutation } from "./convex/_generated/server";
import { v } from "convex/values";

// بيانات المستخدمين
export const importUsers = mutation({
  args: {
    users: v.array(v.object({
      email: v.string(),
      phone: v.string(),
      name: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const user of args.users) {
      try {
        const userId = await ctx.db.insert("users", {
          email: user.email,
          phone: user.phone,
          isAnonymous: false,
          password: "hashed_password", // يتم تعيينها لاحقاً
        });
        results.push({ success: true, userId });
      } catch (error) {
        results.push({ success: false, error: String(error) });
      }
    }
    return results;
  },
});

// بيانات المتاجر
export const importStores = mutation({
  args: {
    stores: v.array(v.object({
      name: v.string(),
      nameAr: v.string(),
      description: v.string(),
      descriptionAr: v.string(),
      category: v.string(),
      ownerId: v.string(),
      phone: v.string(),
      email: v.string(),
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      rating: v.number(),
      minOrderAmount: v.number(),
      deliveryFee: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const store of args.stores) {
      try {
        // البحث عن الملف الشخصي للمالك
        const owner = await ctx.db
          .query("profiles")
          .filter(q => q.eq(q.field("phone"), store.phone))
          .first();
        
        if (!owner) {
          results.push({ 
            success: false, 
            error: `Owner with phone ${store.phone} not found` 
          });
          continue;
        }

        const storeId = await ctx.db.insert("stores", {
          name: store.name,
          nameAr: store.nameAr,
          description: store.description,
          descriptionAr: store.descriptionAr,
          category: store.category,
          ownerId: owner._id,
          location: {
            address: store.address,
            addressAr: store.address,
            latitude: store.latitude,
            longitude: store.longitude,
          },
          rating: store.rating,
          totalRatings: 0,
          minOrderAmount: store.minOrderAmount,
          deliveryFee: store.deliveryFee,
          estimatedDeliveryTime: 30,
          isActive: true,
          isOnline: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        results.push({ success: true, storeId });
      } catch (error) {
        results.push({ success: false, error: String(error) });
      }
    }
    return results;
  },
});
