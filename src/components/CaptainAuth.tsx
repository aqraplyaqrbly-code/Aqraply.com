import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Truck, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextNew";
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhone,
  validateVehicleInfo,
  validateRequired,
} from "../utils/validation";

type AuthMode = "login" | "signup" | "profile";

export default function CaptainAuth() {
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

  // Login errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // بيانات الملف الشخصي
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // Profile errors
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [vehicleTypeError, setVehicleTypeError] = useState("");
  const [vehicleNumberError, setVehicleNumberError] = useState("");

  // Validation handlers for login
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const result = validateEmail(value);
    setEmailError(result.error);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const result = validatePassword(value, 8);
    setPasswordError(result.error);
  };

  const isLoginFormValid = () => {
    const emailValid = validateEmail(email).isValid;
    const passwordValid = validatePassword(password, 8).isValid;
    return emailValid && passwordValid;
  };

  // Validation handlers for profile
  const handleFullNameChange = (value: string) => {
    setFullName(value);
    const result = validateFullName(value);
    setFullNameError(result.error);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const result = validatePhone(value);
    setPhoneError(result.error);
  };

  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    const result = validateRequired(value, t('errors.vehicleTypeRequired'));
    setVehicleTypeError(result.error);
  };

  const handleVehicleNumberChange = (value: string) => {
    setVehicleNumber(value);
    const result = validateRequired(value, t('errors.vehicleNumberRequired'));
    setVehicleNumberError(result.error);
  };

  const isProfileFormValid = () => {
    const fullNameValid = validateFullName(fullName).isValid;
    const phoneValid = validatePhone(phone).isValid;
    const vehicleValid = validateVehicleInfo(vehicleType, vehicleNumber).isValid;
    return fullNameValid && phoneValid && vehicleValid;
  };

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

    // Validate all fields
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    const passwordResult = validatePassword(password, 8);
    setPasswordError(passwordResult.error);

    if (!isLoginFormValid()) {
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(t('captain.loginSuccess'));
      if (user && user.profile) {
        navigate("/captain");
      } else {
        setMode("profile");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('captain.loginFailed');
      if (message.includes("Invalid credentials")) {
        toast.error(t('captain.passwordMin8'));
      } else if (message.includes("Account already exists")) {
        toast.error(t('captain.accountNotFound'));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    const passwordResult = validatePassword(password, 8);
    setPasswordError(passwordResult.error);

    if (!isLoginFormValid()) {
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      toast.success(t('captain.accountCreatedProfile'));
      setMode("profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : t('captain.signupFailed');
      if (message.includes("Account already exists")) {
        toast.error(t('captain.accountNotFound'));
      } else if (message.includes("Invalid credentials")) {
        toast.error("كلمة المرور غير صحيحة");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    // Validate all fields
    const fullNameResult = validateFullName(fullName);
    setFullNameError(fullNameResult.error);

    const phoneResult = validatePhone(phone);
    setPhoneError(phoneResult.error);

    const vehicleResult = validateVehicleInfo(vehicleType, vehicleNumber);
    setVehicleTypeError(vehicleResult.error);
    setVehicleNumberError(vehicleResult.error);

    if (!isProfileFormValid()) {
      return;
    }

    setLoading(true);

    try {
      await createProfile({
        sessionToken,
        role: "captain",
        fullName,
        phone,
        vehicleType,
        vehicleNumber,
      });
      toast.success(t('captain.profileCreated'));
      toast.info("في انتظار الموافقة لرفع الحساب على الموقع", {
        duration: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('captain.profileCreateFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // صفحة تسجيل الدخول
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('captain.loginTitle')}</h1>
            <p className="text-gray-600">{t('captain.loginSubtitle')}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`w-full pe-10 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="captain@example.com"
                    dir="ltr"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 text-start">{emailError}</p>
                )}
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`w-full pe-10 ps-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                      passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1 text-start">{passwordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isLoginFormValid()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? t('captain.loggingIn') : t('captain.login')}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = "/captain/forgot-password"}
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
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('captain.signupTitle')}</h1>
            <p className="text-gray-600">{t('captain.signupSubtitle')}</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`w-full pe-10 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="captain@example.com"
                    dir="ltr"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 text-start">{emailError}</p>
                )}
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`w-full pe-10 ps-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                      passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1 text-start">{passwordError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1 text-start">{t('captain.passwordMin8Hint')}</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isLoginFormValid()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? t('captain.creatingAccount') : t('captain.createAccount')}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('auth.alreadyHaveAccount')}{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  {t('captain.login')}
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('captain.completeProfile')}</h1>
          <p className="text-gray-600">{t('captain.completeProfileSubtitle')}</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
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
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  className={`w-full pe-10 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                    fullNameError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="أحمد محمد"
                />
              </div>
              {fullNameError && (
                <p className="text-red-500 text-sm mt-1 text-start">{fullNameError}</p>
              )}
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pe-10 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                    phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder={t('captain.phonePlaceholder')}
                  dir="ltr"
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-sm mt-1 text-start">{phoneError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 text-start">{t('captain.phoneMin11Hint')}</p>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('captain.vehicleType')}
              </label>
              <select
                value={vehicleType}
                onChange={(e) => handleVehicleTypeChange(e.target.value)}
                className={`w-full pe-4 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  vehicleTypeError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              >
                <option value="">{t('captain.selectVehicleType')}</option>
                <option value="motorcycle">{t('captain.motorcycle')}</option>
                <option value="car">{t('captain.car')}</option>
                <option value="bicycle">{t('captain.bicycle')}</option>
                <option value="van">{t('captain.van')}</option>
              </select>
              {vehicleTypeError && (
                <p className="text-red-500 text-sm mt-1 text-start">{vehicleTypeError}</p>
              )}
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {t('captain.licensePlate')}
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => handleVehicleNumberChange(e.target.value)}
                className={`w-full pe-4 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  vehicleNumberError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
                placeholder={t('captain.vehicleNumberPlaceholder')}
              />
              {vehicleNumberError && (
                <p className="text-red-500 text-sm mt-1 text-start">{vehicleNumberError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isProfileFormValid()}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t('captain.saving') : t('captain.completeRegistration')}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
