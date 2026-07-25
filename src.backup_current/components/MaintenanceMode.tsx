import { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { AlertTriangle, Wrench, Clock } from "lucide-react";

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export default function MaintenanceMode({ children }: MaintenanceModeProps) {
  const { settings } = useSystemSettings();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    setIsMaintenanceMode(settings?.maintenanceMode || false);
  }, [settings]);

  // Check if maintenance mode is enabled
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Maintenance Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
          
          {/* Maintenance Message */}
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            الموقع تحت الصيانة
          </h1>
          
          <p className="text-gray-600 mb-6">
            نحن نقوم بتحسين الموقع لتقديم خدمة أفضل لك. 
            نعتذر عن أي إزعاج وسنعود قريباً.
          </p>
          
          {/* Additional Info */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">وقت الصيانة المتوقع</span>
            </div>
            <p className="text-sm text-gray-600">
              قد تستغرق الصيانة من بضع دقائق إلى ساعة قليلة
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-2">
              هل تحتاج إلى مساعدة عاجلة؟
            </p>
            <div className="flex flex-col gap-2">
              {settings?.supportEmail && (
                <a 
                  href={`mailto:${settings.supportEmail}`}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {settings.supportEmail}
                </a>
              )}
              {settings?.supportPhone && (
                <a 
                  href={`tel:${settings.supportPhone}`}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {settings.supportPhone}
                </a>
              )}
            </div>
          </div>
          
          {/* Admin Access Notice */}
          <div className="mt-6 text-xs text-gray-400">
            <p>يمكن للمسؤولين الوصول إلى لوحة الإدارة</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
