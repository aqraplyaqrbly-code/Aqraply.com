import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Store, Mail, Lock, User, Phone, Building2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextNew";

type AuthMode = "login" | "signup" | "profile";

export default function MerchantAuth() {
  const { t } = useTranslation();
  const { signIn, signUp, sessionToken } = useAuth();
  const createProfile = useMutation(api.profiles.createProfile);
  const { user, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // بيانات تسجيل الدخول
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // بيانات الملف الشخصي
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessNameAr, setBusinessNameAr] = useState("");

  // Ref لتتبع ما إذا تم بالفعل تغيير الـ mode
  const hasSetProfileMode = useRef(false);

  // التحقق من حالة المستخدم
  useEffect(() => {
    if (isAuthenticated && user && !user.profile && !hasSetProfileMode.current && mode !== "profile") {
      setMode("profile");
      hasSetProfileMode.current = true;
    }
    // إعادة تعيين الـ ref إذا لم يكن المستخدم مسجلاً
    if (!isAuthenticated || !user) {
      hasSetProfileMode.current = false;
    }
  }, [isAuthenticated, user?._id, user?.profile, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(t('merchant.loginSuccess'));
      if (user && user.profile) {
        navigate("/merchant");
      } else {
        setMode("profile");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('merchant.loginFailed');
      if (message.includes("Invalid credentials")) {
        toast.error(t('merchant.passwordMin8'));
      } else if (message.includes("Account already exists")) {
        toast.error(t('merchant.accountNotFound'));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error(t('merchant.invalidEmail'));
      setLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      toast.error(t('merchant.passwordMin8'));
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      toast.success(t('merchant.accountCreatedProfile'));
      setMode("profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : t('merchant.signupFailed');
      if (message.includes("Account already exists")) {
        toast.error(t('merchant.accountNotFound'));
      } else if (message.includes("Invalid credentials")) {
        toast.error("كلمة المرور غير صحيحة");
      } else if (error instanceof Error && (error.message.includes("Invalid password") || error.message.includes("8"))) {
        toast.error(t('merchant.passwordMin8'));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || fullName.trim().length < 3) {
      toast.error(t('merchant.fullNameMin3'));
      setLoading(false);
      return;
    }

    if (!phone || phone.trim().length !== 11) {
      toast.error(t('merchant.phoneMin11'));
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(phone.trim())) {
      toast.error(t('merchant.phoneNumbersOnly'));
      setLoading(false);
      return;
    }

    if (!businessName || businessName.trim().length < 3) {
      toast.error(t('merchant.businessNameMin3'));
      setLoading(false);
      return;
    }

    if (!businessNameAr || businessNameAr.trim().length < 3) {
      toast.error(t('merchant.businessNameArMin3'));
      setLoading(false);
      return;
    }

    try {
      await createProfile({
        sessionToken,
        role: "merchant",
        fullName,
        phone,
        businessName,
        businessNameAr,
      });
      toast.success(t('merchant.profileCreated'));
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('merchant.profileCreateFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // صفحة تسجيل الدخول
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('merchant.loginTitle')}</h1>
            <p className="text-gray-600">{t('merchant.loginSubtitle')}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    placeholder="merchant@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? t('merchant.loggingIn') : t('merchant.login')}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = "/merchant/forgot-password"}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {t('forgotPassword.title')}
              </button>
            </div>

            {/* Switch to Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('auth.dontHaveAccount')}{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  {t('auth.createAccountTitle')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // صفحة إنشاء حساب
  if (mode === "signup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('merchant.signupTitle')}</h1>
            <p className="text-gray-600">{t('merchant.signupSubtitle')}</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    placeholder="merchant@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
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
                <p className="text-xs text-gray-500 mt-1 text-start">{t('merchant.passwordMin8Hint')}</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? t('merchant.creatingAccount') : t('merchant.createAccount')}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('auth.alreadyHaveAccount')}{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  {t('merchant.login')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // صفحة إكمال الملف الشخصي
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('merchant.completeProfile')}</h1>
          <p className="text-gray-600">{t('merchant.completeProfileSubtitle')}</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <form onSubmit={handleCreateProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder="أحمد محمد"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('auth.phoneNumber')}
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder={t('merchant.phonePlaceholder')}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-start">{t('merchant.phoneMin11Hint')}</p>
            </div>

            {/* Business Name (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('merchant.businessNameEn')}
              </label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder={t('merchant.businessNameEnPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Business Name (Arabic) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('merchant.businessNameAr')}
              </label>
              <div className="relative">
                <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessNameAr}
                  onChange={(e) => setBusinessNameAr(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder={t('merchant.businessNameArPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('merchant.saving') : t('merchant.completeRegistration')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
