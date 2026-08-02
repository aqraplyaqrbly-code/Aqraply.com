import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContextNew';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { t } = useTranslation();
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('errors.verifyingPermissions')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // حفظ المسار الحالي للعودة إليه بعد تسجيل الدخول
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // التحقق من الدور المطلوب
  if (requiredRole && role !== requiredRole) {
    return <AccessDenied />;
  }

  // التحقق من الأدوار المسموحة
  if (allowedRoles && !allowedRoles.includes(role as UserRole)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}

function AccessDenied() {
  const { t } = useTranslation();
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errors.accessDenied')}</h2>
        <p className="text-gray-600 mb-6">
          {t('errors.noAccessPermission', { role: getRoleName(role) })}
        </p>
        <button
          onClick={() => window.history.back()}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          {t('errors.goBack')}
        </button>
      </div>
    </div>
  );
}

function getRoleName(role: string | null): string {
  switch (role) {
    case 'admin': return 'مدير';
    case 'merchant': return 'تاجر';
    case 'captain': return 'كابتن';
    case 'customer': return 'عميل';
    default: return 'غير محدد';
  }
}

// مكون للتوجيه التلقائي حسب الدور
export function RoleBasedRedirect() {
  const { t } = useTranslation();
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('errors.redirecting')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // توجيه حسب الدور
  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'merchant':
      return <Navigate to="/merchant" replace />;
    case 'captain':
      return <Navigate to="/captain" replace />;
    case 'customer':
      return <Navigate to="/customer" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}