import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import "./i18n";

// Import components
import HomePage from "./components/HomePage";
import CustomerApp from "./components/CustomerApp";
import MerchantDashboard from "./components/MerchantDashboard";
import CaptainApp from "./components/CaptainApp";
import AdminDashboard from "./components/AdminDashboard";
import LoginPage from "./components/LoginPage";
import UnifiedLogin from "./components/UnifiedLogin";
import UnifiedRegister from "./components/UnifiedRegister";
import ForgotPassword from "./components/ForgotPassword";
import UniversalResetPassword from "./components/UniversalResetPassword";
import MerchantForgotPassword from "./components/MerchantForgotPassword";
import CaptainForgotPassword from "./components/CaptainForgotPassword";
import AdminForgotPassword from "./components/AdminForgotPassword";
import CustomerForgotPassword from "./components/CustomerForgotPassword";
import MerchantVerifyOTP from "./components/MerchantVerifyOTP";
import CaptainVerifyOTP from "./components/CaptainVerifyOTP";
import CustomerVerifyOTP from "./components/CustomerVerifyOTP";
import AdminVerifyOTP from "./components/AdminVerifyOTP";
import MerchantResetPassword from "./components/MerchantResetPassword";
import CaptainResetPassword from "./components/CaptainResetPassword";
import CustomerResetPassword from "./components/CustomerResetPassword";
import AdminResetPassword from "./components/AdminResetPassword";
import MerchantChangePassword from "./components/MerchantChangePassword";
import CaptainChangePassword from "./components/CaptainChangePassword";
import CustomerChangePassword from "./components/CustomerChangePassword";
import AdminChangePassword from "./components/AdminChangePassword";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContextNew";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import MaintenanceMode from "./components/MaintenanceMode";
import AiAssistant from "./components/AiAssistant";

export default function App() {
  // Set document direction based on saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLanguage;
  }, []);

  return (
    <ErrorBoundary>
      <SystemSettingsProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
          {/* الصفحة الرئيسية - متاحة للجميع */}
          <Route path="/" element={
            <MaintenanceMode>
              <HomePage />
            </MaintenanceMode>
          } />

          {/* صفحة تسجيل الدخول */}
          <Route path="/login" element={
            <MaintenanceMode>
              <UnifiedLogin />
            </MaintenanceMode>
          } />

          {/* صفحة التسجيل الموحدة */}
          <Route path="/register" element={
            <MaintenanceMode>
              <UnifiedRegister />
            </MaintenanceMode>
          } />

          {/* صفحة التسجيل حسب الدور */}
          <Route path="/register/:role" element={
            <MaintenanceMode>
              <UnifiedRegister />
            </MaintenanceMode>
          } />

          {/* صفحة تسجيل دخول المدير */}
          <Route path="/admin-login" element={
            <MaintenanceMode>
              <LoginPage />
            </MaintenanceMode>
          } />

          {/* صفحة نسيت كلمة المرور */}
          <Route path="/forgot-password" element={
            <MaintenanceMode>
              <ForgotPassword />
            </MaintenanceMode>
          } />

          {/* صفحة إعادة تعيين كلمة المرور */}
          <Route path="/reset-password" element={
            <MaintenanceMode>
              <UniversalResetPassword />
            </MaintenanceMode>
          } />

          {/* صفحات نسيت كلمة المرور الخاصة بالأدوار */}
          <Route path="/customer/forgot-password" element={
            <MaintenanceMode>
              <CustomerForgotPassword />
            </MaintenanceMode>
          } />
          <Route path="/merchant/forgot-password" element={
            <MaintenanceMode>
              <MerchantForgotPassword />
            </MaintenanceMode>
          } />
          <Route path="/captain/forgot-password" element={
            <MaintenanceMode>
              <CaptainForgotPassword />
            </MaintenanceMode>
          } />
          <Route path="/admin/forgot-password" element={
            <MaintenanceMode>
              <AdminForgotPassword />
            </MaintenanceMode>
          } />

          {/* صفحات التحقق بـ OTP */}
          <Route path="/customer/verify-otp" element={
            <MaintenanceMode>
              <CustomerVerifyOTP />
            </MaintenanceMode>
          } />
          <Route path="/merchant/verify-otp" element={
            <MaintenanceMode>
              <MerchantVerifyOTP />
            </MaintenanceMode>
          } />
          <Route path="/captain/verify-otp" element={
            <MaintenanceMode>
              <CaptainVerifyOTP />
            </MaintenanceMode>
          } />
          <Route path="/admin/verify-otp" element={
            <MaintenanceMode>
              <AdminVerifyOTP />
            </MaintenanceMode>
          } />

          {/* صفحات إعادة تعيين كلمة المرور بالـ OTP */}
          <Route path="/customer/reset-password" element={
            <MaintenanceMode>
              <CustomerResetPassword />
            </MaintenanceMode>
          } />
          <Route path="/merchant/reset-password" element={
            <MaintenanceMode>
              <MerchantResetPassword />
            </MaintenanceMode>
          } />
          <Route path="/captain/reset-password" element={
            <MaintenanceMode>
              <CaptainResetPassword />
            </MaintenanceMode>
          } />
          <Route path="/admin/reset-password" element={
            <MaintenanceMode>
              <AdminResetPassword />
            </MaintenanceMode>
          } />

          {/* صفحات تغيير كلمة المرور للمستخدمين المسجلين */}
          <Route path="/customer/change-password" element={
            <MaintenanceMode>
              <ProtectedRoute>
                <CustomerChangePassword />
              </ProtectedRoute>
            </MaintenanceMode>
          } />
          <Route path="/merchant/change-password" element={
            <MaintenanceMode>
              <ProtectedRoute>
                <MerchantChangePassword />
              </ProtectedRoute>
            </MaintenanceMode>
          } />
          <Route path="/captain/change-password" element={
            <MaintenanceMode>
              <ProtectedRoute>
                <CaptainChangePassword />
              </ProtectedRoute>
            </MaintenanceMode>
          } />
          <Route path="/admin/change-password" element={
            <AdminErrorBoundary>
              <ProtectedRoute>
                <AdminChangePassword />
              </ProtectedRoute>
            </AdminErrorBoundary>
          } />

          {/* مسارات العميل - متاحة للجميع للتصفح */}
          <Route path="/customer/*" element={
            <MaintenanceMode>
              <CustomerApp />
            </MaintenanceMode>
          } />

          {/* مسارات التاجر */}
          <Route path="/merchant/*" element={
            <MaintenanceMode>
              <MerchantDashboard />
            </MaintenanceMode>
          } />

          {/* مسارات الكابتن */}
          <Route path="/captain/*" element={
            <MaintenanceMode>
              <CaptainApp />
            </MaintenanceMode>
          } />

          {/* مسارات المدير - لا تطبق عليها وضع الصيانة */}
          <Route path="/admin/*" element={
            <AdminErrorBoundary>
              <AdminDashboard />
            </AdminErrorBoundary>
          } />

          {/* إعادة توجيه المسارات غير المعروفة */}
          <Route path="*" element={
            <MaintenanceMode>
              <Navigate to="/" replace />
            </MaintenanceMode>
          } />
        </Routes>
        <AiAssistant />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
        </BrowserRouter>
      </AuthProvider>
    </SystemSettingsProvider>
    </ErrorBoundary>
  );
}

