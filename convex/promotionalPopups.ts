import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all active promotional popups
export const getActivePopups = query({
  args: {
    page: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const popups = await ctx.db
      .query("promotionalPopups")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by date range
    const validPopups = popups.filter((popup) => {
      if (popup.startDate && popup.startDate > now) return false;
      if (popup.endDate && popup.endDate < now) return false;
      return true;
    });

    // Filter by target page if specified
    if (args.page) {
      return validPopups.filter((popup) => {
        if (!popup.targetPages || popup.targetPages.length === 0) return true;
        return popup.targetPages.includes(args.page!);
      });
    }

    return validPopups;
  },
});

// Get all promotional popups (for admin)
export const getAllPopups = query({
  handler: async (ctx) => {
    const popups = await ctx.db
      .query("promotionalPopups")
      .withIndex("by_priority")
      .order("desc")
      .collect();

    return popups;
  },
});

// Get a single popup by ID
export const getPopup = query({
  args: { id: v.id("promotionalPopups") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new promotional popup
export const createPopup = mutation({
  args: {
    title: v.string(),
    titleAr: v.optional(v.string()),
    description: v.string(),
    descriptionAr: v.optional(v.string()),
    ctaText: v.string(),
    ctaTextAr: v.optional(v.string()),
    ctaLink: v.string(),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    backgroundColor: v.optional(v.string()),
    iconType: v.optional(v.union(v.literal("merchant-signup"), v.literal("giveaway"), v.literal("discount"), v.literal("custom"))),
    showOnce: v.boolean(),
    showDaily: v.boolean(),
    delay: v.number(),
    targetPages: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    priority: v.number(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const popupId = await ctx.db.insert("promotionalPopups", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return popupId;
  },
});

// Update a promotional popup
export const updatePopup = mutation({
  args: {
    id: v.id("promotionalPopups"),
    title: v.optional(v.string()),
    titleAr: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaTextAr: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    backgroundColor: v.optional(v.string()),
    iconType: v.optional(v.union(v.literal("merchant-signup"), v.literal("giveaway"), v.literal("discount"), v.literal("custom"))),
    showOnce: v.optional(v.boolean()),
    showDaily: v.optional(v.boolean()),
    delay: v.optional(v.number()),
    targetPages: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    priority: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    return id;
  },
});

// Delete a promotional popup
export const deletePopup = mutation({
  args: { id: v.id("promotionalPopups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle popup active status
export const togglePopup = mutation({
  args: { id: v.id("promotionalPopups") },
  handler: async (ctx, args) => {
    const popup = await ctx.db.get(args.id);
    if (!popup) {
      throw new Error("Popup not found");
    }

    await ctx.db.patch(args.id, {
      isActive: !popup.isActive,
      updatedAt: Date.now(),
    });

    return !popup.isActive;
  },
});
