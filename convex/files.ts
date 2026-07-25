import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL by storage ID or direct HTTP URL
export const getFileUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    if (
      args.storageId.startsWith("http://") ||
      args.storageId.startsWith("https://")
    ) {
      return args.storageId;
    }
    try {
      const url = await ctx.storage.getUrl(args.storageId as never);
      return url || args.storageId;
    } catch {
      return args.storageId;
    }
  },
});

export const getFileUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.storageIds.map(async (storageId) => {
        if (
          storageId.startsWith("http://") ||
          storageId.startsWith("https://")
        ) {
          return storageId;
        }
        try {
          const url = await ctx.storage.getUrl(storageId as never);
          return url || storageId;
        } catch {
          return storageId;
        }
      })
    );
  },
});

// Store file metadata (optional)
export const storeFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    size: v.number(),
    uploadedBy: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    // This would store metadata if needed
    // For now, we'll just return the storageId
    return args.storageId;
  },
});
