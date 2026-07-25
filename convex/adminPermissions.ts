import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "./auth";

// Get all admin permissions (Owner only)
export const getAllAdminPermissions = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Check if user is owner
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المديرين يمكنهم عرض الصلاحيات");
    }

    // Get all admin profiles
    const allAdminProfiles = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();

    // Get all permissions
    const allPermissions = await ctx.db
      .query("adminPermissions")
      .collect();

    // Create a map of userId to permissions
    const permissionsMap = new Map();
    allPermissions.forEach((permission) => {
      permissionsMap.set(permission.userId, permission);
    });

    // Combine admin profiles with their permissions
    const adminsWithPermissions = await Promise.all(
      allAdminProfiles.map(async (adminProfile) => {
        const user = await ctx.db.get(adminProfile.userId);
        const permission = permissionsMap.get(adminProfile.userId);

        return {
          _id: permission?._id || adminProfile._id,
          userId: adminProfile.userId,
          manage_users: permission?.manage_users ?? false,
          manage_orders: permission?.manage_orders ?? false,
          manage_stores: permission?.manage_stores ?? false,
          manage_products: permission?.manage_products ?? false,
          manage_captains: permission?.manage_captains ?? false,
          manage_notifications: permission?.manage_notifications ?? false,
          view_reports: permission?.view_reports ?? false,
          manage_settings: permission?.manage_settings ?? false,
          view_activity_logs: permission?.view_activity_logs ?? false,
          isActive: permission?.isActive ?? false,
          createdAt: permission?.createdAt ?? adminProfile.registrationDate,
          updatedAt: permission?.updatedAt ?? adminProfile.registrationDate,
          user: {
            _id: adminProfile._id,
            userId: adminProfile.userId,
            fullName: adminProfile.fullName,
            email: user?.email,
            isOwner: adminProfile.isOwner,
          },
        };
      })
    );

    return adminsWithPermissions;
  },
});

// Get current admin's permissions
export const getMyPermissions = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("غير مصرح");
    }

    // Check if this is the owner account using isOwner field
    const isOwner = profile.isOwner === true;

    // If owner, return all permissions
    if (isOwner) {
      return {
        manage_users: true,
        manage_orders: true,
        manage_stores: true,
        manage_products: true,
        manage_captains: true,
        manage_notifications: true,
        view_reports: true,
        manage_settings: true,
        view_activity_logs: true,
        isOwner: true,
      };
    }

    // Otherwise, fetch from adminPermissions table
    const permissions = await ctx.db
      .query("adminPermissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!permissions || !permissions.isActive) {
      // No permissions set, return all false
      return {
        manage_users: false,
        manage_orders: false,
        manage_stores: false,
        manage_products: false,
        manage_captains: false,
        manage_notifications: false,
        view_reports: false,
        manage_settings: false,
        view_activity_logs: false,
        isOwner: false,
      };
    }

    return {
      manage_users: permissions.manage_users,
      manage_orders: permissions.manage_orders,
      manage_stores: permissions.manage_stores,
      manage_products: permissions.manage_products,
      manage_captains: permissions.manage_captains,
      manage_notifications: permissions.manage_notifications,
      view_reports: permissions.view_reports,
      manage_settings: permissions.manage_settings,
      view_activity_logs: permissions.view_activity_logs,
      isOwner: false,
    };
  },
});

