import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const importAllData = mutation({
  args: {
    data: v.object({
      users: v.optional(v.array(v.any())),
      profiles: v.optional(v.array(v.any())),
      stores: v.optional(v.array(v.any())),
      products: v.optional(v.array(v.any())),
      captains: v.optional(v.array(v.any())),
      orders: v.optional(v.array(v.any())),
      wallets: v.optional(v.array(v.any())),
      reviews: v.optional(v.array(v.any())),
    })
  },
  handler: async (ctx, args) => {
    const results = {
      users: { inserted: 0, failed: 0 },
      profiles: { inserted: 0, failed: 0 },
      stores: { inserted: 0, failed: 0 },
      products: { inserted: 0, failed: 0 },
      captains: { inserted: 0, failed: 0 },
      orders: { inserted: 0, failed: 0 },
      wallets: { inserted: 0, failed: 0 },
      reviews: { inserted: 0, failed: 0 },
    };

    try {
      // استيراد المستخدمين
      if (args.data.users && Array.isArray(args.data.users)) {
        for (const user of args.data.users) {
          try {
            await ctx.db.insert("users", {
              email: user["البريد الإلكتروني"] || user.email || "",
              phone: user["رقم الموبايل"] || user.phone || "",
              isAnonymous: false,
              passwordHash: "placeholder", // will be updated through auth flow
              createdAt: Date.now(),
            });
            results.users.inserted++;
          } catch (e) {
            results.users.failed++;
          }
        }
      }

      // استيراد المتاجر
      if (args.data.stores && Array.isArray(args.data.stores)) {
        for (const store of args.data.stores) {
          try {
            // البحث عن مالك المتجر
            let owner = await ctx.db
              .query("users")
              .filter(q => q.eq(q.field("phone"), store["رقم الموبايل"] || store.phone || ""))
              .first();

            if (!owner) {
              // إنشاء مستخدم جديد للمالك إذا لم يكن موجود
              const ownerId = await ctx.db.insert("users", {
                email: store["البريد الإلكتروني"] || store.email || "",
                phone: store["رقم الموبايل"] || store.phone || "",
                isAnonymous: false,
                passwordHash: "placeholder",
                createdAt: Date.now(),
              });
              owner = await ctx.db.get(ownerId);
            }

            if (!owner) {
              results.stores.failed++;
              continue;
            }

            // البحث عن الملف الشخصي للمالك
            let profile = await ctx.db
              .query("profiles")
              .filter(q => q.eq(q.field("userId"), owner._id))
              .first();

            if (!profile) {
              // إنشاء ملف شخصي للمالك
              const profileId = await ctx.db.insert("profiles", {
                userId: owner._id,
                role: "merchant",
                fullName: store["اسم المالك"] || store.name || "",
                phone: store["رقم الموبايل"] || store.phone || "",
                phoneVerified: true,
                isActive: true,
                isOnline: true,
                isApproved: true,
                lastSeen: Date.now(),
                registrationDate: Date.now(),
                isSuspended: false,
                isOwner: false,
              });
              profile = await ctx.db.get(profileId);
            }

            if (!profile) {
              results.stores.failed++;
              continue;
            }

            // إنشاء المتجر
            await ctx.db.insert("stores", {
              name: store["اسم المتجر"] || store.name || "",
              nameAr: store["اسم المتجر"] || store.nameAr || "",
              description: "متجر رائع",
              descriptionAr: "متجر رائع",
              category: "عام",
              ownerId: profile.userId,
              location: {
                address: store["العنوان الكامل"] || store.address || "",
                addressAr: store["العنوان الكامل"] || store.address || "",
                latitude: 30.0444,
                longitude: 31.2357,
              },
              rating: 4.5,
              minOrderAmount: 50,
              deliveryFee: 20,
              estimatedDeliveryTime: 30,
              isActive: true,
              isOnline: true,
              isApproved: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
            results.stores.inserted++;
          } catch (e) {
            console.error("Store import error:", e);
            results.stores.failed++;
          }
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Import failed: ${String(error)}`);
    }
  },
});

export const getImportStatus = query({
  handler: async (ctx) => {
    const userCount = (await ctx.db.query("users").collect()).length;
    const storeCount = (await ctx.db.query("stores").collect()).length;
    const profileCount = (await ctx.db.query("profiles").collect()).length;

    return {
      users: userCount,
      stores: storeCount,
      profiles: profileCount,
      timestamp: Date.now(),
    };
  },
});
