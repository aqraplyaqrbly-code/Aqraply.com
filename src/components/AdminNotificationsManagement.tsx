import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContextNew";
import {
  Bell,
  Send,
  Users,
  Store,
  Truck,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Calendar,
} from "lucide-react";

interface Notification {
  _id: Id<"notifications">;
  title: string;
  message: string;
  targetRole?: string;
  targetUsers?: Id<"users">[];
  isRead: boolean;
  createdAt: number;
  type: "info" | "success" | "warning" | "error";
}

export default function NotificationsManagement() {
  const { sessionToken, isAuthenticated } = useAuth();
  const notifications = useQuery(api.admin.getAllNotifications, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const sendNotification = useMutation(api.admin.sendNotification);
  const markAsRead = useMutation(api.admin.markNotificationAsRead);
  const deleteNotification = useMutation(api.admin.deleteNotification);
  
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    targetRole: "all",
    type: "info" as const,
  });

  const filteredNotifications = (notifications || [])
    .filter((n) => filterType === null || n.type === filterType)
    .filter((n) => filterStatus === null || 
      (filterStatus === "read" && n.isRead) || 
      (filterStatus === "unread" && !n.isRead))
    .filter((n) => 
      !searchTerm || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error("يجب إدخال عنوان ونص الإشعار");
      return;
    }

    try {
      await sendNotification({
        sessionToken,
        title: newNotification.title,
        message: newNotification.message,
        targetRole: newNotification.targetRole === "all" ? undefined : newNotification.targetRole,
        type: newNotification.type,
      });
      
      toast.success("تم إرسال الإشعار بنجاح");
      setNewNotification({
        title: "",
        message: "",
        targetRole: "all",
        type: "info",
      });
      setShowCompose(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إرسال الإشعار");
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        sessionToken,
        notificationId: notificationId as Id<"notifications">,
        isRead: true,
      });
      toast.success("تم تحديد الإشعار كمقروء");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث الإشعار");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) {
      return;
    }
    try {
      await deleteNotification({
        sessionToken,
        notificationId: notificationId as Id<"notifications">,
      });
      toast.success("تم حذف الإشعار");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حذف الإشعار");
    }
  };

  const typeLabels = {
    info: "معلومات",
    success: "نجاح",
    warning: "تحذير",
    error: "خطأ",
  };

  const typeColors = {
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الإشعارات</h1>
        <p className="text-gray-500 mt-1">
          {notifications ? `${notifications.length} إشعار إجماليًا` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">إجمالي الإشعارات</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{notifications?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">غير مقروءة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {notifications?.filter((n) => !n.isRead).length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">مقروءة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {notifications?.filter((n) => n.isRead).length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">معدل القراءة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {notifications && notifications.length > 0 
              ? Math.round((notifications.filter(n => n.isRead).length / notifications.length) * 100)
              : "—"}%
          </p>
        </div>
      </div>

      {/* Compose Notification Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCompose(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          إرسال إشعار جديد
        </button>
      </div>

      {/* Compose Notification Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إرسال إشعار جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  placeholder="عنوان الإشعار"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-32 resize-none"
                  placeholder="نص الإشعار"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجمهور المستهدف</label>
                <select
                  value={newNotification.targetRole}
                  onChange={(e) => setNewNotification({...newNotification, targetRole: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                >
                  <option value="all">جميع المستخدمين</option>
                  <option value="customer">العملاء فقط</option>
                  <option value="merchant">التجار فقط</option>
                  <option value="captain">الكباتن فقط</option>
                  <option value="admin">المديرون فقط</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإشعار</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                >
                  <option value="info">معلومات</option>
                  <option value="success">نجاح</option>
                  <option value="warning">تحذير</option>
                  <option value="error">خطأ</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSendNotification}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                إرسال
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <select
              value={filterType || ""}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">كل الأنواع</option>
              <option value="info">معلومات</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
            </select>
            <select
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">الحالة</option>
              <option value="read">مقروءة</option>
              <option value="unread">غير مقروءة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {!notifications ? (
            <div className="px-6 py-12 text-center">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">جاري التحميل...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">لا توجد إشعارات</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${typeColors[notification.type]}`}>
                        {typeLabels[notification.type]}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notification.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.createdAt).toLocaleTimeString("ar-EG")}
                      </span>
                      {notification.targetRole && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {notification.targetRole === "customer" ? "العملاء" :
                           notification.targetRole === "merchant" ? "التجار" :
                           notification.targetRole === "captain" ? "الكباتن" :
                           notification.targetRole === "admin" ? "المديرون" : notification.targetRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        تحديد كمقروء
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      حذف
                    </button>
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
