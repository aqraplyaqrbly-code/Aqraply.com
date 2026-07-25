import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Crown, Mail, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminForgotPassword() {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-purple-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('success.operationCompleted')}</h2>
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
              onClick={() => navigate(`/admin/verify-otp?identifier=${identifier}&type=${identifierType}`)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {t('forgotPassword.enterOTP')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl shadow-xl mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('forgotPassword.title')}</h1>
          <p className="text-gray-500">{t('forgotPassword.subtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier Type Selector */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  identifierType === "email"
                    ? "bg-purple-600 text-white"
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
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('forgotPassword.phone')}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full pe-10 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  placeholder={identifierType === "email" ? t('forgotPassword.emailPlaceholder') : t('forgotPassword.phonePlaceholder')}
                  required
                  maxLength={identifierType === "phone" ? 11 : undefined}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-2xl hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendOTP')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full mt-4 text-purple-600 text-sm font-medium"
          >
            {t('forgotPassword.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
