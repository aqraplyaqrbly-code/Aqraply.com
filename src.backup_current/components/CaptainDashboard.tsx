import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
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
  Upload
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
  const [isOnline, setIsOnline] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleType: "",
    vehicleNumber: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Queries
  const currentProfile = useQuery(api.profiles.getCurrentProfile);
  const notifications = useQuery(api.notifications.getUserNotifications) || [];
  const todayOrders = useQuery(api.orders.getCaptainOrders) || [];
  
  // Mutations
  const updateStatus = useMutation(api.profiles.updateOnlineStatus);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const updateProfile = useMutation(api.profiles.updateProfile);
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);
  const acceptOrder = useMutation(api.orders.acceptOrder);
  const rejectOrder = useMutation(api.orders.rejectOrder);
  const completeOrder = useMutation(api.orders.completeOrder);
  const updateOrderStatusByCaptain = useMutation(api.orders.updateOrderStatusByCaptain);

  // Update online status
  useEffect(() => {
    if (currentProfile) {
      updateStatus({ isOnline });
    }
  }, [isOnline, currentProfile, updateStatus]);

  // Initialize edit form with current profile data
  useEffect(() => {
    if (currentProfile) {
      setEditFormData({
        fullName: currentProfile.fullName || "",
        phone: currentProfile.phone || "",
        email: currentProfile.email || "",
        vehicleType: currentProfile.vehicleType || "",
        vehicleNumber: currentProfile.vehicleNumber || ""
      });
      setImagePreview(currentProfile.imageUrl || null);
    }
  }, [currentProfile]);

  // Calculate stats
  const completedOrders = todayOrders.filter((order: any) => order.status === "delivered").length;
  const totalEarnings = todayOrders
    .filter((order: any) => order.status === "delivered")
    .reduce((sum: number, order: any) => sum + (order.deliveryFee || 30), 0);
  
  const unreadCount = notifications.filter((n: CaptainNotification) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("يرجى اختيار صورة صالحة");
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
        toast.error("الاسم الكامل مطلوب");
        return;
      }
      
      if (!editFormData.phone.trim()) {
        toast.error("رقم الهاتف مطلوب");
        return;
      }
      
      if (!editFormData.vehicleType.trim()) {
        toast.error("نوع المركبة مطلوب");
        return;
      }
      
      if (!editFormData.vehicleNumber.trim()) {
        toast.error("رقم المركبة مطلوب");
        return;
      }
      
      let imageUrl = currentProfile?.imageUrl;
      
      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        
        if (!response.ok) {
          throw new Error("فشل رفع الصورة");
        }
        
        const { storageId } = await response.json();
        imageUrl = storageId;
      }
      
      await updateProfile({
        fullName: editFormData.fullName.trim(),
        phone: editFormData.phone.trim(),
        email: editFormData.email?.trim() || undefined,
        vehicleType: editFormData.vehicleType.trim(),
        vehicleNumber: editFormData.vehicleNumber.trim(),
        imageUrl
      });
      
      toast.success("تم تحديث البيانات بنجاح");
      setShowEditProfile(false);
      setImageFile(null);
    } catch (error: any) {
      console.error("Profile update error:", error);
      
      // عرض رسالة خطأ مفصلة
      if (error.message?.includes("رقم الهاتف مستخدم بالفعل")) {
        toast.error("رقم الهاتف مستخدم بالفعل");
      } else if (error.message?.includes("رقم الهاتف غير صحيح")) {
        toast.error("رقم الهاتف غير صحيح");
      } else if (error.message?.includes("البريد الإلكتروني غير صحيح")) {
        toast.error("البريد الإلكتروني غير صحيح");
      } else if (error.message?.includes("الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل")) {
        toast.error("الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل");
      } else if (error.message?.includes("رقم المركبة يجب أن يحتوي على حرفين على الأقل")) {
        toast.error("رقم المركبة يجب أن يحتوي على حرفين على الأقل");
      } else if (error.message?.includes("نوع المركبة غير صحيح")) {
        toast.error("نوع المركبة غير صحيح");
      } else if (error.message?.includes("فشل رفع الصورة")) {
        toast.error("فشل رفع الصورة، يرجى المحاولة مرة أخرى");
      } else {
        toast.error("فشل تحديث البيانات، يرجى المحاولة مرة أخرى");
      }
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrder({ orderId });
      toast.success("تم استقبال الطلب بنجاح");
    } catch (error) {
      toast.error("فشل استقبال الطلب");
      console.error(error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrder({ orderId });
      toast.success("تم رفض الطلب");
    } catch (error) {
      toast.error("فشل رفض الطلب");
      console.error(error);
    }
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      await updateOrderStatusByCaptain({ orderId, status: "delivering" });
      toast.success("تم بدء التوصيل بنجاح");
    } catch (error: any) {
      console.error("Start delivery error:", error);
      toast.error(`فشل بدء التوصيل: ${error.message || "خطأ غير معروف"}`);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await completeOrder({ orderId });
      toast.success("تم إنهاء التوصيل بنجاح");
    } catch (error: any) {
      console.error("Complete order error:", error);
      
      // Show specific error messages based on the error
      if (error.message?.includes("يجب أن يكون الطلب في حالة التوصيل")) {
        toast.error("يجب أن تكون في حالة التوصيل أولاً! اضغط على 'بدء التوصيل' أولاً");
      } else if (error.message?.includes("ليس لديك صلاحية")) {
        toast.error("ليس لديك صلاحية لهذا الطلب");
      } else if (error.message?.includes("الطلب غير موجود")) {
        toast.error("الطلب غير موجود");
      } else {
        toast.error(`فشل إنهاء التوصيل: ${error.message || "خطأ غير معروف"}`);
      }
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">لوحة الكابتن</h1>
                <p className="text-xs text-gray-500">إدارة التوصيل</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {currentProfile?.imageUrl ? (
                    <img 
                      src={currentProfile.imageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{currentProfile?.fullName}</p>
                  <p className="text-xs text-gray-500">كابتن</p>
                </div>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="تعديل البيانات"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-12 left-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        الإشعارات
                      </h3>
                    </div>

                    <div className="overflow-y-auto max-h-80">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">لا توجد إشعارات</p>
                        </div>
                      ) : (
                        notifications.map((notification: CaptainNotification) => (
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
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isOnline
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Power className="w-5 h-5" />
                {isOnline ? "متصل" : "غير متصل"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Status Banner */}
        {!isOnline && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Power className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">أنت غير متصل حالياً</h3>
                <p className="text-gray-600 mb-4">
                  قم بالاتصال لتلقي طلبات التوصيل الجديدة في منطقتك
                </p>
                <button
                  onClick={() => setIsOnline(true)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  الاتصال الآن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">اليوم</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{completedOrders}</h3>
            <p className="text-sm text-gray-600">طلبات مكتملة</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">ج.م</span>
              </div>
              <span className="text-sm text-gray-500">اليوم</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalEarnings.toFixed(2)} {currency}</h3>
            <p className="text-sm text-gray-600">الأرباح</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">اليوم</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{todayOrders.length}</h3>
            <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-green-100 mb-2">إجمالي الأرباح</p>
              <h3 className="text-4xl font-bold">{totalEarnings.toFixed(2)} {currency}</h3>
            </div>
            <span className="text-green-600 font-bold">ج.م</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-green-100 text-sm mb-1">هذا الأسبوع</p>
              <p className="text-xl font-bold">{(totalEarnings * 7).toFixed(2)} {currency}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">هذا الشهر</p>
              <p className="text-xl font-bold">{(totalEarnings * 30).toFixed(2)} {currency}</p>
            </div>
          </div>
        </div>

        {/* All Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">جميع الطلبات</h3>
          
          {todayOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات متاحة</h4>
              <p className="text-gray-600">
                {isOnline ? "سيتم إشعارك عند توفر طلبات جديدة" : "قم بالاتصال لبدء تلقي الطلبات"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayOrders.map((order: any) => (
                <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {order.storeInfo?.name && `من ${order.storeInfo.name}`}
                            {order.storeInfo?.address && ` • 📍 ${order.storeInfo.address}`}
                            {order.deliveryLocation?.addressAr && ` • إلى ${order.deliveryLocation.addressAr}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-purple-600">{order.total.toFixed(2)} {currency}</p>
                        <div className="mt-1">
                          {order.status === "pending" && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              قيد الانتظار
                            </span>
                          )}
                          {order.status === "assigned" && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              تم التعيين
                            </span>
                          )}
                          {order.status === "delivering" && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              قيد التوصيل
                            </span>
                          )}
                          {order.status === "delivered" && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              تم التوصيل
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(order._id)}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            استقبال الطلب
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order._id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            رفض الطلب
                          </button>
                        </>
                      )}
                      
                      {order.status === "assigned" && (
                        <button
                          onClick={() => handleStartDelivery(order._id)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <Truck className="w-4 h-4" />
                          بدء التوصيل
                        </button>
                      )}
                      
                      {order.status === "delivering" && (
                        <button
                          onClick={() => handleCompleteOrder(order._id)}
                          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          إنهاء التوصيل
                        </button>
                      )}
                      
                      {order.status === "delivered" && (
                        <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
                          <CheckCircle className="w-4 h-4 inline ml-2" />
                          تم التوصيل
                        </div>
                      )}
                    </div>
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
    </div>
  );
}
