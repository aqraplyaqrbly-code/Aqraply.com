import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Truck, Shield, ArrowRight, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CaptainVerifyOTP() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("identifier") || "";
  const identifierType = searchParams.get("type") as "email" | "phone" || "email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  const verifyOTP = useMutation(api.security.verifyOTP);
  const requestPasswordResetOTP = useMutation(api.security.requestPasswordResetOTP);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error(t('forgotPassword.enterOTP'));
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP({
        identifier,
        identifierType,
        otp: otpValue,
      });

      if (result.success) {
        toast.success(t('forgotPassword.verifySuccess'));
        navigate(`/captain/reset-password?identifier=${identifier}&type=${identifierType}&otp=${otpValue}`);
      }
    } catch (error: any) {
      toast.error(error.message || t('forgotPassword.otpIncorrect'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      await requestPasswordResetOTP({
        identifier,
        identifierType,
      });
      toast.success(t('forgotPassword.otpSent'));
      setTimeLeft(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error: any) {
      toast.error(error.message || t('errors.somethingWentWrong'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPassword.twoFactorAuth')}</h1>
          <p className="text-gray-600">
            {t('forgotPassword.otpSentTo')} {identifierType === "email" ? t('forgotPassword.yourEmail') : t('forgotPassword.yourPhone')}
          </p>
          <p className="text-sm text-gray-500 mt-2">{identifier}</p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{t('forgotPassword.expiresIn')} {formatTime(timeLeft)}</span>
            </div>

            {/* OTP Input */}
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  required
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('forgotPassword.verifying') : t('forgotPassword.verifyOTP')}
              <CheckCircle className="w-5 h-5" />
            </button>

            {/* Resend OTP */}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-3 text-green-600 font-semibold hover:text-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {resendLoading ? t('forgotPassword.resending') : t('forgotPassword.resendOTP')}
                <RefreshCw className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`} />
              </button>
            ) : (
              <div className="text-center text-sm text-gray-500">
                {t('forgotPassword.resendIn')} {formatTime(timeLeft)}
              </div>
            )}
          </form>

          {/* Back */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/captain/forgot-password")}
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
