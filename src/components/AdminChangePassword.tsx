import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Crown, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextNew";

export default function AdminChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = useMutation(api.security.changePassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current password
    if (!currentPassword) {
      toast.error(t('forgotPassword.currentPasswordRequired'));
      return;
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      toast.error(t('forgotPassword.passwordMinLength'));
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      toast.error(t('forgotPassword.passwordMismatch'));
      return;
    }

    // Validate new password is different from current
    if (currentPassword === newPassword) {
      toast.error(t('forgotPassword.newPasswordDifferent'));
      return;
    }

    // Validate password strength
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error(t('forgotPassword.passwordStrength'));
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword({
        ...(sessionToken && { sessionToken }),
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        toast.success(t('forgotPassword.changeSuccess'));
        navigate("/admin/dashboard");
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('forgotPassword.changePassword')}</h1>
          <p className="text-gray-500">{t('forgotPassword.updatePassword')}</p>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('forgotPassword.currentPassword')}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('forgotPassword.newPassword')}</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              {loading ? t('forgotPassword.changing') : t('forgotPassword.changePassword')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="w-full mt-4 text-gray-600 text-sm font-medium"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
