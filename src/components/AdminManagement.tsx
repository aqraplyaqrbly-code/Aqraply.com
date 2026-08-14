import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContextNew";
import {
  Shield,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Save,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminPermission {
  _id: any;
  userId: any;
  manage_users: boolean;
  manage_orders: boolean;
  manage_stores: boolean;
  manage_products: boolean;
  manage_captains: boolean;
  manage_notifications: boolean;
  view_reports: boolean;
  manage_settings: boolean;
  view_activity_logs: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  user: {
    _id: any;
    userId: any;
    fullName: string;
    email?: string;
    isOwner?: boolean;
  } | null;
}

export default function AdminManagement() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const allAdminPermissions = useQuery(api.adminPermissions.getAllAdminPermissions, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const allUsers = useQuery(api.admin.getAllUsers, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const upsertPermissions = useMutation(api.adminPermissions.upsertAdminPermissions);
  const suspendAdmin = useMutation(api.adminPermissions.suspendAdmin);
  const activateAdmin = useMutation(api.adminPermissions.activateAdmin);
  const deleteAdminPermissions = useMutation(api.adminPermissions.deleteAdminPermissions);
  const makeOwner = useMutation(api.profiles.makeOwner);

  // Debug logging
  console.log("AdminManagement - allAdminPermissions:", allAdminPermissions);
  console.log("AdminManagement - allUsers:", allUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<AdminPermission | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [permissions, setPermissions] = useState<Partial<AdminPermission>>({
    manage_users: false,
    manage_orders: false,
    manage_stores: false,
    manage_products: false,
    manage_captains: false,
    manage_notifications: false,
    view_reports: false,
    manage_settings: false,
    view_activity_logs: false,
  });

  // Reset permissions when opening create modal
  const handleOpenCreateModal = () => {
    setEditingAdmin(null);
    setIsCreating(true);
    setSelectedUserId("");
    setPermissions({
      manage_users: false,
      manage_orders: false,
      manage_stores: false,
      manage_products: false,
      manage_captains: false,
      manage_notifications: false,
      view_reports: false,
      manage_settings: false,
      view_activity_logs: false,
    });
  };

  // Set permissions when opening edit modal
  const handleOpenEditModal = (admin: AdminPermission) => {
    setEditingAdmin(admin);
    setIsCreating(false);
    setSelectedUserId(admin.userId);
    setPermissions({
      manage_users: admin.manage_users,
      manage_orders: admin.manage_orders,
      manage_stores: admin.manage_stores,
      manage_products: admin.manage_products,
      manage_captains: admin.manage_captains,
      manage_notifications: admin.manage_notifications,
      view_reports: admin.view_reports,
      manage_settings: admin.manage_settings,
      view_activity_logs: admin.view_activity_logs,
    });
  };

  // Filter users who are not already admins
  const availableUsers = allUsers?.filter((user) => {
    const isAdmin = allAdminPermissions?.some((admin) => admin.userId === user._id);
    return !isAdmin && user.role !== "admin";
  }) || [];

  // Filter admins based on search
  const filteredAdmins = allAdminPermissions?.filter((admin) =>
    admin.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSavePermissions = async () => {
    const userIdToUse = isCreating ? selectedUserId : editingAdmin?.userId;

    if (!userIdToUse) {
      toast.error(t('errors.mustSelectUser'));
      return;
    }

    setLoading(true);
    try {
      await upsertPermissions({
        ...(sessionToken && { sessionToken }),
        userId: userIdToUse as any,
        manage_users: permissions.manage_users || false,
        manage_orders: permissions.manage_orders || false,
        manage_stores: permissions.manage_stores || false,
        manage_products: permissions.manage_products || false,
        manage_captains: permissions.manage_captains || false,
        manage_notifications: permissions.manage_notifications || false,
        view_reports: permissions.view_reports || false,
        manage_settings: permissions.manage_settings || false,
        view_activity_logs: permissions.view_activity_logs || false,
      });
      toast.success(t('errors.permissionsSaved'));
      setEditingAdmin(null);
      setIsCreating(false);
      setSelectedUserId("");
      setPermissions({
        manage_users: false,
        manage_orders: false,
        manage_stores: false,
        manage_products: false,
        manage_captains: false,
        manage_notifications: false,
        view_reports: false,
        manage_settings: false,
        view_activity_logs: false,
      });
    } catch (error: any) {
      toast.error(error.message || t('errors.errorSavingPermissions'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId: any) => {
    setLoading(true);
    try {
      await suspendAdmin({ ...(sessionToken && { sessionToken }), userId });
      toast.success(t('errors.adminSuspended'));
    } catch (error: any) {
      toast.error(error.message || t('errors.errorSuspendingAdmin'));
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId: any) => {
    setLoading(true);
    try {
      await activateAdmin({ ...(sessionToken && { sessionToken }), userId });
      toast.success(t('errors.adminActivated'));
    } catch (error: any) {
      toast.error(error.message || t('errors.errorActivatingAdmin'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: any) => {
    if (!confirm(t('errors.confirmDeleteAdmin'))) return;

    setLoading(true);
    try {
      await deleteAdminPermissions({ ...(sessionToken && { sessionToken }), userId });
      toast.success(t('errors.adminDeleted'));
    } catch (error: any) {
      toast.error(error.message || t('errors.errorDeletingAdmin'));
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOwner = async () => {
    if (!confirm(t('errors.confirmMakeOwner'))) return;

    setLoading(true);
    try {
      await makeOwner({ ...(sessionToken && { sessionToken }) });
      toast.success(t('errors.ownerMade'));
      // Refresh the page to update permissions
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || t('errors.errorMakingOwner'));
    } finally {
      setLoading(false);
    }
  };

  const permissionLabels = {
    manage_users: t('errors.manageUsers'),
    manage_orders: t('errors.manageOrders'),
    manage_stores: t('errors.manageStores'),
    manage_products: t('errors.manageProducts'),
    manage_captains: t('errors.manageCaptains'),
    manage_notifications: t('errors.manageNotifications'),
    view_reports: t('errors.viewReports'),
    manage_settings: t('errors.manageSettings'),
    view_activity_logs: t('errors.viewActivityLogs'),
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('errors.adminManagement')}</h1>
        <p className="text-gray-600">{t('errors.adminManagementDesc')}</p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('errors.searchAdmin')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMakeOwner}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {t('errors.makeAccountOwner')}
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {t('errors.addAdmin')}
          </button>
        </div>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('errors.admin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('errors.permissions')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('errors.status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('errors.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {t('errors.noAdmins')}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="mr-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.user?.fullName || t('errors.unknown')}
                            </div>
                            {admin.user?.isOwner && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                {t('errors.owner')}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.user?.email || t('errors.unknown')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(permissionLabels).map(([key, label]) => {
                          const hasPermission = admin[key as keyof AdminPermission] as boolean;
                          return hasPermission ? (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                            >
                              {label}
                            </span>
                          ) : null;
                        })}
                        {!Object.values(admin).some((v) => typeof v === "boolean" && v) && (
                          <span className="text-sm text-gray-400">{t('errors.noPermissions')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          {t('errors.active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 ml-1" />
                          {t('errors.suspended')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {!admin.user?.isOwner && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(admin)}
                              className="text-purple-600 hover:text-purple-900"
                              title={t('errors.edit')}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {admin.isActive ? (
                              <button
                                onClick={() => handleSuspend(admin.userId)}
                                className="text-orange-600 hover:text-orange-900"
                                title={t('errors.suspend')}
                              >
                                <Ban className="w-5 h-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(admin.userId)}
                                className="text-green-600 hover:text-green-900"
                                title={t('errors.activate')}
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(admin.userId)}
                              className="text-red-600 hover:text-red-900"
                              title={t('errors.delete')}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {admin.user?.isOwner && (
                          <span className="text-gray-400 text-xs">{t('errors.cannotEditOwner')}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(editingAdmin || isCreating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {isCreating ? t('errors.addNewAdmin') : t('errors.editAdminPermissions')}
                </h2>
                <button
                  onClick={() => {
                    setEditingAdmin(null);
                    setIsCreating(false);
                    setSelectedUserId("");
                    setPermissions({
                      manage_users: false,
                      manage_orders: false,
                      manage_stores: false,
                      manage_products: false,
                      manage_captains: false,
                      manage_notifications: false,
                      view_reports: false,
                      manage_settings: false,
                      view_activity_logs: false,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isCreating && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('errors.selectUser')}
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">{t('errors.selectUserPlaceholder')}</option>
                    {availableUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fullName || user.email || t('errors.unknown')} - {user.email || t('errors.noEmail')}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {t('errors.willShowNonAdmins')}
                  </p>
                  {availableUsers.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">
                      {t('errors.noAvailableUsers')}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('errors.permissions')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions[key as keyof AdminPermission] as boolean}
                        onChange={(e) => {
                          setPermissions({
                            ...permissions,
                            [key]: e.target.checked,
                          });
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="mr-3 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingAdmin(null);
                  setIsCreating(false);
                  setSelectedUserId("");
                  setPermissions({
                    manage_users: false,
                    manage_orders: false,
                    manage_stores: false,
                    manage_products: false,
                    manage_captains: false,
                    manage_notifications: false,
                    view_reports: false,
                    manage_settings: false,
                    view_activity_logs: false,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {t('errors.cancel')}
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {t('errors.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
