import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";
import OrderActionButtons from "./OrderActionButtons";
import OrderProgressTimeline from "./OrderProgressTimeline";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  MapPin,
  Navigation,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  User,
  TrendingUp,
  Power,
  Bell,
  Star,
  Truck,
  Calendar,
  ArrowRight,
  MessageCircle,
  Store,
  Edit,
  Save,
  X,
  Mail,
  Camera,
  Upload,
  Lock
} from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

const currency = "EGP";

interface CustomerInfo {
  fullName: string;
  phone: string;
  address?: string;
  email?: string;
}

interface StoreInfo {
  name: string;
  address: string;
  phone: string;
}

interface OrderInfo {
  orderNumber: string;
  total: number;
  deliveryAddress: string;
  itemsCount: number;
}

interface CaptainNotification {
  _id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: string;
  isRead: boolean;
  relatedOrderId?: string;
  customerInfo?: CustomerInfo;
  storeInfo?: StoreInfo;
  orderInfo?: OrderInfo;
  _creationTime: number;
}

export default function CaptainDashboard() {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [connectionDuration, setConnectionDuration] = useState<string>("");
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleType: "",
    vehicleNumber: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);
  
  // Mutations
  const { user, isAuthenticated, isLoading, sessionToken } = useAuth();
  const notifications = useQuery(api.notifications.getUserNotifications, isAuthenticated && sessionToken ? { sessionToken } : "skip") || [];
  const todayOrders = useQuery(api.orders.getCaptainOrders, isAuthenticated && sessionToken ? { sessionToken } : "skip") || [];
  const updateStatus = useMutation(api.profiles.updateOnlineStatus);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const updateProfile = useMutation(api.profiles.updateProfile);
  const acceptOrder = useMutation(api.orders.acceptOrder);
  const rejectOrder = useMutation(api.orders.rejectOrder);
  const completeOrder = useMutation(api.orders.completeOrder);
  const updateOrderStatusByCaptain = useMutation(api.orders.updateOrderStatusByCaptain);

  // Get online status from user profile (persisted in database)
  const isOnline = user?.profile?.isOnline ?? false;
  const connectedAt = user?.profile?.connectedAt;

  // Loading state
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Calculate connection duration
  useEffect(() => {
    if (!isOnline || !connectedAt) {
      setConnectionDuration("");
      return;
    }

    const updateDuration = () => {
      const now = Date.now();
      const diff = now - connectedAt;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setConnectionDuration(`${days} يوم و ${hours % 24} ساعات`);
      } else if (hours > 0) {
        setConnectionDuration(`${hours} ساعات و ${minutes % 60} دقيقة`);
      } else if (minutes > 0) {
        setConnectionDuration(`${minutes} دقيقة`);
      } else {
        setConnectionDuration("للتو");
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [isOnline, connectedAt]);

  // Initialize edit form with current profile data
  useEffect(() => {
    if (user?.profile) {
      setEditFormData({
        fullName: user.profile.fullName || "",
        phone: user.profile.phone || "",
        email: user.profile.email || "",
        vehicleType: user.profile.vehicleType || "",
        vehicleNumber: user.profile.vehicleNumber || ""
      });
      setImagePreview(user.profile.imageUrl || null);
    }
  }, [user?._id, user?.profile]);

  // Calculate stats - only delivered orders count for earnings
  const completedOrders = todayOrders.filter((order: any) => order.status === "delivered").length;
  const totalEarnings = todayOrders
    .filter((order: any) => order.status === "delivered")
    .reduce((sum: number, order: any) => {
      const fee = order.deliveryFee || order.storeInfo?.deliveryFee || 30;
      return sum + fee;
    }, 0);
  
  const unreadCount = notifications.filter((n: CaptainNotification) => !n.isRead).length;

  // Filter notifications based on showUnreadOnly
  const filteredNotifications = showUnreadOnly 
    ? notifications.filter((n: CaptainNotification) => !n.isRead)
    : notifications;

  // Handle online/offline status toggle
  const handleToggleOnlineStatus = async () => {
    try {
      await updateStatus({ sessionToken, isOnline: !isOnline });
      const message = !isOnline 
        ? t('captain.onlineSuccess')
        : t('captain.offlineSuccess');
      toast.success(message);
    } catch (error: any) {
      console.error("Error toggling online status:", error);
      toast.error(t('errors.somethingWentWrong'));
    }
  };

  const handleMarkAsRead = async (notificationId: Id<"notifications">) => {
    try {
      await markAsRead({ sessionToken, notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('validation.imageSizeMax'));
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(t('validation.invalidImage'));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // التحقق من البيانات قبل الإرسال
      if (!editFormData.fullName.trim()) {
        toast.error(t('validation.fullNameRequired'));
        return;
      }
      
      if (!editFormData.phone.trim()) {
        toast.error(t('validation.phoneRequired'));
        return;
      }
      
      if (!editFormData.vehicleType.trim()) {
        toast.error(t('validation.vehicleTypeRequired'));
        return;
      }

      if (!editFormData.vehicleNumber.trim()) {
        toast.error(t('captain.vehicleNumberRequired'));
        return;
      }

      await updateProfile({
        fullName: editFormData.fullName.trim(),
        phone: editFormData.phone.trim(),
        vehicleType: editFormData.vehicleType.trim(),
        vehicleNumber: editFormData.vehicleNumber.trim(),
      });

      toast.success(t('success.updatedSuccessfully'));
      setShowEditProfile(false);
      setImageFile(null);
    } catch (error: any) {
      console.error("Profile update error:", error);
      
      // عرض رسالة خطأ مفصلة
      if (error.message?.includes("رقم الهاتف مستخدم بالفعل")) {
        toast.error(t('errors.phoneAlreadyExists'));
      } else if (error.message?.includes("رقم الهاتف غير صحيح")) {
        toast.error(t('errors.invalidPhone'));
      } else if (error.message?.includes("البريد الإلكتروني غير صحيح")) {
        toast.error(t('errors.invalidEmail'));
      } else if (error.message?.includes("الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل")) {
        toast.error(t('merchant.fullNameMin3'));
      } else if (error.message?.includes("رقم المركبة يجب أن يحتوي على حرفين على الأقل")) {
        toast.error(t('captain.vehicleNumberMin2'));
      } else if (error.message?.includes("نوع المركبة غير صحيح")) {
        toast.error(t('captain.vehicleTypeRequired'));
      } else if (error.message?.includes("فشل رفع الصورة")) {
        toast.error(t('errors.uploadFailed'));
      } else {
        toast.error(t('errors.somethingWentWrong'));
      }
    }
  };

  const handleAcceptOrder = async (orderId: Id<"orders">) => {
    try {
      await acceptOrder({ sessionToken, orderId });
      toast.success(t('captain.orderAccepted'));
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("لا يمكن قبول")) {
        toast.error(t('captain.orderAlreadyActioned'));
      } else if (error.message?.includes("جاهزاً")) {
        toast.error(t('captain.orderMustBeReady'));
      } else {
        toast.error(t('captain.acceptOrderFailed'));
      }
    }
  };

  const handleRejectOrder = async (orderId: Id<"orders">) => {
    try {
      await rejectOrder({ sessionToken, orderId });
      toast.success(t('captain.orderRejected'));
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("لا يمكن رفض")) {
        toast.error(t('captain.orderAlreadyActioned'));
      } else if (error.message?.includes("جاهزاً")) {
        toast.error(t('captain.orderMustBeReady'));
      } else {
        toast.error(t('captain.rejectOrderFailed'));
      }
    }
  };

  const handlePickUp = async (orderId: Id<"orders">) => {
    try {
      await updateOrderStatusByCaptain({ sessionToken, orderId, status: "picked_up" });
      toast.success(t('captain.orderPickedUp'));
    } catch (error: any) {
      console.error("Pick up error:", error);
      if (error.message?.includes("لا يمكن استلام")) {
        toast.error(t('captain.orderMustBeAccepted'));
      } else {
        toast.error(`${t('captain.pickUpFailed')}: ${error.message || t('errors.unknownError')}`);
      }
    }
  };

  const handleStartDelivery = async (orderId: Id<"orders">) => {
    console.log("handleStartDelivery called with orderId:", orderId);
    console.log("sessionToken:", sessionToken ? "exists" : "missing");
    try {
      await updateOrderStatusByCaptain({ sessionToken, orderId, status: "delivering" });
      toast.success(t('captain.deliveryStarted'));
    } catch (error: any) {
      console.error("Start delivery error:", error);
      if (error.message?.includes("لا يمكن بدء")) {
        toast.error(t('captain.mustAcceptFirst'));
      } else if (error.message?.includes("معيناً")) {
        toast.error(t('captain.orderMustBeAccepted'));
      } else {
        toast.error(`${t('captain.startDeliveryFailed')}: ${error.message || t('errors.unknownError')}`);
      }
    }
  };

  const handleCompleteOrder = async (orderId: Id<"orders">) => {
    console.log("handleCompleteOrder called with orderId:", orderId);
    console.log("sessionToken:", sessionToken ? "exists" : "missing");
    try {
      await completeOrder({ sessionToken, orderId });
      toast.success(t('captain.orderDelivered'));
    } catch (error: any) {
      console.error("Complete order error:", error);
      toast.error(`${t('captain.completeOrderFailed')}: ${error.message || t('errors.unknownError')}`);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('common.now');
    if (minutes < 60) return t('common.minutesAgo', { count: minutes });
    if (hours < 24) return t('common.hoursAgo', { count: hours });
    return t('common.daysAgo', { count: days });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">لوحة الكابتن</h1>
                <p className="text-xs text-gray-500 hidden sm:block">إدارة التوصيل</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-12 left-0 right-0 sm:right-auto sm:left-0 sm:w-96 w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        الإشعارات
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {showUnreadOnly ? 'عرض الكل' : 'غير المقروءة فقط'}
                        </button>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead({ sessionToken })}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                          >
                            <CheckCheck className="w-4 h-4" />
                            اقرأ الكل
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-80">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">لا توجد إشعارات</p>
                        </div>
                      ) : (
                        filteredNotifications.map((notification: CaptainNotification) => (
                          <div
                            key={notification._id}
                            onClick={() => handleMarkAsRead(notification._id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notification.type === "order_assignment"
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}>
                                {notification.type === "order_assignment" ? (
                                  <Package className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Bell className="w-5 h-5 text-gray-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {notification.titleAr}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(notification._creationTime)}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-2">
                                  {notification.messageAr}
                                </p>

                                {/* Store Info */}
                                {notification.storeInfo && (
                                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">بيانات المتجر:</p>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-xs">
                                        <Store className="w-3 h-3 text-blue-400" />
                                        <span className="text-gray-700">{notification.storeInfo.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Phone className="w-3 h-3 text-blue-400" />
                                        <span className="text-gray-700 font-mono">{notification.storeInfo.phone}</span>
                                      </div>
                                      {notification.storeInfo.address && (
                                        <div className="flex items-start gap-2 text-xs">
                                          <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700">{notification.storeInfo.address}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Customer Info */}
                                {notification.customerInfo && (
                                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">بيانات العميل:</p>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-xs">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-700">{notification.customerInfo.fullName}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Phone className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-700 font-mono">{notification.customerInfo.phone}</span>
                                      </div>
                                      {notification.customerInfo.address && (
                                        <div className="flex items-start gap-2 text-xs">
                                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700">{notification.customerInfo.address}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Order Info */}
                                {notification.orderInfo && (
                                  <div className="bg-orange-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">تفاصيل الطلب:</p>
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">رقم الطلب:</span>
                                        <span className="font-bold text-orange-600">{notification.orderInfo.orderNumber}</span>
                                      </div>
                                      <div className="flex items-start justify-between text-xs">
                                        <span className="text-gray-600">عنوان التوصيل:</span>
                                        <span className="font-medium text-orange-600 text-right">{notification.orderInfo.deliveryAddress}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">الإجمالي:</span>
                                        <span className="font-bold text-green-600">{notification.orderInfo.total} {currency}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">عدد المنتجات:</span>
                                        <span className="font-medium">{notification.orderInfo.itemsCount}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Online Status Toggle */}
              <button
                onClick={handleToggleOnlineStatus}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-semibold transition-all ${
                  isOnline
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={isOnline ? "اضغط لقطع الاتصال" : "اضغط للاتصال"}
              >
                <Power className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  {isOnline ? "متصل الآن" : "غير متصل"}
                  {isOnline && connectionDuration && (
                    <span className="text-xs ml-1">({connectionDuration})</span>
                  )}
                </span>
                <span className="sm:hidden">
                  {isOnline ? "متصل" : "غير متصل"}
                </span>
              </button>

              {/* Profile - Mobile only */}
              <button
                onClick={() => setShowEditProfile(true)}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="تعديل البيانات"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>

              {/* Change Password - Mobile only */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="تغيير كلمة المرور"
              >
                <Lock className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Status Banner */}
        {!isOnline && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Power className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">أنت غير متصل حالياً</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  قم بالاتصال الآن لتلقي طلبات التوصيل الجديدة في منطقتك
                </p>
                <button
                  onClick={handleToggleOnlineStatus}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  اتصال الآن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-3 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">اليوم</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{completedOrders}</h3>
            <p className="text-xs sm:text-sm text-gray-600">طلبات مكتملة</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-base">ج.م</span>
              </div>
              <span className="text-xs text-gray-500">اليوم</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{totalEarnings.toFixed(2)}</h3>
            <p className="text-xs sm:text-sm text-gray-600">الأرباح</p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500">اليوم</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{todayOrders.length}</h3>
            <p className="text-xs sm:text-sm text-gray-600">إجمالي الطلبات</p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-8 text-white mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <p className="text-green-100 text-sm sm:text-base mb-1 sm:mb-2">إجمالي الأرباح</p>
              <h3 className="text-2xl sm:text-4xl font-bold">{totalEarnings.toFixed(2)} {currency}</h3>
            </div>
            <span className="text-green-600 font-bold text-sm sm:text-base hidden sm:inline">ج.م</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/20">
            <div>
              <p className="text-green-100 text-xs sm:text-sm mb-1">هذا الأسبوع</p>
              <p className="text-base sm:text-xl font-bold">{(totalEarnings * 7).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-green-100 text-xs sm:text-sm mb-1">هذا الشهر</p>
              <p className="text-base sm:text-xl font-bold">{(totalEarnings * 30).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* All Orders */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">جميع الطلبات</h3>
          
          {todayOrders.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات متاحة</h4>
              <p className="text-sm sm:text-base text-gray-600">
                {isOnline ? "سيتم إشعارك عند توفر طلبات جديدة" : "قم بالاتصال لبدء تلقي الطلبات"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todayOrders.map((order: any) => (
                <div key={order._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-3 sm:p-5">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          order.status === "pending" ? "bg-yellow-100" :
                          order.status === "assigned" ? "bg-blue-100" :
                          order.status === "picked_up" ? "bg-purple-100" :
                          order.status === "delivering" ? "bg-orange-100" :
                          "bg-green-100"
                        }`}>
                          <Package className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            order.status === "pending" ? "text-yellow-600" :
                            order.status === "assigned" ? "text-blue-600" :
                            order.status === "picked_up" ? "text-purple-600" :
                            order.status === "delivering" ? "text-orange-600" :
                            "text-green-600"
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-sm sm:text-lg truncate">{order.orderNumber}</p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2 flex-wrap">
                            {order.storeInfo?.name && (
                              <span className="flex items-center gap-1 truncate">
                                <Store className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{order.storeInfo.name}</span>
                              </span>
                            )}
                            {order.deliveryLocation?.addressAr && (
                              <span className="flex items-center gap-1 truncate">
                                <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{order.deliveryLocation.addressAr}</span>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-left flex-shrink-0 mr-2">
                        <p className="font-bold text-lg sm:text-2xl text-purple-600">{order.total.toFixed(2)}</p>
                        <div className="mt-1 sm:mt-2">
                          {order.status === "pending" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              قيد الانتظار
                            </span>
                          )}
                          {order.status === "assigned" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              تم التعيين
                            </span>
                          )}
                          {order.status === "picked_up" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              تم الاستلام
                            </span>
                          )}
                          {order.status === "delivering" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                              <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              قيد التوصيل
                            </span>
                          )}
                          {order.status === "delivered" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              تم التوصيل
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Store Info */}
                    {(order.customerInfo || order.storeInfo) && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-100 space-y-2 sm:space-y-3">
                        {order.storeInfo && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 border border-blue-200">
                            <p className="text-xs sm:text-sm font-bold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
                              <Store className="w-3 h-3 sm:w-4 sm:h-4" />
                              بيانات المتجر
                            </p>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Store className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                                </div>
                                <span className="font-medium text-blue-900 truncate">{order.storeInfo.name}</span>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                                </div>
                                <a href={`tel:${order.storeInfo.phone}`} className="font-mono text-blue-900 hover:underline truncate">{order.storeInfo.phone}</a>
                              </div>
                              {order.storeInfo.address && (
                                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                                  </div>
                                  <span className="text-blue-900 line-clamp-2">{order.storeInfo.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {order.customerInfo && (
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4" />
                              بيانات العميل
                            </p>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                </div>
                                <span className="font-medium text-gray-900 truncate">{order.customerInfo.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                </div>
                                <a href={`tel:${order.customerInfo.phone}`} className="font-mono text-gray-900 hover:underline truncate">{order.customerInfo.phone}</a>
                              </div>
                              {order.customerInfo.address && (
                                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                  </div>
                                  <span className="text-gray-900 line-clamp-2">{order.customerInfo.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Progress Timeline */}
                    <div className="mt-3 sm:mt-4">
                      <OrderProgressTimeline 
                        status={order.status}
                        orderId={order._id}
                        role="captain"
                        onAccept={handleAcceptOrder}
                        onReject={handleRejectOrder}
                        onPickUp={handlePickUp}
                        onStartDelivery={handleStartDelivery}
                        onComplete={handleCompleteOrder}
                      />
                    </div>

                    {/* Action Buttons */}
                    <OrderActionButtons
                      orderId={order._id}
                      status={order.status}
                      onAccept={handleAcceptOrder}
                      onReject={handleRejectOrder}
                      onPickUp={handlePickUp}
                      onStartDelivery={handleStartDelivery}
                      onComplete={handleCompleteOrder}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">تعديل البيانات الشخصية</h2>
                <button onClick={() => setShowEditProfile(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="p-6 space-y-4">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">نوع المركبة</label>
                <select
                  value={editFormData.vehicleType}
                  onChange={(e) => setEditFormData({ ...editFormData, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                >
                  <option value="">اختر نوع المركبة</option>
                  <option value="motorcycle">دراجة نارية</option>
                  <option value="car">سيارة</option>
                  <option value="bicycle">دراجة هوائية</option>
                  <option value="van">شاحنة صغيرة</option>
                </select>
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">رقم المركبة</label>
                <input
                  type="text"
                  value={editFormData.vehicleNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="أدخل رقم المركبة"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    حفظ التغييرات
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
      />
    </div>
  );
}
