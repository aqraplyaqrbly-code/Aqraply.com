import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { User, Mail, Lock, Phone, UserCircle } from "lucide-react";
import RegistrationControl from "./RegistrationControl";
import EmailVerificationControl from "./EmailVerificationControl";
import PhoneVerificationControl from "./PhoneVerificationControl";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const createProfile = useMutation(api.profiles.createProfile);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // الحصول على redirect من URL أو location state
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = location.state?.from?.pathname || searchParams.get('redirect') || '/customer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // إنشاء حساب جديد
        const result = await signUpMutation({
          fullName: name || 'عميل جديد',
          email: email || `${phone}@delivery.local`,
          password,
          phone: phone || '0000000000',
          role: 'customer',
        });
        
        if (result && result.sessionToken) {
          localStorage.setItem("sessionToken", result.sessionToken);
          
          // إنشاء ملف شخصي
          try {
            await createProfile({
              role: 'customer',
              fullName: name || 'عميل جديد',
              phone: phone || '0000000000',
            });
          } catch (error) {
            console.error('Error creating profile:', error);
            // لا نعطل العملية إذا فشل إنشاء الملف
          }
          
          toast.success('تم إنشاء الحساب بنجاح!');
          navigate(redirectTo);
        }
      } else {
        // تسجيل الدخول
        const result = await signInMutation({
          email,
          password,
        });
        
        if (result && result.sessionToken) {
          localStorage.setItem("sessionToken", result.sessionToken);
          toast.success('تم تسجيل الدخول بنجاح!');
          navigate(redirectTo);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ';
      toast.error(message);
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'أنشئ حسابك للمتابعة' : 'سجل دخولك لإتمام الطلب'}
          </p>
        </div>

        {isSignUp ? (
          <RegistrationControl>
            <EmailVerificationControl showMessage={true}>
              <PhoneVerificationControl showMessage={true}>
                <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-start">
                  يجب أن تكون كلمة المرور 6 أحرف على الأقل
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري المعالجة...' : 'إنشاء الحساب'}
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                ✅ بإنشاء حساب، ستتمكن من تتبع طلباتك وحفظ عناوينك المفضلة
              </p>
            </div>
            </PhoneVerificationControl>
            </EmailVerificationControl>
          </RegistrationControl>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري المعالجة...' : 'تسجيل الدخول'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/customer/forgot-password')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/customer')}
            className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            🔐 سجل دخولك لإتمام طلباتك وتتبعها
          </p>
        </div>
      </div>
    </div>
  );
}
