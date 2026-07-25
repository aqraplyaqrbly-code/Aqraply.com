import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextNew';
import { toast } from 'sonner';

export default function UnifiedRegister() {
  const navigate = useNavigate();
  const { role: roleParam } = useParams<{ role?: string }>();
  const { signIn, signUp, createProfile, sessionToken } = useAuth();

  const [step, setStep] = useState<'role' | 'auth' | 'profile'>('role');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'merchant' | 'captain'>(
    (roleParam as any) || 'customer'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Auth form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Merchant specific
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeAddressAr, setStoreAddressAr] = useState('');

  // Captain specific
  const [nationalId, setNationalId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleRoleSelect = (role: 'customer' | 'merchant' | 'captain') => {
    setSelectedRole(role);
    setStep('auth');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up using custom auth
      const result = await signUp(email.trim().toLowerCase(), password);

      toast.success('تم إنشاء الحساب بنجاح');
      setStep('profile');
    } catch (error: any) {
      console.error('Auth error:', error);
      const message = error.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى';
      if (message.includes("Account already exists")) {
        // If account exists, try to sign in instead
        try {
          const signInResult = await signIn(email.trim().toLowerCase(), password);
          toast.success('تم تسجيل الدخول بنجاح');
          setStep('profile');
        } catch (signInError: any) {
          toast.error('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر', {
            duration: 5000,
            action: {
              label: 'تسجيل الدخول',
              onClick: () => navigate('/login'),
            },
          });
        }
      } else if (message.includes("Password must be at least 8 characters")) {
        toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);

    try {
      const profileData: any = {
        sessionToken,
        role: selectedRole,
        fullName,
        phone,
      };

      // Add role-specific data
      if (selectedRole === 'merchant') {
        profileData.storeName = storeName;
        profileData.storeNameAr = storeNameAr || storeName;
        profileData.storeAddress = {
          address: storeAddress,
          addressAr: storeAddressAr || storeAddress,
          latitude: 30.0444,
          longitude: 31.2357,
        };
      } else if (selectedRole === 'captain') {
        profileData.nationalId = nationalId;
        profileData.vehicleType = vehicleType;
        profileData.vehicleNumber = vehicleNumber;
      }

      await createProfile(profileData);

      toast.success('تم إنشاء الملف الشخصي بنجاح');

      // Redirect based on role
      switch (selectedRole) {
        case 'customer':
          navigate('/customer');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        case 'captain':
          navigate('/captain');
          break;
      }
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast.error(error.message || 'فشل إنشاء الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aqraply</h1>
            <p className="text-gray-600">
              {step === 'role' ? 'اختر نوع الحساب' : 
               step === 'auth' ? 'إنشاء حساب جديد' : 'إكمال الملف الشخصي'}
            </p>
          </div>

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('customer')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">عميل</h3>
                    <p className="text-sm text-gray-600">اطلب منتجاتك المفضلة</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('merchant')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">تاجر</h3>
                    <p className="text-sm text-gray-600">أنشئ متجرك وبيع منتجاتك</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('captain')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">كابتن</h3>
                    <p className="text-sm text-gray-600">سلم الطلبات واكسب المال</p>
                  </div>
                </div>
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  لديك حساب بالفعل؟{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Authentication */}
          {step === 'auth' && (
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'التالي'}
              </button>

              <button
                type="button"
                onClick={() => setStep('role')}
                className="w-full text-gray-600 hover:text-gray-700"
              >
                العودة
              </button>
            </form>
          )}

          {/* Step 3: Profile */}
          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>

              {/* Merchant specific fields */}
              {selectedRole === 'merchant' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المتجر
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="اسم المتجر"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المتجر (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={storeNameAr}
                      onChange={(e) => setStoreNameAr(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="اسم المتجر بالعربية"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان المتجر
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="عنوان المتجر"
                    />
                  </div>
                </>
              )}

              {/* Captain specific fields */}
              {selectedRole === 'captain' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرقم القومي
                    </label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="الرقم القومي"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع المركبة
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="">اختر نوع المركبة</option>
                      <option value="motorcycle">دراجة نارية</option>
                      <option value="car">سيارة</option>
                      <option value="bicycle">دراجة هوائية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم المركبة
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="رقم المركبة"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري إنشاء الملف الشخصي...' : 'إكمال التسجيل'}
              </button>

              <button
                type="button"
                onClick={() => setStep('auth')}
                className="w-full text-gray-600 hover:text-gray-700"
              >
                العودة
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
