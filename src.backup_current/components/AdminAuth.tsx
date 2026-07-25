import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { LayoutDashboard, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAuth() {
  const navigate = useNavigate();
  const signInMutation = useMutation(api.auth.signIn);
  const createProfile = useMutation(api.profiles.createProfile);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInMutation({ email, password });
      if (result && result.sessionToken) {
        localStorage.setItem("sessionToken", result.sessionToken);
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/admin");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل تسجيل الدخول";
      toast.error(message);
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="admin@example.com"
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
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
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
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.href = "/admin/forgot-password"}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          {/* Admin Info */}
          <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-700 text-center">
              <strong>ملاحظة:</strong> هذه الصفحة مخصصة للمديرين فقط. 
              إذا كنت تاجر أو كابتن، يرجى استخدام صفحة تسجيل الدخول المخصصة لك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
