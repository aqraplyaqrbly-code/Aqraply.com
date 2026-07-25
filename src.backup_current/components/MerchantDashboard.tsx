import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MerchantAuth from "./MerchantAuth";
import MerchantDashboardContent from "./MerchantDashboardContent";
import { NavigationBar } from "./NavigationBar";
import SuspensionCheck from "./SuspensionCheck";

export default function MerchantDashboard() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentProfile = useQuery(api.profiles.getCurrentProfile);

  // إذا لم يكن المستخدم مسجل دخول أو لا يوجد ملف شخصي
  if (!loggedInUser || !currentProfile) {
    return <MerchantAuth />;
  }

  // التحقق من أن المستخدم تاجر
  if (currentProfile.role !== "merchant") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة مخصصة للتجار فقط. حسابك مسجل كـ {currentProfile.role === "customer" ? "عميل" : currentProfile.role === "captain" ? "كابتن" : "مدير"}.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // عرض لوحة التحكم
  return (
    <SuspensionCheck allowedRoles={['merchant', 'admin']}>
      <NavigationBar />
      <MerchantDashboardContent profile={currentProfile} />
    </SuspensionCheck>
  );
}
