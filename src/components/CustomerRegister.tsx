import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, Phone, UserCircle, MapPin, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import CustomerLocationTracker from "./CustomerLocationTracker";
import { useTranslation } from "react-i18next";

export default function CustomerRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, sessionToken } = useAuth();
  const { user, isAuthenticated } = useAuth();
  const createProfile = useMutation(api.profiles.createProfile);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<any>(null);

  // Get redirect path from location state
  const redirectTo = location.state?.redirectTo || '/customer';

  // Guard to prevent duplicate redirects
  const hasRedirected = useRef(false);

  // If user is already logged in with profile, redirect - FIXED: Only redirect once
  useEffect(() => {
    if (isAuthenticated && user && user.profile && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user?._id, user?.profile, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      // Sign up the user using custom auth
      const emailToUse = email || `${phone}@delivery.local`;
      const result = await signUp(emailToUse, password);

      // Wait for auth to be established
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create user profile with the sessionToken from signUp result
      await createProfile({
        sessionToken: result.sessionToken,
        role: 'customer',
        fullName: name,
        phone: phone || '',
      });
      toast.success(t('auth.loginSuccess'));
      navigate(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.somethingWentWrong');
      if (message.includes("Account already exists")) {
        toast.error("الحساب موجود بالفعل. يرجى تسجيل الدخول.");
      } else if (message.includes("Invalid credentials") || message.includes("Password")) {
        toast.error("كلمة المرور غير صحيحة.");
      } else {
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
            {t('auth.createAccountTitle')}
          </h2>
          <p className="text-gray-600">
            {t('auth.continueToAccount')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {t('auth.fullName')}
            </label>
            <div className="relative">
              <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder={t('auth.enterFullName')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {t('auth.phoneNumber')}
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
              {t('auth.emailAddress')}
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder={t('auth.emailOptional')}
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
            <p className="text-xs text-gray-500 mt-1 text-start">
              {t('auth.passwordMin6')}
            </p>
          </div>

          {/* Location Tracker */}
          <div className="mt-4">
            <CustomerLocationTracker 
              onLocationUpdate={(location) => {
                setCustomerLocation(location);
                console.log('Customer location during registration:', location);
              }}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('auth.processing') : t('auth.createAccountBtn')}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 text-center">
            ✅ {t('auth.accountBenefits')}
          </p>
          {customerLocation && (
            <p className="text-xs text-green-700 text-center mt-2">
              📍 {t('auth.locationDetected')}: {customerLocation.address || t('auth.locationDetectedValue')}
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/customer/login', { state: { redirectTo } })}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t('auth.haveAccount')}
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
      </div>
    </div>
  );
}
