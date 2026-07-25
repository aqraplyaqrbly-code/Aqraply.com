import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Store, Mail, Lock, User, Phone, Building2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup" | "profile";

export default function MerchantAuth() {
  const navigate = useNavigate();
  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const createProfile = useMutation(api.profiles.createProfile);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInMutation({ email, password });
      if (result && result.sessionToken) {
        localStorage.setItem("sessionToken", result.sessionToken);
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/merchant");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل تسجيل الدخول";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpMutation({
        fullName,
        email,
        password,
        phone,
        role: "merchant",
      });
      if (result && result.sessionToken) {
        localStorage.setItem("sessionToken", result.sessionToken);
        toast.success("تم إنشاء الحساب! الآن أكمل بياناتك");
        setMode("profile");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل إنشاء الحساب";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProfile({
        role: "merchant",
        fullName,
        phone,
        businessName,
        businessNameAr,
      });
      toast.success("تم إنشاء ملفك الشخصي بنجاح! 🎉");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل إنشاء الملف الشخصي";
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل دخول التاجر</h1>
            <p className="text-gray-600">أدخل بياناتك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
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
                  كلمة المرور
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
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = "/merchant/forgot-password"}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Switch to Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  إنشاء حساب جديد
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب تاجر</h1>
            <p className="text-gray-600">انضم إلى منصة Aqraply وابدأ البيع</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
            <form onSubmit={handleSignup} className="space-y-6">
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
                  كلمة المرور
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
                <p className="text-xs text-gray-500 mt-1 text-start">يجب أن تكون 8 أحرف على الأقل</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  تسجيل الدخول
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">أكمل بياناتك</h1>
          <p className="text-gray-600">خطوة أخيرة لبدء استخدام المنصة</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <form onSubmit={handleCreateProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                الاسم الكامل
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
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder="05xxxxxxxx"
                  required
                />
              </div>
            </div>

            {/* Business Name (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                اسم المتجر (بالإنجليزية)
              </label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder="My Store"
                  required
                />
              </div>
            </div>

            {/* Business Name (Arabic) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                اسم المتجر (بالعربية)
              </label>
              <div className="relative">
                <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessNameAr}
                  onChange={(e) => setBusinessNameAr(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder="متجري"
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
              {loading ? "جاري الحفظ..." : "إكمال التسجيل"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
