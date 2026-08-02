import React from 'react';
import { AlertTriangle, LogOut, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContextNew';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function SuspendedUserPage() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success(t('errors.logoutSuccess'));
      window.location.href = '/';
    } catch (error) {
      toast.error(t('errors.logoutFailed'));
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
            {t('errors.accountSuspended')}
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {t('errors.accountSuspendedDesc')}
          </p>

          {/* Reasons */}
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t('errors.suspensionReasons')}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t('errors.reasonTermsViolation')}</li>
              <li>• {t('errors.reasonUserReports')}</li>
              <li>• {t('errors.reasonSuspiciousActivity')}</li>
              <li>• {t('errors.reasonSupportRequest')}</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t('errors.nextSteps')}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t('errors.stepContactSupport')}</li>
              <li>• {t('errors.stepSubmitAppeal')}</li>
              <li>• {t('errors.stepWaitReview')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <p className="text-sm text-gray-500 mb-3 text-center">{t('errors.contactTechnicalSupport')}</p>
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
            {t('errors.signOut')}
          </button>

          {/* Appeal Button */}
          <button
            onClick={() => window.location.href = 'mailto:support@aqraply.com?subject=طلب استئناف إيقاف الحساب'}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
          >
            {t('errors.requestAppeal')}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {t('errors.ifErrorContactUs')}
          </p>
        </div>
      </div>
    </div>
  );
}
