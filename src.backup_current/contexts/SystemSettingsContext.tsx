import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface SystemSettings {
  _id?: string;
  _creationTime?: number;
  siteName?: string;
  siteNameAr?: string;
  siteDescription?: string;
  siteDescriptionAr?: string;
  contactEmail?: string;
  contactPhone?: string;
  supportEmail?: string;
  supportPhone?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  address?: string;
  addressAr?: string;
  currency?: string;
  currencySymbol?: string;
  language?: string;
  timezone?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  emailVerificationRequired?: boolean;
  phoneVerificationRequired?: boolean;
  requirePhoneVerification?: boolean;
  commissionRate?: number;
  defaultCommissionRate?: number;
  captainCommissionRate?: number;
  storeApprovalRequired?: boolean;
  captainApprovalRequired?: boolean;
  autoAcceptOrders?: boolean;
  orderTimeoutMinutes?: number;
  maxProductsPerStore?: number;
  enableReviews?: boolean;
  enableRatings?: boolean;
  enableNotifications?: boolean;
  enableEmailNotifications?: boolean;
  enableSMSNotifications?: boolean;
  enablePushNotifications?: boolean;
  minOrderAmount?: number;
  freeDeliveryThreshold?: number;
  deliveryFee?: number;
  taxRate?: number;
  walletPhone?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  paymentMethods?: {
    cash?: boolean;
    card?: boolean;
    wallet?: boolean;
  };
  deliveryOptions?: {
    standard?: boolean;
    express?: boolean;
    scheduled?: boolean;
  };
}

interface SystemSettingsContextType {
  settings: SystemSettings | null;
  isLoading: boolean;
  updateSetting: (key: keyof SystemSettings, value: any) => void;
  refreshSettings: () => void;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // جلب الإعدادات من Convex
  const systemSettings = useQuery(api.systemSettings.getSettings);

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
      setIsLoading(false);
      
      // تطبيق الإعدادات على المستوى العالمي
      applyGlobalSettings(systemSettings);
    }
  }, [systemSettings]);

  // تطبيق الإعدادات على المستوى العالمي
  const applyGlobalSettings = (settings: SystemSettings) => {
    // تحديث عنوان الصفحة
    if (settings.siteName) {
      document.title = settings.siteName;
    }
    
    // تحديث لغة الصفحة
    if (settings.language) {
      document.documentElement.lang = settings.language;
    }
    
    // تحديث الوصف
    if (settings.siteDescription) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.siteDescription);
      }
    }
    
    // تطبيق إعدادات الأمان
    if (settings.maintenanceMode !== undefined) {
      document.body.setAttribute('data-maintenance', settings.maintenanceMode.toString());
    }
    
    // تطبيق إعدادات التسجيل
    if (settings.allowRegistration !== undefined) {
      document.body.setAttribute('data-allow-registration', settings.allowRegistration.toString());
    }
    
    // تطبيق إعدادات العملة
    if (settings.currency) {
      document.body.setAttribute('data-currency', settings.currency);
    }
    
    // إرسال حدث مخصص لتحديث المكونات الأخرى
    window.dispatchEvent(new CustomEvent('systemSettingsUpdated', { 
      detail: settings 
    }));
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    if (settings) {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      applyGlobalSettings(updatedSettings);
    }
  };

  const refreshSettings = () => {
    setIsLoading(true);
    // سيتم تحديث الإعدادات تلقائيًا عبر useQuery
  };

  return (
    <SystemSettingsContext.Provider value={{
      settings,
      isLoading,
      updateSetting,
      refreshSettings
    }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}

export default SystemSettingsContext;
