import React from 'react';
import { useAuth } from '../contexts/AuthContextNew';
import SuspendedUserPage from './SuspendedUserPage';

interface SuspensionCheckProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function SuspensionCheck({ children, allowedRoles }: SuspensionCheckProps) {
  const { user, isAuthenticated } = useAuth();

  // إذا لم يكن المستخدم مسجل دخول، أظهر الأطفال (للسماح بتسجيل الدخول)
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  // إذا كان المستخدم مسجل دخول ولكن ليس لديه ملف شخصي موقوف
  if (!user.profile) {
    return <>{children}</>;
  }

  // التحقق من حالة الإيقاف
  if (user.profile.isSuspended) {
    return <SuspendedUserPage />;
  }

  // التحقق من الأدوار المسموح بها (إذا تم تحديدها)
  if (allowedRoles && !allowedRoles.includes(user.profile.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة مخصصة لـ {allowedRoles.join(' أو ')} فقط.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // كل شيء على ما يرام، أظهر الأطفال
  return <>{children}</>;
}
