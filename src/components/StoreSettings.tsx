import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Clock,
  Package,
  Image as ImageIcon,
  Save,
  Plus,
  Edit,
  Power,
  Eye,
  Phone
} from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function StoreSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken, isAuthenticated } = useAuth();
  const myStores = useQuery(api.stores.getMyStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (myStores && myStores.length > 0 && !selectedStore) {
      setSelectedStore(myStores[0]);
    }
  }, [myStores?.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/merchant')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{t('errors.storeSettings')}</h1>
                <p className="text-xs text-gray-500">{t('errors.manageStoreInfo')}</p>
              </div>
            </div>

            {myStores && myStores.length > 0 && (
              <div className="flex items-center gap-3">
                <select
                  value={selectedStore?._id || ""}
                  onChange={(e) => {
                    const store = myStores.find(s => s._id === e.target.value);
                    setSelectedStore(store);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {myStores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.nameAr}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('errors.newStore')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {myStores === undefined ? (
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : myStores.length === 0 || showCreateForm ? (
          <StoreForm 
            sessionToken={sessionToken}
            onClose={() => setShowCreateForm(false)} 
            onSuccess={() => {
              setShowCreateForm(false);
            }}
          />
        ) : selectedStore ? (
          <StoreForm 
            sessionToken={sessionToken}
            store={selectedStore}
            onClose={() => navigate('/merchant')}
            onSuccess={() => {
              toast.success("تم تحديث المتجر بنجاح!");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function StoreForm({ store, onClose, onSuccess, sessionToken }: { store?: any; onClose: () => void; onSuccess: () => void; sessionToken?: string | null }) {
  const [formData, setFormData] = useState({
    name: store?.name || "",
    nameAr: store?.nameAr || "",
    description: store?.description || "",
    descriptionAr: store?.descriptionAr || "",
    category: store?.category || "",
    address: store?.location?.address || "",
    addressAr: store?.location?.addressAr || "",
    latitude: store?.location?.latitude?.toString() || "30.0444",
    longitude: store?.location?.longitude?.toString() || "31.2357",
    deliveryFee: store?.deliveryFee?.toString() || "15",
    minOrderAmount: store?.minOrderAmount?.toString() || "50",
    estimatedDeliveryTime: store?.estimatedDeliveryTime?.toString() || "30",
    phone: store?.phone || "",
  });

  const [imageSource, setImageSource] = useState<string>(store?.imageId || store?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const resolvedImageUrl = useQuery(
    api.files.getFileUrl,
    imageSource ? { storageId: imageSource } : "skip"
  );
  const displayImageUrl = resolvedImageUrl || (imageSource.startsWith("http://") || imageSource.startsWith("https://") ? imageSource : undefined);

  const createStore = useMutation(api.stores.createStore);
  const updateStore = useMutation(api.stores.updateStore);
  const generateUploadUrl = useMutation(api.stores.generateUploadUrl);

  // الحصول على الموقع الحالي
  useEffect(() => {
    if (!store && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.log("لم يتم الحصول على الموقع:", error);
        }
      );
    }
  }, [store]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error("يرجى رفع صورة بصيغة JPG أو PNG فقط");
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({ sessionToken });
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("فشل رفع الصورة");
      }

      const { storageId } = await result.json();
      setImageSource(storageId);
      toast.success("تم رفع الصورة بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageSource) {
      toast.error("يجب إضافة صورة للمتجر");
      return;
    }

    try {
      const isDirectUrl = imageSource.startsWith("http://") || imageSource.startsWith("https://");
      
      const storeData = {
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        category: formData.category,
        imageUrl: isDirectUrl ? imageSource : undefined,
        imageId: isDirectUrl ? undefined : imageSource,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address,
        addressAr: formData.addressAr,
        deliveryFee: parseFloat(formData.deliveryFee),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        estimatedDeliveryTime: parseInt(formData.estimatedDeliveryTime),
        phone: formData.phone,
      };

      if (store) {
        await updateStore({ sessionToken, storeId: store._id, ...storeData });
        toast.success("تم تحديث المتجر بنجاح!");
      } else {
        await createStore({ sessionToken, ...storeData });
        toast.success("تم إنشاء المتجر بنجاح!");
      }
      
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <Store className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">
              {store ? "تعديل المتجر" : "إنشاء متجر جديد"}
            </h2>
            <p className="text-orange-100 text-sm">
              {store ? "قم بتحديث معلومات متجرك" : "ابدأ رحلتك في البيع الإلكتروني"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* رفع صورة المتجر */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 text-start">
            <ImageIcon className="w-4 h-4 inline-block me-2" />
            صورة المتجر (JPG, JPEG, PNG)
          </label>
          
          <div className="flex items-center gap-4">
            {displayImageUrl ? (
              <div className="relative group">
                <img 
                  src={displayImageUrl} 
                  alt="صورة المتجر" 
                  className="w-32 h-32 object-cover rounded-xl border-2 border-orange-200"
                />
                <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">رفع صورة</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {uploading ? "جاري رفع الصورة..." : "اختر صورة واضحة لمتجرك"}
              </p>
              <p className="text-xs text-gray-500">
                الصيغ المدعومة: JPG, JPEG, PNG (حد أقصى 5 ميجابايت)
              </p>
            </div>
          </div>
        </div>

        {/* معلومات المتجر الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              اسم المتجر بالعربية
            </label>
            <input
              type="text"
              required
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="مثال: مطعم البرجر الذهبي"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              Store Name (English)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Example: Golden Burger Restaurant"
            />
          </div>
        </div>

        {/* الوصف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              الوصف بالعربية
            </label>
            <textarea
              required
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              rows={3}
              placeholder="وصف مختصر عن متجرك..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              Description (English)
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              rows={3}
              placeholder="Brief description of your store..."
            />
          </div>
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
            <Package className="w-4 h-4 inline-block me-2" />
            فئة المتجر
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            <option value="">اختر الفئة</option>
            <option value="مطاعم">مطاعم</option>
            <option value="كافيهات">كافيهات</option>
            <option value="سوبر ماركت">سوبر ماركت</option>
            <option value="مخابز">مخابز</option>
            <option value="حلويات">حلويات</option>
            <option value="جزارة">جزارة</option>
            <option value="خضار وفاكهة">خضار وفاكهة</option>
            <option value="صيدليات">صيدليات</option>
            <option value="مستحضرات تجميل">مستحضرات تجميل</option>
            <option value="عطور">عطور</option>
            <option value="ملابس">ملابس</option>
            <option value="أحذية وشنط">أحذية وشنط</option>
            <option value="إلكترونيات">إلكترونيات</option>
            <option value="موبايلات">موبايلات</option>
            <option value="كمبيوتر ولابتوب">كمبيوتر ولابتوب</option>
            <option value="أجهزة منزلية">أجهزة منزلية</option>
            <option value="أثاث">أثاث</option>
            <option value="مفروشات">مفروشات</option>
            <option value="مكتبات">مكتبات</option>
            <option value="ألعاب أطفال">ألعاب أطفال</option>
            <option value="رياضة">رياضة</option>
            <option value="مراكز صيانة">مراكز صيانة</option>
            <option value="خدمات سيارات">خدمات سيارات</option>
            <option value="مغاسل">مغاسل</option>
            <option value="حلاقة وتجميل">حلاقة وتجميل</option>
            <option value="جيم ولياقة">جيم ولياقة</option>
            <option value="مراكز تعليم">مراكز تعليم</option>
            <option value="عيادات">عيادات</option>
            <option value="معامل تحاليل">معامل تحاليل</option>
            <option value="خدمات أخرى">خدمات أخرى</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        {/* العنوان */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              <MapPin className="w-4 h-4 inline-block me-2" />
              العنوان بالعربية
            </label>
            <input
              type="text"
              required
              value={formData.addressAr}
              onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="مثال: شارع التحرير، القاهرة"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              Address (English)
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Example: Tahrir Street, Cairo"
            />
          </div>
        </div>

        {/* الإحداثيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              خط العرض (Latitude)
            </label>
            <input
              type="number"
              step="0.000001"
              required
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="30.0444"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              خط الطول (Longitude)
            </label>
            <input
              type="number"
              step="0.000001"
              required
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="31.2357"
            />
          </div>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
            <Phone className="w-4 h-4 inline-block me-2" />
            رقم هاتف المتجر
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            placeholder="01234567890"
          />
        </div>

        {/* إعدادات التوصيل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              <span className="w-4 h-4 inline-block me-2">EGP</span>
             رسوم التوصيل (EGP)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              الحد الأدنى للطلب (EGP)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              <Clock className="w-4 h-4 inline-block me-2" />
              وقت التوصيل (دقيقة)
            </label>
            <input
              type="number"
              required
              value={formData.estimatedDeliveryTime}
              onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="30"
            />
          </div>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {store ? "حفظ التغييرات" : "إنشاء المتجر"}
          </button>
        </div>
      </form>
    </div>
  );
}
