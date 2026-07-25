import React from 'react';
import { AlertTriangle, LogOut, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContextNew';
import { toast } from 'react-hot-toast';

export default function SuspendedUserPage() {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('تم تسجيل الخروج');
      window.location.href = '/';
    } catch (error) {
      toast.error('فشل تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
            حسابك موقوف
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            تم إيقاف حسابك مؤقتاً من قبل الإدارة. لا يمكنك الوصول إلى التطبيق في الوقت الحالي.
          </p>

          {/* Reasons */}
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">أسباب الإيقاف المحتملة:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• انتهاك شروط الخدمة</li>
              <li>• تقارير من المستخدمين الآخرين</li>
              <li>• نشاط مشبوه</li>
              <li>• طلب من فريق الدعم</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">الخطوات التالية:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• تواصل مع فريق الدعم</li>
              <li>• قدم طلب استئناف</li>
              <li>• انتظر مراجعة الحالة</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <p className="text-sm text-gray-500 mb-3 text-center">للتواصل مع الدعم الفني:</p>
            <div className="space-y-2">
              <a 
                href="mailto:support@aqraply.com" 
                className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <Mail className="w-4 h-4" />
                support@aqraply.com
              </a>
              <a 
                href="tel:+201234567890" 
                className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <Phone className="w-4 h-4" />
                +201234567890
              </a>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>

          {/* Appeal Button */}
          <button
            onClick={() => window.location.href = 'mailto:support@aqraply.com?subject=طلب استئناف إيقاف الحساب'}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
          >
            طلب استئناف الحساب
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            إذا كنت تعتقد أن هناك خطأ، يرجى التواصل معنا فوراً
          </p>
        </div>
      </div>
    </div>
  );
}