// Create or update admin permissions (Owner only)
export const upsertAdminPermissions = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
    manage_users: v.boolean(),
    manage_orders: v.boolean(),
    manage_stores: v.boolean(),
    manage_products: v.boolean(),
    manage_captains: v.boolean(),
    manage_notifications: v.boolean(),
    view_reports: v.boolean(),
    manage_settings: v.boolean(),
    view_activity_logs: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId, ...permissionData } = args;
    const currentUserId = await getAuthUserId(ctx, sessionToken);
    if (!currentUserId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Check if current user is owner
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    if (!currentProfile || (currentProfile.role !== "admin" && currentProfile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المالك يمكنه تعديل الصلاحيات");
    }

    // Check if target user is admin, if not, update their role
    const targetProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!targetProfile) {
      throw new ConvexError("المستخدم غير موجود");
    }

    // Update user role to admin if not already
    if (targetProfile.role !== "admin") {
      await ctx.db.patch(targetProfile._id, {
        role: "admin",
      });
    }

    // Don't allow modifying owner's permissions
    if (targetProfile.isOwner) {
      throw new ConvexError("لا يمكن تعديل صلاحيات المالك");
    }

    // Check if permissions already exist
    const existingPermissions = await ctx.db
      .query("adminPermissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existingPermissions) {
      // Update existing permissions
      await ctx.db.patch(existingPermissions._id, {
        manage_users: permissionData.manage_users,
        manage_orders: permissionData.manage_orders,
        manage_stores: permissionData.manage_stores,
        manage_products: permissionData.manage_products,
        manage_captains: permissionData.manage_captains,
        manage_notifications: permissionData.manage_notifications,
        view_reports: permissionData.view_reports,
        manage_settings: permissionData.manage_settings,
        view_activity_logs: permissionData.view_activity_logs,
        updatedAt: now,
      });
    } else {
      // Create new permissions
      await ctx.db.insert("adminPermissions", {
        userId: userId,
        manage_users: permissionData.manage_users,
        manage_orders: permissionData.manage_orders,
        manage_stores: permissionData.manage_stores,
        manage_products: permissionData.manage_products,
        manage_captains: permissionData.manage_captains,
        manage_notifications: permissionData.manage_notifications,
        view_reports: permissionData.view_reports,
        manage_settings: permissionData.manage_settings,
        view_activity_logs: permissionData.view_activity_logs,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Delete admin permissions (Owner only)
export const deleteAdminPermissions = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId } = args;
    const currentUserId = await getAuthUserId(ctx, sessionToken);
    if (!currentUserId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Check if current user is owner
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    if (!currentProfile || (currentProfile.role !== "admin" && currentProfile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المالك يمكنه حذف الصلاحيات");
    }

    // Don't allow deleting owner's permissions
    if (currentProfile.userId === userId) {
      throw new ConvexError("لا يمكن حذف صلاحيات المالك");
    }

    // Find and delete permissions
    const permissions = await ctx.db
      .query("adminPermissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (permissions) {
      await ctx.db.delete(permissions._id);

      // Update user role back to customer if permissions are deleted
      const targetProfile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (targetProfile && targetProfile.role === "admin") {
        await ctx.db.patch(targetProfile._id, {
          role: "customer",
        });
      }
    }
  },
});

// Suspend admin account (Owner only)
export const suspendAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId } = args;
    const currentUserId = await getAuthUserId(ctx, sessionToken);
    if (!currentUserId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Check if current user is owner
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    if (!currentProfile || (currentProfile.role !== "admin" && currentProfile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المالك يمكنه إيقاف الإداريين");
    }

    // Don't allow suspending owner
    if (currentProfile.userId === userId) {
      throw new ConvexError("لا يمكن إيقاف المالك");
    }

    // Find and suspend permissions
    const permissions = await ctx.db
      .query("adminPermissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (permissions) {
      await ctx.db.patch(permissions._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    }
  },
});

// Activate admin account (Owner only)
export const activateAdmin = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, userId } = args;
    const currentUserId = await getAuthUserId(ctx, sessionToken);
    if (!currentUserId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    // Check if current user is owner
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    if (!currentProfile || (currentProfile.role !== "admin" && currentProfile.role !== "owner")) {
      throw new ConvexError("غير مصرح - فقط المالك يمكنه تفعيل الإداريين");
    }

    // Find and activate permissions
    const permissions = await ctx.db
      .query("adminPermissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (permissions) {
      await ctx.db.patch(permissions._id, {
        isActive: true,
        updatedAt: Date.now(),
      });
    }
  },
});

// Helper function to check if user has specific permission (for use in other files)
export async function hasPermission(
  ctx: any,
  permission: string,
  sessionToken?: string | null
): Promise<boolean> {
  const userId = await getAuthUserId(ctx, sessionToken);
  if (!userId) {
    return false;
  }

  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  if (!profile || profile.role !== "admin") {
    return false;
  }

  // Check if owner using isOwner field
  if (profile.isOwner) {
    return true; // Owner has all permissions
  }

  // Check specific permission
  const permissions = await ctx.db
    .query("adminPermissions")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  if (!permissions || !permissions.isActive) {
    return false;
  }

  return permissions[permission as keyof typeof permissions] === true;
}
