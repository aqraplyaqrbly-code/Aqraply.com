import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextNew';
import { toast } from 'sonner';
import { validateEmail, validatePassword } from '../utils/validation';
import { useTranslation } from 'react-i18next';

export default function UnifiedLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const from = location.state?.from?.pathname || '/';

  // Validation handlers
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const result = validateEmail(value);
    setEmailError(result.error);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const result = validatePassword(value);
    setPasswordError(result.error);
  };

  const isFormValid = () => {
    const emailValid = validateEmail(email).isValid;
    const passwordValid = validatePassword(password).isValid;
    return emailValid && passwordValid;
  };

  // Redirect based on role after successful login
  useEffect(() => {
    if (isAuthenticated && user?.profile) {
      switch (user.profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        case 'captain':
          navigate('/captain');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          navigate(from);
      }
    }
  }, [isAuthenticated, user, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    const passwordResult = validatePassword(password);
    setPasswordError(passwordResult.error);

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sign in using custom auth
      await signIn(email.trim().toLowerCase(), password);

      toast.success(t('auth.loginSuccess'));
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.message || t('errors.loginFailed');
      if (message.includes("Invalid credentials")) {
        toast.error(t('errors.wrongPassword'));
      } else if (message.includes("Account already exists")) {
        toast.error(t('errors.accountAlreadyExists'));
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/src/assets/logo.png" alt="Aqraply Logo" className="h-32 mx-auto mb-4" />
            <p className="text-gray-600">تسجيل الدخول</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
                dir="ltr"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                إنشاء حساب جديد
              </button>
            </p>
          </div>

          {/* Role-specific Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">
              أو سجل كـ:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/register/customer')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                عميل
              </button>
              <button
                onClick={() => navigate('/register/merchant')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                تاجر
              </button>
              <button
                onClick={() => navigate('/register/captain')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                كابتن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
