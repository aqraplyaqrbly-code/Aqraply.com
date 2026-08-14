import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { LayoutDashboard, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextNew";
import { validateEmail, validatePassword } from "../utils/validation";
import { useTranslation } from "react-i18next";

export default function AdminAuth() {
  const { t } = useTranslation();
  const { signIn, sessionToken } = useAuth();
  const ensureAdminRole = useMutation(api.profiles.ensureAdminRole);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("markezzat39@gmail.com");
  const [password, setPassword] = useState("");

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validation handlers
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

  const isFormValid = () => {
    const emailValid = validateEmail(email).isValid;
    const passwordValid = validatePassword(password, 8).isValid;
    return emailValid && passwordValid;
  };

  // Ref لتتبع ما إذا تم بالفعل إنشاء الملف الشخصي
  const hasCreatedProfile = useRef(false);

  // التحقق من حالة المستخدم
  useEffect(() => {
    if (isAuthenticated && user && !user.profile && !loading && !hasCreatedProfile.current) {
      // إذا كان المستخدم مسجل دخول ولكن ليس لديه ملف شخصي
      // يمكن إنشاء ملف شخصي تلقائي للمدير
      handleCreateAdminProfile();
      hasCreatedProfile.current = true;
    }
    // إعادة تعيين الـ ref إذا لم يكن المستخدم مسجلاً
    if (!isAuthenticated || !user) {
      hasCreatedProfile.current = false;
    }
  }, [isAuthenticated, user?._id, user?.profile, loading]);

  const handleCreateAdminProfile = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await ensureAdminRole({ ...(sessionToken && { sessionToken }) });
      if (result.ok) {
        toast.success(t('errors.adminProfileCreated'));
        // FIXED: Use navigate instead of window.location.reload()
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error("Error creating admin profile:", error);
      toast.error(t('errors.adminProfileFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    const passwordResult = validatePassword(password, 8);
    setPasswordError(passwordResult.error);

    if (!isFormValid()) {
      return;
    }

    setLoading(true);

    try {
      // Use custom auth signIn
      await signIn(email, password);

      // Admin verification runs once only after authentication is confirmed
      const adminResult = await ensureAdminRole({ ...(sessionToken && { sessionToken }) });
      if (!adminResult.ok) {
        throw new Error("هذا البريد غير مصرح له بدخول لوحة المدير");
      }
      toast.success("تم تسجيل الدخول بنجاح!");

      // FIXED: Use react-router navigate instead of window.location.href
      navigate("/admin", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid credentials")) {
          toast.error("كلمة المرور غير صحيحة");
        } else if (error.message.includes("Account already exists")) {
          toast.error("هذا الحساب موجود بالفعل، يرجى تسجيل الدخول بدلاً من إنشاء حساب جديد");
        } else if (error.message.includes("Password must be at least 8 characters")) {
          toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
        } else {
          toast.error(error.message || "فشل تسجيل الدخول");
        }
      } else {
        toast.error("فشل تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل دخول المدير</h1>
          <p className="text-gray-600">أدخل بياناتك للوصول إلى لوحة الإدارة</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full pe-10 ps-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-200 transition-all outline-none ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="markezzat39@gmail.com"
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
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full pe-10 ps-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-200 transition-all outline-none ${
                    passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
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
              disabled={loading || !isFormValid()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/admin/forgot-password"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
