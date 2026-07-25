import { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { AlertCircle, Ban, Users } from "lucide-react";

interface RegistrationControlProps {
  children: React.ReactNode;
}

export default function RegistrationControl({ children }: RegistrationControlProps) {
  const { settings } = useSystemSettings();
  const [allowRegistration, setAllowRegistration] = useState(true);

  useEffect(() => {
    setAllowRegistration(settings?.allowRegistration !== false);
  }, [settings?.allowRegistration]);

  // Check if registration is allowed
  if (!allowRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Registration Disabled Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-10 h-10 text-red-600" />
          </div>
          
          {/* Registration Disabled Message */}
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            التسجيل مغلق حالياً
          </h1>
          
          <p className="text-gray-600 mb-6">
            عذراً، التسجيل الجديد مغلق في الوقت الحالي. 
            يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          
          {/* Additional Info */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">لماذا التسجيل مغلق؟</span>
            </div>
            <p className="text-sm text-gray-600">
              قد يكون التسجيل مغلقاً لأسباب إدارية أو صيانة نظامية
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-2">
              هل تحتاج إلى مساعدة؟
            </p>
            <div className="flex flex-col gap-2">
              {settings?.supportEmail && (
                <a 
                  href={`mailto:${settings.supportEmail}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  {settings.supportEmail}
                </a>
              )}
              {settings?.supportPhone && (
                <a 
                  href={`tel:${settings.supportPhone}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  {settings.supportPhone}
                </a>
              )}
            </div>
          </div>
          
          {/* Login Link */}
          <div className="mt-6">
            <a 
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
