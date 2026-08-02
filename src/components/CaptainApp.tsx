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
import { useTranslation } from "react-i18next";

const currency = "EGP";

import { NavigationBar } from "./NavigationBar";
import CaptainAuth from "./CaptainAuth";
import CaptainNotifications from "./CaptainNotifications";
import CaptainDashboard from "./CaptainDashboard";
import SuspensionCheck from "./SuspensionCheck";
import { useAuth } from "../contexts/AuthContextNew";

export default function CaptainApp() {
  const { t } = useTranslation();
  const { user, isAuthenticated, role } = useAuth();

  // إذا لم يكن المستخدم مسجل دخول أو لا يوجد ملف شخصي
  if (!isAuthenticated || !user || !user.profile) {
    return <CaptainAuth />;
  }

  // التحقق من أن المستخدم كابتن
  if (user.profile.role !== "captain") {
    const roleText = user.profile.role === "customer" ? t('captain.customer') : user.profile.role === "merchant" ? t('captain.merchant') : t('captain.admin');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('captain.unauthorized')}</h2>
            <p className="text-gray-600 mb-4">
              {t('captain.captainOnly', { role: roleText })}
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              {t('captain.backToHome')}
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
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('captain.availableOrders')}</h3>
        
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">{t('captain.noOrdersAvailable')}</h3>
          <p className="text-sm text-gray-600">{t('captain.waitingForOrders')}</p>
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('captain.earnings')}</h3>
        
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">{t('captain.noEarnings')}</h3>
          <p className="text-sm text-gray-600">{t('captain.startDelivering')}</p>
        </div>
      </div>
    </div>
  );
}
