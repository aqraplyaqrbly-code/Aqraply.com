import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ShoppingBag, Mail, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function CustomerForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  const requestPasswordReset = useMutation(api.passwordReset.requestPasswordReset);

  // توليد كلمة مرور عشوائية قوية
  const generateSecurePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()';
    
    let password = '';
    // 3 أحرف كبيرة
    for (let i = 0; i < 3; i++) {
      password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    }
    // 3 أحرف صغيرة
    for (let i = 0; i < 3; i++) {
      password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    }
    // رقمين
    for (let i = 0; i < 2; i++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    // رمزين
    for (let i = 0; i < 2; i++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    
    // خلط الحروف
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setGeneratedPassword(password);
    setShowPassword(true);
    toast.success("تم توليد كلمة مرور قوية!");
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("تم نسخ كلمة المرور!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setLoading(true);
    try {
      // Always show success message to prevent user enumeration
      await requestPasswordReset({ email });
      setIsSuccess(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (error) {
      // Still show success message even if email doesn't exist
      setIsSuccess(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h2>
              <p className="text-gray-600 mb-6">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </p>
              <p className="text-sm text-gray-500 mb-8">
                لم تستلم البريد؟ تحقق في مجلد الرسائل غير المرغوب فيها
              </p>
              <button
                onClick={() => navigate("/customer")}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                العودة للرئيسية
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">لا تقلق، سنساعدك في استعادة حسابك</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          {/* Password Generator Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">أو استخدم كلمة مرور مؤقتة</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              قم بتوليد كلمة مرور قوية مؤقتة واستخدمها للوصول إلى حسابك
            </p>
            
            <button
              onClick={generateSecurePassword}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
            >
              توليد كلمة مرور قوية
            </button>

            {generatedPassword && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">كلمة المرور المؤقتة:</label>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={generatedPassword}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                    dir="ltr"
                  />
                  <button
                    onClick={copyPassword}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    نسخ
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 احفظ هذه الكلمة في مكان آمن وقم بتغييرها لاحقاً
                </p>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/customer")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
