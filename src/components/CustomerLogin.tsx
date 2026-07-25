import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function CustomerLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { user, isAuthenticated } = useAuth();
  const userSignIn = useMutation(api.auth.userSignIn);
  
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // الحصول على redirect من URL أو location state
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = location.state?.from?.pathname || searchParams.get('redirect') || '/customer';

  // Guard to prevent duplicate redirects
  const hasRedirected = useRef(false);

  // إذا كان المستخدم مسجل دخول ولديه ملف شخصي، إعادة توجيهه - FIXED: Only redirect once
  useEffect(() => {
    if (isAuthenticated && user && user.profile && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user?._id, user?.profile, redirectTo]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // تسجيل الدخول فقط
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      } as any);
      toast.success(t('auth.loginSuccess'));
      navigate(redirectTo);
    } catch (error) {
      if (isMissingPasswordAccountError(error)) {
        toast.error("الحساب غير موجود. يرجى إنشاء حساب جديد.");
      } else if (error instanceof Error && error.message.includes("Invalid password")) {
        toast.error("كلمة المرور غير صحيحة.");
      } else {
        const message = error instanceof Error ? error.message : t('errors.somethingWentWrong');
        toast.error(message);
      }
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
            {t('auth.login')}
          </h2>
          <p className="text-gray-600">
            {t('auth.loginToContinue')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {t('auth.email')}
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
              {t('auth.password')}
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
            {isSubmitting ? t('auth.processing') : t('auth.login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Store the redirect path in state
              const state = { redirectTo: location.state?.from?.pathname || searchParams.get('redirect') || '/customer' };
              navigate('/customer/register', { state });
            }}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t('auth.dontHaveAccount')} {t('auth.signUpNow')}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/customer/forgot-password')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            {t('forgotPassword.title')}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/customer')}
            className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
          >
            {t('common.back')}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            🔐 {t('auth.loginToContinue')}
          </p>
        </div>
      </div>
    </div>
  );
}
