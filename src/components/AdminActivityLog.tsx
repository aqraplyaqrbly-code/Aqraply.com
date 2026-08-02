import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Search,
  RefreshCw,
  Filter,
  Calendar,
  Clock,
  User,
  Store,
  Package,
  Bell,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface ActivityLog {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: "user" | "store" | "product" | "order" | "notification" | "system";
  entityName: string;
  entityId: string;
  details: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failed" | "warning" | "info";
}

export default function ActivityLog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEntityType, setFilterEntityType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  // Mock data for now - this would come from a real API
  const mockActivities: ActivityLog[] = [
    {
      _id: "1",
      userId: "user1",
      userName: "أحمد محمد",
      userRole: "admin",
      action: "حذف مستخدم",
      entityType: "user",
      entityName: "محمد علي",
      entityId: "user123",
      details: "تم حذف المستخدم بسبب انتهاك شروط الخدمة",
      timestamp: Date.now() - 3600000,
      ipAddress: "192.168.1.1",
      status: "success",
    },
    {
      _id: "2",
      userId: "user2",
      userName: "سارة أحمد",
      userRole: "merchant",
      action: "إضافة منتج",
      entityType: "product",
      entityName: "بيتزا خاصة",
      entityId: "prod123",
      details: "تم إضافة منتج جديد للمتجر",
      timestamp: Date.now() - 7200000,
      status: "success",
    },
    {
      _id: "3",
      userId: "user3",
      userName: "مدير النظام",
      userRole: "admin",
      action: "إرسال إشعار",
      entityType: "notification",
      entityName: "إشعار صيانة",
      entityId: "notif123",
      details: "تم إرسال إشعار لجميع المستخدمين",
      timestamp: Date.now() - 10800000,
      status: "info",
    },
  ];

  const activities = mockActivities; // Replace with useQuery(api.admin.getActivityLogs)

  const filteredActivities = (activities || [])
    .filter((a) => filterEntityType === null || a.entityType === filterEntityType)
    .filter((a) => filterStatus === null || a.status === filterStatus)
    .filter((a) => 
      !searchTerm || 
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((a) => {
      if (!filterDate) return true;
      const activityDate = new Date(a.timestamp).toDateString();
      const filterDateObj = new Date(filterDate).toDateString();
      return activityDate === filterDateObj;
    });

  const entityTypes = [
    { key: null, label: t('errors.allEntities') },
    { key: "user", label: t('errors.users') },
    { key: "store", label: t('errors.stores') },
    { key: "product", label: t('errors.products') },
    { key: "order", label: t('errors.orders') },
    { key: "notification", label: t('errors.notifications') },
    { key: "system", label: t('errors.system') },
  ];

  const statusTypes = [
    { key: null, label: t('errors.allStatuses') },
    { key: "success", label: t('errors.success') },
    { key: "failed", label: t('errors.failed') },
    { key: "warning", label: t('errors.warning') },
    { key: "info", label: t('errors.info') },
  ];

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="w-4 h-4" />;
      case "store": return <Store className="w-4 h-4" />;
      case "product": return <Package className="w-4 h-4" />;
      case "order": return <Package className="w-4 h-4" />;
      case "notification": return <Bell className="w-4 h-4" />;
      case "system": return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      case "warning": return "bg-yellow-100 text-yellow-700";
      case "info": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return t('errors.admin');
      case "merchant": return t('errors.merchant');
      case "captain": return t('errors.captain');
      case "customer": return t('errors.customer');
      default: return role;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('errors.activityLog')}</h1>
        <p className="text-gray-500 mt-1">
          {activities ? `${activities.length} ${t('errors.totalActivities')}` : t('errors.loading')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{t('errors.totalActivity')}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activities?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{t('errors.successful')}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities?.filter((a) => a.status === "success").length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">{t('errors.failed')}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities?.filter((a) => a.status === "failed").length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">{t('errors.warning')}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities?.filter((a) => a.status === "warning").length ?? "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('errors.searchActivity')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <select
              value={filterEntityType || ""}
              onChange={(e) => setFilterEntityType(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              {entityTypes.map(({ key, label }) => (
                <option key={String(key)} value={key || ""}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              {statusTypes.map(({ key, label }) => (
                <option key={String(key)} value={key || ""}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate || ""}
              onChange={(e) => setFilterDate(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {!activities ? (
            <div className="px-6 py-12 text-center">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">{t('errors.loading')}</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">{t('errors.noActivities')}</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getEntityIcon(activity.entityType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{activity.userName}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                          {getRoleLabel(activity.userRole)}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{activity.action}</h3>
                      <p className="text-gray-600 mb-2">{activity.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {getEntityIcon(activity.entityType)}
                          {activity.entityName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleDateString("ar-EG")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleTimeString("ar-EG")}
                        </span>
                        {activity.ipAddress && (
                          <span>IP: {activity.ipAddress}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
