import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import {
  Bell,
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  Store,
} from "lucide-react";

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

interface Notification {
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

export default function CaptainNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useQuery(api.notifications.getUserNotifications) || [];
  const markAsRead = useMutation(api.notifications.markAsRead);

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // إذا كانت إشعار تعيين طلب، يمكن توجيه الكابتن لصفحة الطلب
    if (notification.type === "order_assignment" && notification.relatedOrderId) {
      // هنا يمكن توجيه لصفحة تفاصيل الطلب
      console.log("Navigate to order:", notification.relatedOrderId);
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
    <div className="relative">
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* قائمة الإشعارات */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50" dir="rtl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* قائمة الإشعارات */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* أيقونة الإشعار */}
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

                    {/* محتوى الإشعار */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {notification.titleAr}
                        </h4>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(notification._creationTime)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.messageAr}
                      </p>

                      {/* بيانات المتجر */}
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

                      {/* بيانات العميل للطلبات */}
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

                      {/* بيانات الطلب */}
                      {notification.orderInfo && (
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">تفاصيل الطلب:</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">رقم الطلب:</span>
                              <span className="font-bold text-orange-600">{notification.orderInfo.orderNumber}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">الإجمالي:</span>
                              <span className="font-bold text-green-600">{notification.orderInfo.total} {currency}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">عدد المنتجات:</span>
                              <span className="font-medium">{notification.orderInfo.itemsCount}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs mt-2">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{notification.orderInfo.deliveryAddress}</span>
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

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
