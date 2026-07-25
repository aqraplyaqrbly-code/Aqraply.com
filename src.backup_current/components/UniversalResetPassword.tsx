import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Store, Truck, Crown, ShoppingBag } from "lucide-react";

export default function UniversalResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const verifyResetToken = useMutation(api.passwordReset.verifyResetToken);
  const resetPassword = useMutation(api.passwordReset.resetPassword);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Check password strength
  useEffect(() => {
    const strength = {
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
    setPasswordStrength(strength);
  }, [newPassword]);

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const result = await verifyResetToken({ token });
        if (result.valid) {
          setIsTokenValid(true);
          setUserRole(result.userRole || null);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      toast.error("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل مع حروف كبيرة وصغيرة وأرقام ورموز");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      setIsSuccess(true);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case "merchant":
        return { icon: Store, color: "orange", title: "التاجر" };
      case "captain":
        return { icon: Truck, color: "green", title: "الكابتن" };
      case "admin":
        return { icon: Crown, color: "purple", title: "المدير" };
      default:
        return { icon: ShoppingBag, color: "blue", title: "المستخدم" };
    }
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  // Loading state
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">جاري التحقق من الرمز...</h2>
        </div>
      </div>
    );
  }

  // Invalid token
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">رمز غير صالح</h2>
              <p className="text-gray-600 mb-6">
                هذا الرمز غير صالح أو منتهي الصلاحية. يرجى طلب رمز جديد.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                طلب رمز جديد
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تم بنجاح!</h2>
              <p className="text-gray-600 mb-6">
                تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
              </p>
              <button
                onClick={() => {
                  switch (userRole) {
                    case "merchant":
                      navigate("/merchant");
                      break;
                    case "captain":
                      navigate("/captain");
                      break;
                    case "admin":
                      navigate("/admin-login");
                      break;
                    default:
                      navigate("/login");
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                تسجيل الدخول
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-${roleInfo.color}-500 to-${roleInfo.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">
            {userRole ? `حساب ${roleInfo.title} - ` : ""}أدخل كلمة المرور الجديدة
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="أدخل كلمة المرور الجديدة"
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

              {/* Password Strength Indicators */}
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.hasMinLength ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full ${passwordStrength.hasMinLength ? "bg-green-600" : "bg-gray-300"}`}></div>
                  8 أحرف على الأقل
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full ${passwordStrength.hasUpperCase ? "bg-green-600" : "bg-gray-300"}`}></div>
                  حرف كبير (A-Z)
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.hasLowerCase ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full ${passwordStrength.hasLowerCase ? "bg-green-600" : "bg-gray-300"}`}></div>
                  حرف صغير (a-z)
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full ${passwordStrength.hasNumber ? "bg-green-600" : "bg-gray-300"}`}></div>
                  رقم (0-9)
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full ${passwordStrength.hasSpecialChar ? "bg-green-600" : "bg-gray-300"}`}></div>
                  رمز خاص (!@#$%)
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-2 text-sm text-red-600">كلمات المرور غير متطابقة</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword || !Object.values(passwordStrength).every(Boolean)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
