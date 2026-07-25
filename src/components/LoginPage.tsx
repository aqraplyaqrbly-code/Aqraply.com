import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Store, Truck, ShoppingBag, Mail, Users, Crown } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useAuth, UserRole } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"merchant" | "captain" | "customer" | "admin" | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // التحقق من نوع الصفحة
  const isAdminLogin = location.pathname === '/admin-login';

  // Guard to prevent duplicate redirects
  const hasRedirected = useRef(false);

  // إعادة التوجيه إذا كان المستخدم مسجل دخول بالفعل - FIXED: Only redirect once
  useEffect(() => {
    if (!isLoading && isAuthenticated && role && !hasRedirected.current) {
      hasRedirected.current = true;
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, isLoading]);

  const getDefaultRoute = (userRole: string) => {
    switch (userRole) {
      case 'admin': return '/admin';
      case 'merchant': return '/merchant';
      case 'captain': return '/captain';
      case 'customer': return '/customer';
      default: return '/';
    }
  };

  const handleRoleSelect = (role: "merchant" | "captain" | "customer" | "admin") => {
    setSelectedRole(role);

    // التاجر والكابتن والمدير يحتاجون تسجيل دخول إلزامي
    if (role === "merchant" || role === "captain" || role === "admin") {
      setShowAuthForm(true);
    } else {
      // العميل يدخل مباشرة
      navigate("/customer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.verifying')}</p>
        </div>
      </div>
    );
  }

  if (showAuthForm && selectedRole && selectedRole !== "customer") {
    return <AuthForm role={selectedRole} onBack={() => setShowAuthForm(false)} t={t} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {isAdminLogin ? t('auth.adminLogin') : t('auth.welcomeToDeliveryPlatform')}
          </h1>
          <p className="text-xl text-gray-600">
            {isAdminLogin ? t('auth.adminLoginSubtitle') : t('auth.selectAccountType')}
          </p>
        </div>

        {isAdminLogin ? (
          /* واجهة تسجيل دخول المدير */
          <div className="max-w-md mx-auto">
            <button
              onClick={() => handleRoleSelect("admin")}
              className="w-full group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.admin')}</h3>
              <p className="text-gray-600 mb-4">
                {t('auth.adminDescription')}
              </p>
              <div className="inline-block px-6 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                {t('auth.loginRequired')}
              </div>
            </button>

            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
              >
                ← {t('auth.backToHome')}
              </button>
            </div>
          </div>
        ) : (
          /* واجهة تسجيل الدخول العامة */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* التاجر */}
          <button
            onClick={() => handleRoleSelect("merchant")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-orange-500"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.merchant')}</h3>
            <p className="text-gray-600 mb-4">
              {t('auth.merchantDescription')}
            </p>
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              {t('auth.loginRequired')}
            </div>
          </button>

          {/* الكابتن */}
          <button
            onClick={() => handleRoleSelect("captain")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.captain')}</h3>
            <p className="text-gray-600 mb-4">
              {t('auth.captainDescription')}
            </p>
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              {t('auth.loginRequired')}
            </div>
          </button>

          {/* العميل */}
          <button
            onClick={() => handleRoleSelect("customer")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.customer')}</h3>
            <p className="text-gray-600 mb-4">
              {t('auth.customerDescription')}
            </p>
            <div className="inline-block px-6 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
              {t('auth.directAccess')}
            </div>
          </button>
          </div>
        )}

        {!isAdminLogin && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>{t('auth.platformDescription')}</p>
            {/* رابط مخفي للمدير - في أسفل الصفحة */}
                      </div>
        )}
      </div>
    </div>
  );
}

function AuthForm({ role, onBack, t }: { role: "merchant" | "captain" | "admin"; onBack: () => void; t: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, sessionToken } = useAuth();
  const ensureAdminRole = useMutation(api.profiles.ensureAdminRole);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use custom auth signIn
      await signIn(email, password);

      // Admin verification runs once only after authentication is confirmed
      if (role === "admin") {
        const adminResult = await ensureAdminRole({ sessionToken: sessionToken || undefined });
        if (!adminResult.ok) {
          throw new Error(t('auth.unauthorizedAdmin'));
        }
      }

      toast.success(
        role === "admin" ? t('auth.adminLoginSuccess') : t('auth.loginSuccess'),
      );

      // FIXED: Use react-router navigate instead of window.location.href
      // FIXED: Remove setTimeout - redirect immediately
      const route =
        role === "admin"
          ? "/admin"
          : role === "merchant"
            ? "/merchant"
            : "/captain";
      navigate(route, { replace: true });
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Invalid credentials")) {
        toast.error(t('auth.wrongPassword'));
      } else if (error?.message?.includes("Password must be at least 8 characters")) {
        toast.error(t('auth.passwordMinLength'));
      } else if (error?.message?.includes("Account already exists")) {
        toast.error(t('auth.accountNotFound'));
      } else {
        toast.error(error?.message || t('auth.invalidCredentials'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roleInfo = {
    merchant: {
      title: t('auth.merchantLogin'),
      icon: Store,
      color: "orange",
    },
    captain: {
      title: t('auth.captainLogin'),
      icon: Truck,
      color: "blue",
    },
    admin: {
      title: t('auth.adminLoginTitle'),
      icon: Crown,
      color: "purple",
    },
  };

  const info = roleInfo[role];
  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← {t('auth.back')}
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-${info.color}-500 to-${info.color}-700 flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            {info.title}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {t('auth.loginToContinue')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">{t('auth.email')}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-right"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-right"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
