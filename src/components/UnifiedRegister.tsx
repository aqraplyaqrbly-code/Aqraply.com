import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextNew';
import { toast } from 'sonner';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validatePhone,
  validateBusinessName,
  validateVehicleInfo,
  validateRequired,
} from '../utils/validation';
import { useTranslation } from 'react-i18next';
import LocationMapPicker from './LocationMapPicker';

export default function UnifiedRegister() {
  const { t } = useTranslation();
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

  // Auth form errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Profile form errors
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Merchant specific
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeAddressAr, setStoreAddressAr] = useState('');
  const [storeLocation, setStoreLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 30.0444,
    longitude: 31.2357,
  });

  // Merchant errors
  const [storeNameError, setStoreNameError] = useState('');
  const [storeAddressError, setStoreAddressError] = useState('');

  // Captain specific
  const [nationalId, setNationalId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  // Captain errors
  const [nationalIdError, setNationalIdError] = useState('');
  const [vehicleTypeError, setVehicleTypeError] = useState('');
  const [vehicleNumberError, setVehicleNumberError] = useState('');

  const handleRoleSelect = (role: 'customer' | 'merchant' | 'captain') => {
    setSelectedRole(role);
    setStep('auth');
  };

  // Validation handlers for auth form
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const result = validateEmail(value);
    setEmailError(result.error);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const result = validatePassword(value, 8);
    setPasswordError(result.error);
    // Re-validate confirm password if it has a value
    if (confirmPassword) {
      const confirmResult = validateConfirmPassword(value, confirmPassword);
      setConfirmPasswordError(confirmResult.error);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const result = validateConfirmPassword(password, value);
    setConfirmPasswordError(result.error);
  };

  const isAuthFormValid = () => {
    const emailValid = validateEmail(email).isValid;
    const passwordValid = validatePassword(password, 8).isValid;
    const confirmPasswordValid = validateConfirmPassword(password, confirmPassword).isValid;
    return emailValid && passwordValid && confirmPasswordValid;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailResult = validateEmail(email);
    setEmailError(emailResult.error);

    const passwordResult = validatePassword(password, 8);
    setPasswordError(passwordResult.error);

    const confirmPasswordResult = validateConfirmPassword(password, confirmPassword);
    setConfirmPasswordError(confirmPasswordResult.error);

    if (!isAuthFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sign up using custom auth
      const result = await signUp(email.trim().toLowerCase(), password);

      toast.success(t('errors.accountCreated'));
      setStep('profile');
    } catch (error: any) {
      console.error('Auth error:', error);
      const message = error.message || t('errors.accountCreationFailed');
      if (message.includes("Account already exists")) {
        // If account exists, try to sign in instead
        try {
          const signInResult = await signIn(email.trim().toLowerCase(), password);
          toast.success(t('auth.loginSuccess'));
          setStep('profile');
        } catch (signInError: any) {
          toast.error(t('errors.emailAlreadyRegistered'), {
            duration: 5000,
            action: {
              label: t('errors.login'),
              onClick: () => navigate('/login'),
            },
          });
        }
      } else if (message.includes("Password must be at least 8 characters")) {
        toast.error(t('errors.passwordMin8'));
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validation handlers for profile form
  const handleFullNameChange = (value: string) => {
    setFullName(value);
    const result = validateFullName(value);
    setFullNameError(result.error);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const result = validatePhone(value);
    setPhoneError(result.error);
  };

  const handleStoreNameChange = (value: string) => {
    setStoreName(value);
    const result = validateBusinessName(value);
    setStoreNameError(result.error);
  };

  const handleStoreAddressChange = (value: string) => {
    setStoreAddress(value);
    const result = validateRequired(value, t('errors.storeAddressRequired'));
    setStoreAddressError(result.error);
  };

  const handleNationalIdChange = (value: string) => {
    setNationalId(value);
    const result = validateRequired(value, t('errors.nationalIdRequired'));
    setNationalIdError(result.error);
  };

  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    const result = validateRequired(value, t('errors.vehicleTypeRequired'));
    setVehicleTypeError(result.error);
  };

  const handleVehicleNumberChange = (value: string) => {
    setVehicleNumber(value);
    const result = validateRequired(value, t('errors.vehicleNumberRequired'));
    setVehicleNumberError(result.error);
  };

  const isProfileFormValid = () => {
    const fullNameValid = validateFullName(fullName).isValid;
    const phoneValid = validatePhone(phone).isValid;
    
    if (!fullNameValid || !phoneValid) {
      return false;
    }

    if (selectedRole === 'merchant') {
      const storeNameValid = validateBusinessName(storeName).isValid;
      const storeAddressValid = validateRequired(storeAddress, 'عنوان المتجر').isValid;
      if (!storeNameValid || !storeAddressValid) {
        return false;
      }
    }

    if (selectedRole === 'captain') {
      const nationalIdValid = validateRequired(nationalId, 'الرقم القومي').isValid;
      const vehicleValid = validateVehicleInfo(vehicleType, vehicleNumber).isValid;
      if (!nationalIdValid || !vehicleValid) {
        return false;
      }
    }

    return true;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    // Validate all fields
    const fullNameResult = validateFullName(fullName);
    setFullNameError(fullNameResult.error);

    const phoneResult = validatePhone(phone);
    setPhoneError(phoneResult.error);

    if (selectedRole === 'merchant') {
      const storeNameResult = validateBusinessName(storeName);
      setStoreNameError(storeNameResult.error);

      const storeAddressResult = validateRequired(storeAddress, 'عنوان المتجر');
      setStoreAddressError(storeAddressResult.error);
    }

    if (selectedRole === 'captain') {
      const nationalIdResult = validateRequired(nationalId, 'الرقم القومي');
      setNationalIdError(nationalIdResult.error);

      const vehicleResult = validateVehicleInfo(vehicleType, vehicleNumber);
      setVehicleTypeError(vehicleResult.error);
      setVehicleNumberError(vehicleResult.error);
    }

    if (!isProfileFormValid()) {
      return;
    }

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
          latitude: storeLocation.latitude,
          longitude: storeLocation.longitude,
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
            <img src="/logo.png" alt="Aqraply Logo" className="h-32 mx-auto mb-4" />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                    confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isAuthFormValid()}
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
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                    fullNameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="الاسم الكامل"
                />
                {fullNameError && (
                  <p className="text-red-500 text-sm mt-1">{fullNameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
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
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        storeNameError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="اسم المتجر"
                    />
                    {storeNameError && (
                      <p className="text-red-500 text-sm mt-1">{storeNameError}</p>
                    )}
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
                      onChange={(e) => handleStoreAddressChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        storeAddressError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="عنوان المتجر"
                    />
                    {storeAddressError && (
                      <p className="text-red-500 text-sm mt-1">{storeAddressError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تحديد موقع المتجر على الخريطة
                    </label>
                    <LocationMapPicker
                      onLocationChange={(lat, lng) => {
                        setStoreLocation({ latitude: lat, longitude: lng });
                      }}
                      initialPosition={{ lat: storeLocation.latitude, lng: storeLocation.longitude }}
                      className="mb-4"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يمكنك النقر على الخريطة أو سحب العلامة لتحديد موقع المتجر
                    </p>
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
                      onChange={(e) => handleNationalIdChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        nationalIdError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="الرقم القومي"
                      dir="ltr"
                    />
                    {nationalIdError && (
                      <p className="text-red-500 text-sm mt-1">{nationalIdError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع المركبة
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => handleVehicleTypeChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        vehicleTypeError ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">اختر نوع المركبة</option>
                      <option value="motorcycle">دراجة نارية</option>
                      <option value="car">سيارة</option>
                      <option value="bicycle">دراجة هوائية</option>
                    </select>
                    {vehicleTypeError && (
                      <p className="text-red-500 text-sm mt-1">{vehicleTypeError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم المركبة
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => handleVehicleNumberChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        vehicleNumberError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="رقم المركبة"
                    />
                    {vehicleNumberError && (
                      <p className="text-red-500 text-sm mt-1">{vehicleNumberError}</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading || !isProfileFormValid()}
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
