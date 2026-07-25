import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Trash2, Database, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function DatabaseCleanup() {
  const [isCleaning, setIsCleaning] = useState(false);
  const [selectedCleanup, setSelectedCleanup] = useState<string | null>(null);

  const cleanupAll = useMutation(api.cleanup.cleanupAll);
  const deleteExpiredOtps = useMutation(api.cleanup.deleteExpiredOtps);
  const deleteExpiredPasswordResetTokens = useMutation(api.cleanup.deleteExpiredPasswordResetTokens);
  const deleteExpiredSessions = useMutation(api.cleanup.deleteExpiredSessions);
  const deleteExpiredVerificationTokens = useMutation(api.cleanup.deleteExpiredVerificationTokens);
  const deleteExpiredVerificationCodes = useMutation(api.cleanup.deleteExpiredVerificationCodes);
  const deleteExpiredRefreshTokens = useMutation(api.cleanup.deleteExpiredRefreshTokens);
  const deleteOldSecurityLogs = useMutation(api.cleanup.deleteOldSecurityLogs);
  const deleteOldNotifications = useMutation(api.cleanup.deleteOldNotifications);
  const deleteExpiredCoupons = useMutation(api.cleanup.deleteExpiredCoupons);
  const deleteExpiredPromotions = useMutation(api.cleanup.deleteExpiredPromotions);
  const deleteExpiredFeaturedProducts = useMutation(api.cleanup.deleteExpiredFeaturedProducts);
  const dbStats = useQuery(api.cleanup.getDatabaseStats);

  const cleanupOptions = [
    {
      id: "all",
      name: "تنظيف شامل",
      description: "حذف جميع البيانات غير الضرورية دفعة واحدة",
      icon: Database,
      color: "red",
      mutation: cleanupAll,
    },
    {
      id: "otps",
      name: "OTP Tokens منتهية",
      description: "حذف رموز التحقق منتهية الصلاحية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredOtps,
    },
    {
      id: "passwordTokens",
      name: "Password Reset Tokens منتهية",
      description: "حذف رموز إعادة تعيين كلمة المرور منتهية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredPasswordResetTokens,
    },
    {
      id: "sessions",
      name: "Sessions منتهية",
      description: "حذف جلسات المصادقة منتهية الصلاحية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredSessions,
    },
    {
      id: "verificationTokens",
      name: "Verification Tokens منتهية",
      description: "حذف رموز التحقق منتهية الصلاحية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredVerificationTokens,
    },
    {
      id: "verificationCodes",
      name: "Verification Codes منتهية",
      description: "حذف أكواد التحقق منتهية الصلاحية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredVerificationCodes,
    },
    {
      id: "refreshTokens",
      name: "Refresh Tokens منتهية",
      description: "حذف رموز التحديث منتهية الصلاحية",
      icon: Trash2,
      color: "blue",
      mutation: deleteExpiredRefreshTokens,
    },
    {
      id: "securityLogs",
      name: "Security Logs قديمة",
      description: "حذف سجلات الأمان القديمة (30 يوم)",
      icon: Trash2,
      color: "orange",
      mutation: deleteOldSecurityLogs,
    },
    {
      id: "notifications",
      name: "Notifications قديمة",
      description: "حذف الإشعارات القديمة (7 أيام)",
      icon: Trash2,
      color: "orange",
      mutation: deleteOldNotifications,
    },
    {
      id: "coupons",
      name: "Coupons منتهية",
      description: "حذف الكوبونات منتهية الصلاحية",
      icon: Trash2,
      color: "purple",
      mutation: deleteExpiredCoupons,
    },
    {
      id: "promotions",
      name: "Promotions منتهية",
      description: "حذف العروض الترويجية منتهية الصلاحية",
      icon: Trash2,
      color: "purple",
      mutation: deleteExpiredPromotions,
    },
    {
      id: "featuredProducts",
      name: "Featured Products منتهية",
      description: "حذف المنتجات المميزة منتهية الصلاحية",
      icon: Trash2,
      color: "purple",
      mutation: deleteExpiredFeaturedProducts,
    },
  ];

  const handleCleanup = async (option: typeof cleanupOptions[0]) => {
    setIsCleaning(true);
    setSelectedCleanup(option.id);

    try {
      let result;
      if (option.id === "all") {
        result = await cleanupAll();
        toast.success(`تم التنظيف الشامل! ${result.totalDeleted} سجل محذوف`);
      } else if (option.id === "securityLogs" || option.id === "notifications") {
        result = await option.mutation({ daysOld: option.id === "securityLogs" ? 30 : 7 });
        toast.success(result.message);
      } else {
        result = await option.mutation();
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error("فشل في عملية التنظيف");
    } finally {
      setIsCleaning(false);
      setSelectedCleanup(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تنظيف قاعدة البيانات</h2>
          <p className="text-gray-600">حذف البيانات غير الضرورية لتقليل استخدام Convex</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900 mb-1">تحذير</h3>
          <p className="text-sm text-yellow-800">
            هذه العمليات ستحذف البيانات بشكل دائم. تأكد من عمل نسخة احتياطية قبل التنظيف.
          </p>
        </div>
      </div>

      {/* Database Stats */}
      {dbStats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">إحصائيات قاعدة البيانات</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(dbStats).map(([table, count]) => (
              <div key={table} className="bg-white rounded p-2 text-center">
                <p className="text-xs text-gray-600 truncate">{table}</p>
                <p className="text-lg font-bold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cleanup Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cleanupOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleCleanup(option)}
              disabled={isCleaning}
              className={`bg-gradient-to-r ${getColorClasses(option.color)} text-white rounded-lg p-4 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-right`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-semibold">{option.name}</h3>
              </div>
              <p className="text-sm opacity-90">{option.description}</p>
              {isCleaning && selectedCleanup === option.id && (
                <div className="flex items-center gap-2 mt-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">جاري التنظيف...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
