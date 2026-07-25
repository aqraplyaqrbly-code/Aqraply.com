import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ShoppingBag, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CustomerResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("identifier") || "";
  const identifierType = searchParams.get("type") as "email" | "phone" || "email";
  const otp = searchParams.get("otp") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPasswordWithOTP = useMutation(api.security.resetPasswordWithOTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (!newPassword || newPassword.length < 8) {
      toast.error(t('forgotPassword.passwordMinLength'));
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      toast.error(t('forgotPassword.passwordMismatch'));
      return;
    }

    // Validate password strength
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error(t('forgotPassword.passwordStrength'));
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordWithOTP({
        identifier,
        identifierType,
        otp,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        toast.success(t('forgotPassword.resetSuccess'));
        navigate("/customer");
      }
    } catch (error: any) {
      toast.error(error.message || t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPassword.resetTitle')}</h1>
          <p className="text-gray-600">{t('forgotPassword.resetSubtitle')}</p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('forgotPassword.newPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-start">{t('forgotPassword.passwordRequirements')}</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('forgotPassword.confirmNewPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        newPassword.length >= 8 * level
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-start">
                  {newPassword.length < 8
                    ? t('forgotPassword.weak')
                    : newPassword.length < 12
                    ? t('forgotPassword.medium')
                    : t('forgotPassword.strong')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('forgotPassword.resetting') : t('forgotPassword.resetPassword')}
              <CheckCircle className="w-5 h-5" />
            </button>
          </form>

          {/* Back to Login */}
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
