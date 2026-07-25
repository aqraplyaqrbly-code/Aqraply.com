import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Store, Truck, ShoppingBag, Mail, Users, Crown } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"merchant" | "captain" | "customer" | "admin" | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // التحقق من نوع الصفحة
  const isAdminLogin = location.pathname === '/admin-login';

  // إعادة التوجيه إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, isLoading, navigate, location]);

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
          <p className="text-gray-600">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (showAuthForm && selectedRole && selectedRole !== "customer") {
    return <AuthForm role={selectedRole} onBack={() => setShowAuthForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {isAdminLogin ? "دخول نظام الإدارة" : "مرحباً بك في منصة التوصيل"}
          </h1>
          <p className="text-xl text-gray-600">
            {isAdminLogin ? "تسجيل دخول المدير" : "اختر نوع حسابك للمتابعة"}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">المدير</h3>
              <p className="text-gray-600 mb-4">
                إدارة النظام والمستخدمين
              </p>
              <div className="inline-block px-6 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                تسجيل دخول مطلوب
              </div>
            </button>

            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
              >
                ← العودة للصفحة الرئيسية
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">التاجر</h3>
            <p className="text-gray-600 mb-4">
              أدر متجرك ومنتجاتك وطلباتك
            </p>
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              تسجيل دخول مطلوب
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">الكابتن</h3>
            <p className="text-gray-600 mb-4">
              استلم الطلبات وابدأ التوصيل
            </p>
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              تسجيل دخول مطلوب
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">العميل</h3>
            <p className="text-gray-600 mb-4">
              تصفح المتاجر واطلب ما تريد
            </p>
            <div className="inline-block px-6 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
              دخول مباشر
            </div>
          </button>
          </div>
        )}

        {!isAdminLogin && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>منصة توصيل شاملة تربط التجار والكابتنز والعملاء</p>
            {/* رابط مخفي للمدير - في أسفل الصفحة */}
                      </div>
        )}
      </div>
    </div>
  );
}

function AuthForm({ role, onBack }: { role: "merchant" | "captain" | "admin"; onBack: () => void }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const signUpMutation = useMutation(api.auth.signUp);
  const signInMutation = useMutation(api.auth.signIn);

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    if (isSignUp && !formData.fullName) {
      toast.error("الرجاء إدخال الاسم الكامل");
      return;
    }

    if (isSignUp && !formData.phone) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // التسجيل
        const result = await signUpMutation({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: role as "merchant" | "captain" | "admin",
        });
        
        if (result && result.sessionToken) {
          // حفظ الجلسة
          localStorage.setItem("sessionToken", result.sessionToken);
          toast.success("تم إنشاء الحساب بنجاح");
          navigate(role === "merchant" ? "/merchant" : role === "captain" ? "/captain" : "/admin");
        }
      } else {
        // تسجيل الدخول
        const result = await signInMutation({
          email: formData.email,
          password: formData.password,
        });
        
        if (result && result.sessionToken) {
          // حفظ الجلسة
          localStorage.setItem("sessionToken", result.sessionToken);
          toast.success("تم تسجيل الدخول بنجاح");
          
          // التوجيه بناءً على الدور
          const userRole = result.user?.role || role;
          const route = userRole === "merchant" ? "/merchant" : userRole === "captain" ? "/captain" : "/admin";
          navigate(route);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const errorMessage = error?.message || (isSignUp ? "فشل في إنشاء الحساب" : "فشل في تسجيل الدخول");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuth();
  };

  const roleInfo = {
    merchant: {
      title: "تسجيل دخول التاجر",
      icon: Store,
      color: "orange",
    },
    captain: {
      title: "تسجيل دخول الكابتن",
      icon: Truck,
      color: "blue",
    },
    admin: {
      title: "تسجيل دخول المدير",
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
          ← العودة
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-${info.color}-500 to-${info.color}-700 flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            {isSignUp ? "إنشاء حساب جديد" : info.title}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {isSignUp ? "املأ البيانات للتسجيل" : "سجل دخولك للمتابعة"}
          </p>

          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="966501234567"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isSignUp && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              {isSignUp ? "لديك حساب؟ سجل دخولك" : "ليس لديك حساب؟ سجل الآن"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
