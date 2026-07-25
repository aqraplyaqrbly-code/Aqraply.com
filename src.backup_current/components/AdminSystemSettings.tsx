import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  Users,
  Truck,
  Store,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Loader2, Wallet } from "lucide-react";
import { ALLOWED_SETTINGS_FIELDS } from "../lib/allowedSettingsFields";
import { useSystemSettings } from "../contexts/SystemSettingsContext";

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

export default function SystemSettings() {
  const { refreshSettings } = useSystemSettings();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Aqraply",
    siteNameAr: "أقربلي",
    siteDescription: "Online food delivery platform",
    siteDescriptionAr: "منصة توصيل طعام عبر الإنترنت",
    contactEmail: "support@aqraply.com",
    contactPhone: "+201234567890",
    supportEmail: "support@aqraply.com",
    supportPhone: "+201234567890",
    address: "القاهرة، مصر",
    addressAr: "القاهرة، مصر",
    currency: "EGP",
    currencySymbol: "ج.م",
    language: "ar",
    timezone: "Africa/Cairo",
    maintenanceMode: false,
    allowRegistration: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: false,
    requirePhoneVerification: false,
    commissionRate: 10,
    defaultCommissionRate: 10,
    captainCommissionRate: 15,
    storeApprovalRequired: true,
    captainApprovalRequired: true,
    autoAcceptOrders: false,
    orderTimeoutMinutes: 15,
    maxProductsPerStore: 100,
    enableReviews: true,
    enableRatings: true,
    enableNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    minOrderAmount: 50,
    freeDeliveryThreshold: 200,
    deliveryFee: 20,
    taxRate: 14,
    walletPhone: "01012345678",
    socialLinks: {
      facebook: "https://facebook.com/aqraply",
      twitter: "https://twitter.com/aqraply",
      instagram: "https://instagram.com/aqraply",
      linkedin: "https://linkedin.com/aqraply",
    },
    paymentMethods: {
      cash: true,
      card: true,
      wallet: true,
    },
    deliveryOptions: {
      standard: true,
      express: true,
      scheduled: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const systemSettings = useQuery(api.systemSettings.getSettings);
  const updateSettings = useMutation(api.systemSettings.updateSettings);
  const resetSettings = useMutation(api.adminExport.resetSystemSettings);

  // تحديث الإعدادات عند تحميلها من الخادم
  useEffect(() => {
    console.log('System settings from DB:', systemSettings);
    if (systemSettings) {
      // دمج الإعدادات من الخادم مع القيم الافتراضية لضمان عدم وجود قيم undefined
      setSettings(prev => ({
        ...prev,
        ...systemSettings,
      }));
    }
  }, [systemSettings]);

  // Warn user when leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      console.log('Current settings state:', settings);
      
      // تنظيف البيانات قبل الإرسال
      const { _id, _creationTime, ...cleanedSettings } = settings;
      
      // فلترة الحقول المسموح بها فقط
      const settingsToSave: any = {};
      Object.keys(cleanedSettings).forEach(key => {
        if (ALLOWED_SETTINGS_FIELDS.includes(key as any)) {
          (settingsToSave as any)[key] = (cleanedSettings as any)[key];
        }
      });
      
      console.log('Settings to save:', settingsToSave);
      const result = await updateSettings(settingsToSave);
      console.log('Settings saved successfully:', result);
      
      // Update last saved time and clear unsaved changes flag
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // تحديث الإعدادات فورًا في جميع أنحاء التطبيق
      refreshSettings();
      
      toast.success("تم حفظ الإعدادات بنجاح");
      
      // Show success feedback
      setTimeout(() => {
        toast("تم تطبيق الإعدادات على الموقع بنجاح");
      }, 1000);
      
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error(error instanceof Error ? error.message : "فشل حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings | string, value: any) => {
    setSettings(prev => {
      // Handle nested object paths like "socialLinks.facebook"
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value === undefined ? "" : value,
          },
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [field]: value === undefined ? "" : value,
      };
    });
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);
  };

  const handleResetSettings = async () => {
    if (!confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟")) return;
    
    setIsLoading(true);
    try {
      await resetSettings();
      
      // Clear unsaved changes flag
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      toast.success("تم إعادة تعيين الإعدادات بنجاح");
      
      // Reload settings after reset
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Reset settings error:', error);
      toast.error("فشل إعادة تعيين الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "عام", icon: <Globe className="w-4 h-4" /> },
    { id: "notifications", label: "الإشعارات", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "الأمان", icon: <Shield className="w-4 h-4" /> },
    { id: "payments", label: "المدفوعات", icon: <DollarSign className="w-4 h-4" /> },
    { id: "orders", label: "الطلبات", icon: <Package className="w-4 h-4" /> },
    { id: "users", label: "المستخدمون", icon: <Users className="w-4 h-4" /> },
    { id: "social", label: "التواصل الاجتماعي", icon: <Store className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إعدادات النظام</h1>
        <p className="text-gray-500 mt-1">إدارة إعدادات وتكوينات النظام</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموقع (إنجليزي)</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموقع (عربي)</label>
                  <input
                    type="text"
                    value={settings.siteNameAr}
                    onChange={(e) => handleInputChange("siteNameAr", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وصف الموقع (إنجليزي)</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وصف الموقع (عربي)</label>
                  <textarea
                    value={settings.siteDescriptionAr}
                    onChange={(e) => handleInputChange("siteDescriptionAr", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني للتواصل</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">هاتف التواصل</label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (إنجليزي)</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (عربي)</label>
                  <input
                    type="text"
                    value={settings.addressAr}
                    onChange={(e) => handleInputChange("addressAr", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العملة</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رمز العملة</label>
                  <input
                    type="text"
                    value={settings.currencySymbol}
                    onChange={(e) => handleInputChange("currencySymbol", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اللغة الافتراضية</label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) => handleInputChange("defaultLanguage", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">الإشعارات البريدية</p>
                      <p className="text-sm text-gray-500">إرسال الإشعارات عبر البريد الإلكتروني</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) => handleInputChange("enableEmailNotifications", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">الإشعارات Push</p>
                      <p className="text-sm text-gray-500">إرسال الإشعارات الفورية للتطبيق</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enablePushNotifications}
                    onChange={(e) => handleInputChange("enablePushNotifications", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">الإشعارات SMS</p>
                      <p className="text-sm text-gray-500">إرسال الإشعارات عبر الرسائل النصية</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableSMSNotifications}
                    onChange={(e) => handleInputChange("enableSMSNotifications", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الأمان</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">وضع الصيانة</p>
                      <p className="text-sm text-gray-500">إيقاف الموقع مؤقتاً للصيانة</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">السماح بالتسجيل</p>
                      <p className="text-sm text-gray-500">السماح للمستخدمين الجدد بالتسجيل</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleInputChange("allowRegistration", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">التحقق من البريد الإلكتروني</p>
                      <p className="text-sm text-gray-500">إجبار المستخدمين على التحقق من بريدهم</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleInputChange("requireEmailVerification", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">التحقق من الهاتف</p>
                      <p className="text-sm text-gray-500">إجبار المستخدمين على التحقق من هواتفهم</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requirePhoneVerification}
                    onChange={(e) => handleInputChange("requirePhoneVerification", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المدفوعات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأدنى للطلب</label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => handleInputChange("minOrderAmount", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للطلب</label>
                  <input
                    type="number"
                    value={settings.maxOrderAmount}
                    onChange={(e) => handleInputChange("maxOrderAmount", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رسوم التوصيل</label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => handleInputChange("deliveryFee", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حد التوصيل المجاني</label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => handleInputChange("freeDeliveryThreshold", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الضريبة (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange("taxRate", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleInputChange("commissionRate", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة عمولة الكابتن (%)</label>
                  <input
                    type="number"
                    value={settings.captainCommissionRate}
                    onChange={(e) => handleInputChange("captainCommissionRate", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Wallet Payment Settings */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">إعدادات المحفظة الإلكترونية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم المحفظة الإلكترونية</label>
                    <input
                      type="tel"
                      value={settings.walletPhone || ""}
                      onChange={(e) => handleInputChange("walletPhone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                      placeholder="01xxxxxxxxx"
                    />
                    <p className="text-xs text-gray-500 mt-1">رقم المحفظة لاستقبال تحويلات العملاء</p>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">تفعيل الدفع بالمحفظة</p>
                        <p className="text-sm text-gray-500">السماح للعملاء بالدفع عبر المحفظة الإلكترونية</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.paymentMethods?.wallet || false}
                      onChange={(e) => handleInputChange("paymentMethods.wallet", e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الطلبات</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">الموافقة على المتاجر مطلوبة</p>
                      <p className="text-sm text-gray-500">يتطلب موافقة المدير لتفعيل المتاجر الجديدة</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.storeApprovalRequired}
                    onChange={(e) => handleInputChange("storeApprovalRequired", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">الموافقة على الكباتن مطلوبة</p>
                      <p className="text-sm text-gray-500">يتطلب موافقة المدير لتفعيل الكباتن الجدد</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.captainApprovalRequired}
                    onChange={(e) => handleInputChange("captainApprovalRequired", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">قبول الطلبات تلقائياً</p>
                      <p className="text-sm text-gray-500">قبول الطلبات تلقائياً بدون موافقة يدوية</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoAcceptOrders}
                    onChange={(e) => handleInputChange("autoAcceptOrders", e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مهلة انتهاء الطلب (دقائق)</label>
                  <input
                    type="number"
                    value={settings.orderTimeoutMinutes}
                    onChange={(e) => handleInputChange("orderTimeoutMinutes", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للمنتجات للمتجر</label>
                  <input
                    type="number"
                    value={settings.maxProductsPerStore}
                    onChange={(e) => handleInputChange("maxProductsPerStore", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للمتاجر للتاجر</label>
                  <input
                    type="number"
                    value={settings.maxStoresPerMerchant}
                    onChange={(e) => handleInputChange("maxStoresPerMerchant", Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المستخدمين</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بريد الدعم الفني</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">هاتف الدعم الفني</label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">روابط التواصل الاجتماعي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط سياسة الخصوصية</label>
                  <input
                    type="url"
                    value={settings.privacyPolicyUrl}
                    onChange={(e) => handleInputChange("privacyPolicyUrl", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط شروط الخدمة</label>
                  <input
                    type="url"
                    value={settings.termsOfServiceUrl}
                    onChange={(e) => handleInputChange("termsOfServiceUrl", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط Facebook</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.facebook || ""}
                    onChange={(e) => handleInputChange("socialLinks.facebook", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط Twitter</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.twitter || ""}
                    onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط Instagram</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ""}
                    onChange={(e) => handleInputChange("socialLinks.instagram", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط LinkedIn</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.linkedin || ""}
                    onChange={(e) => handleInputChange("socialLinks.linkedin", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Save Button - Always visible */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetSettings}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                إعادة تعيين
              </button>
              
              {/* Status indicators */}
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                  <span className="text-sm">توجد تغييرات غير محفوظة</span>
                </div>
              )}
              
              {lastSaved && !hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">تم الحفظ: {lastSaved.toLocaleTimeString('ar-EG')}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSaveSettings}
              disabled={isLoading || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isLoading || !hasUnsavedChanges
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
