import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Store, Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function MerchantForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const requestPasswordReset = useMutation(api.passwordReset.requestPasswordReset);

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
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
                onClick={() => navigate("/merchant")}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                العودة لتسجيل الدخول
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">لا تقلق، سنرسل لك رابط إعادة تعيين كلمة المرور</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
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
                  className="w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  placeholder="أدخل بريدك الإلكتروني"
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
              {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/merchant")}
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
