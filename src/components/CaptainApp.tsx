import { useState } from "react";
import { 
  MapPin, 
  Navigation, 
  Package, 
  DollarSign, 
  Clock,
  CheckCircle,
  Phone,
  User,
  TrendingUp,
  Power
} from "lucide-react";
import { Routes, Route } from "react-router-dom";

const currency = "EGP";

import { NavigationBar } from "./NavigationBar";
import CaptainAuth from "./CaptainAuth";
import CaptainNotifications from "./CaptainNotifications";
import CaptainDashboard from "./CaptainDashboard";
import SuspensionCheck from "./SuspensionCheck";
import { useAuth } from "../contexts/AuthContextNew";

export default function CaptainApp() {
  const { user, isAuthenticated, role } = useAuth();

  // إذا لم يكن المستخدم مسجل دخول أو لا يوجد ملف شخصي
  if (!isAuthenticated || !user || !user.profile) {
    return <CaptainAuth />;
  }

  // التحقق من أن المستخدم كابتن
  if (user.profile.role !== "captain") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">غير مصرح</h2>
            <p className="text-gray-600 mb-4">
              هذه الصفحة مخصصة للكباتن فقط. حسابك مسجل كـ {user.profile.role === "customer" ? "عميل" : user.profile.role === "merchant" ? "تاجر" : "مدير"}.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SuspensionCheck allowedRoles={['captain', 'admin']}>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Routes>
          <Route path="/" element={<CaptainDashboard />} />
          <Route path="/dashboard" element={<CaptainDashboard />} />
          <Route path="/orders" element={<AvailableOrders />} />
          <Route path="/earnings" element={<Earnings />} />
        </Routes>
      </div>
    </SuspensionCheck>
  );
}

function AvailableOrders() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">الطلبات المتاحة</h3>
        
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">لا توجد طلبات متاحة</h3>
          <p className="text-sm text-gray-600">في انتظار طلبات جديدة...</p>
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">الأرباح</h3>
        
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">لا توجد أرباح بعد</h3>
          <p className="text-sm text-gray-600">ابدأ بتوصيل الطلبات لتحقيق الأرباح</p>
        </div>
      </div>
    </div>
  );
}
