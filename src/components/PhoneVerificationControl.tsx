import { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { Phone, AlertCircle, CheckCircle } from "lucide-react";

interface PhoneVerificationControlProps {
  children: React.ReactNode;
  showMessage?: boolean;
}

export default function PhoneVerificationControl({ children, showMessage = true }: PhoneVerificationControlProps) {
  const { settings } = useSystemSettings();
  const [phoneVerificationRequired, setPhoneVerificationRequired] = useState(false);

  useEffect(() => {
    setPhoneVerificationRequired(settings?.phoneVerificationRequired || false);
  }, [settings?.phoneVerificationRequired]);

  // Check if phone verification is required
  if (phoneVerificationRequired && showMessage) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              التحقق من الهاتف مطلوب
            </p>
            <p className="text-xs text-green-600 mt-1">
              ستحتاج إلى التحقق من رقم هاتفك بعد التسجيل
            </p>
          </div>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
