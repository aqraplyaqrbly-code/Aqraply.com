import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ShoppingBag, Mail, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CustomerForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devOTP, setDevOTP] = useState("");

  const requestPasswordResetOTP = useMutation(api.security.requestPasswordResetOTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier) {
      toast.error(identifierType === "email" ? t('forgotPassword.enterEmail') : t('forgotPassword.enterPhone'));
      return;
    }

    // Validate email format
    if (identifierType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        toast.error(t('forgotPassword.invalidEmail'));
        return;
      }
    }

    // Validate phone format
    if (identifierType === "phone") {
      if (!/^\d{11}$/.test(identifier)) {
        toast.error(t('forgotPassword.invalidPhone'));
        return;
      }
    }

    setLoading(true);
    try {
      const result = await requestPasswordResetOTP({
        identifier,
        identifierType,
      });
      setIsSuccess(true);
      setDevOTP(result.otp || "");
      toast.success(t('forgotPassword.otpSent'));
    } catch (error: any) {
      toast.error(error.message || t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('success.operationCompleted')}</h2>
              <p className="text-gray-600 mb-6">
                {t('forgotPassword.otpSentTo')} {identifierType === "email" ? t('forgotPassword.yourEmail') : t('forgotPassword.yourPhone')}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {t('forgotPassword.otpValidFor')}
              </p>

              {/* Development Mode: Show OTP */}
              {devOTP && (
                <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <p className="text-xs text-yellow-700 mb-2 font-semibold">{t('forgotPassword.devMode')}</p>
                  <p className="text-3xl font-bold text-yellow-900 tracking-widest">{devOTP}</p>
                  <p className="text-xs text-yellow-600 mt-2">{t('forgotPassword.useThisOTP')}</p>
                </div>
              )}

              <button
                onClick={() => navigate(`/customer/verify-otp?identifier=${identifier}&type=${identifierType}`)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {t('forgotPassword.enterOTP')}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPassword.title')}</h1>
          <p className="text-gray-600">{t('forgotPassword.subtitle')}</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier Type Selector */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  identifierType === "email"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('forgotPassword.email')}
              </button>
              <button
                type="button"
                onClick={() => setIdentifierType("phone")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  identifierType === "phone"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('forgotPassword.phone')}
              </button>
            </div>

            {/* Email or Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {identifierType === "email" ? t('forgotPassword.email') : t('forgotPassword.phone')}
              </label>
              <div className="relative">
                {identifierType === "email" ? (
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type={identifierType === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder={identifierType === "email" ? t('forgotPassword.emailPlaceholder') : t('forgotPassword.phonePlaceholder')}
                  required
                  maxLength={identifierType === "phone" ? 11 : undefined}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendOTP')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/customer")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
