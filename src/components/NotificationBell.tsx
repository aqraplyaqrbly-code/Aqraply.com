
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

interface Notification {
  _id: string;
  userId: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: string;
  isRead: boolean;
  relatedOrderId?: string;
  _creationTime: number;
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { sessionToken, isAuthenticated } = useAuth();

  // Fetch notifications data
  const notifications = useQuery(api.notifications.getUserNotifications, isAuthenticated && sessionToken ? { sessionToken, limit: 20 } : "skip") || [];
  const unreadCount = useQuery(api.notifications.getUnreadCount, isAuthenticated && sessionToken ? { sessionToken } : "skip") || 0;

  // Filter notifications based on showUnreadOnly
  const filteredNotifications = showUnreadOnly 
    ? notifications.filter((n: Notification) => !n.isRead)
    : notifications;

  // Mutations
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ sessionToken, notificationId: notificationId as any });
      toast.success(t('errors.notificationMarkedAsRead'));
    } catch (error) {
      toast.error(t('errors.notificationUpdateFailed'));
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({ sessionToken });
      toast.success(t('errors.allNotificationsMarkedAsRead'));
      setIsOpen(false);
    } catch (error) {
      toast.error(t('errors.notificationsUpdateFailed'));
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
        aria-label={t('errors.notifications')}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{t('errors.notifications')}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                {showUnreadOnly ? t('errors.showAll') : t('errors.showUnreadOnly')}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  {t('errors.markAllAsRead')}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {filteredNotifications && filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.titleAr || notification.title}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.messageAr || notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification._creationTime).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors flex-shrink-0"
                        aria-label="تعليم كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">لا توجد إشعارات</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}