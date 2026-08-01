export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Phone validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'رقم الهاتف مطلوب' };
  }
  
  const phoneStr = phone.replace(/\s/g, '');
  
  if (phoneStr.length !== 11) {
    return { isValid: false, error: 'رقم الهاتف يجب أن يتكون من 11 رقمًا' };
  }
  
  const validPrefixes = ['010', '011', '012', '015'];
  const prefix = phoneStr.substring(0, 3);
  
  if (!validPrefixes.includes(prefix)) {
    return { isValid: false, error: 'رقم الهاتف غير صحيح' };
  }
  
  return { isValid: true, error: '' };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: true, error: '' }; // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'البريد الإلكتروني غير صحيح' };
  }
  
  return { isValid: true, error: '' };
};

// Password validation
export const validatePassword = (password: string, minLength: number = 6): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'كلمة المرور مطلوبة' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `كلمة المرور يجب ألا تقل عن ${minLength} أحرف` };
  }
  
  return { isValid: true, error: '' };
};

// Full name validation
export const validateFullName = (name: string, minLength: number = 3): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'الاسم بالكامل مطلوب' };
  }
  
  if (name.trim().length < minLength) {
    return { isValid: false, error: `الاسم يجب ألا يقل عن ${minLength} أحرف` };
  }
  
  return { isValid: true, error: '' };
};

// Business name validation
export const validateBusinessName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'اسم المتجر مطلوب' };
  }
  
  return { isValid: true, error: '' };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'تأكيد كلمة المرور مطلوب' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'كلمتا المرور غير متطابقتين' };
  }
  
  return { isValid: true, error: '' };
};

// Generic required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} مطلوب` };
  }
  
  return { isValid: true, error: '' };
};

// Vehicle validation for captains
export const validateVehicleInfo = (vehicleType: string, vehiclePlate: string): ValidationResult => {
  if (!vehicleType || vehicleType.trim() === '') {
    return { isValid: false, error: 'نوع المركبة مطلوب' };
  }
  
  if (!vehiclePlate || vehiclePlate.trim() === '') {
    return { isValid: false, error: 'رقم اللوحة مطلوب' };
  }
  
  return { isValid: true, error: '' };
};
