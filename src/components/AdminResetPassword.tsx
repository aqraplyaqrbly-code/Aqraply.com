import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Crown, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminResetPassword() {
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
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(error.message || t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl shadow-xl mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('forgotPassword.resetTitle')}</h1>
          <p className="text-gray-500">{t('forgotPassword.resetSubtitle')}</p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('forgotPassword.newPassword')}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
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
              <p className="text-xs text-gray-500 mt-1">{t('forgotPassword.passwordRequirements')}</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('forgotPassword.confirmNewPassword')}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
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
                          ? "bg-purple-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
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
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('forgotPassword.resetting') : t('forgotPassword.resetPassword')}
              <CheckCircle className="w-5 h-5" />
            </button>
          </form>

          {/* Back to Login */}
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
