import { v } from "convex/values";
import { query } from "./_generated/server";

// الحصول على رابط الملف من معرف التخزين
export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    try {
      // إذا كان الرابط مباشراً (يبدأ بـ http)، أعده كما هو
      if (args.storageId.startsWith("http://") || args.storageId.startsWith("https://")) {
        return args.storageId;
      }
      
      // وإلا، حصل على الرابط من Storage
      const url = await ctx.storage.getUrl(args.storageId as any);
      return url || args.storageId;
    } catch (error) {
      // في حالة الفشل، أعد المعرف كما هو (قد يكون رابط مباشر)
      return args.storageId;
    }
  },
});

// الحصول على روابط متعددة من معرفات التخزين
export const getFileUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map(async (storageId) => {
        try {
          // إذا كان رابطاً مباشراً، أعده كما هو
          if (storageId.startsWith("http://") || storageId.startsWith("https://")) {
            return storageId;
          }
          
          // وإلا، حصل على الرابط
          const url = await ctx.storage.getUrl(storageId as any);
          return url || storageId;
        } catch (error) {
          return storageId;
        }
      })
    );
    
    return urls;
  },
});
