import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import components
import HomePage from "./components/HomePage";
import CustomerApp from "./components/CustomerApp";
import MerchantDashboard from "./components/MerchantDashboard";
import CaptainApp from "./components/CaptainApp";
import AdminDashboard from "./components/AdminDashboard";
import LoginPage from "./components/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import UniversalResetPassword from "./components/UniversalResetPassword";
import MerchantForgotPassword from "./components/MerchantForgotPassword";
import CaptainForgotPassword from "./components/CaptainForgotPassword";
import AdminForgotPassword from "./components/AdminForgotPassword";
import CustomerForgotPassword from "./components/CustomerForgotPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import MaintenanceMode from "./components/MaintenanceMode";

export default function App() {
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
              <LoginPage />
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

