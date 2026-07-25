import { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";

interface EmailVerificationControlProps {
  children: React.ReactNode;
  showMessage?: boolean;
}

export default function EmailVerificationControl({ children, showMessage = true }: EmailVerificationControlProps) {
  const { settings } = useSystemSettings();
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);

  useEffect(() => {
    setEmailVerificationRequired(settings?.emailVerificationRequired || false);
  }, [settings]);

  // Check if email verification is required
  if (emailVerificationRequired && showMessage) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              التحقق من البريد الإلكتروني مطلوب
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ستحتاج إلى التحقق من بريدك الإلكتروني بعد التسجيل
            </p>
          </div>
          <CheckCircle className="w-4 h-4 text-blue-500" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
