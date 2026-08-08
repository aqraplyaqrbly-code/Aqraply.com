import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Plus,
  Edit,
  Eye,
  Power,
  Clock,
  XCircle,
  ShoppingBag,
  ArrowLeft,
  Upload,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { ProductImage } from "./ProductImage";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function ProductsManager() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken, isAuthenticated } = useAuth();
  const myStores = useQuery(api.stores.getMyStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // جلب كل المنتجات (بدون تحديد متجر)
  const allProducts = useQuery(api.products.getMyProducts, isAuthenticated && sessionToken ? { sessionToken, availableOnly: false } : "skip");
  
  // جلب منتجات متجر معين (اختياري)
  const storeProducts = useQuery(
    api.products.getStoreProducts,
    selectedStore ? { storeId: selectedStore as any, availableOnly: false } : "skip"
  );

  // استخدام المنتجات المفلترة أو كل المنتجات
  const products = selectedStore ? storeProducts : allProducts;

  const updateAvailability = useMutation(api.products.updateProductAvailability);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const handleToggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      await updateAvailability({ sessionToken, productId: productId as any, isAvailable: !currentStatus });
      toast.success(currentStatus ? t('errors.productHidden') : t('errors.productShown'));
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('errors.deleteProductConfirm'))) return;
    
    try {
      await deleteProduct({ sessionToken, productId: productId as any });
      toast.success(t('errors.productDeleted'));
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

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
                <h1 className="text-lg font-bold text-gray-900">{t('errors.productsManagement')}</h1>
                <p className="text-xs text-gray-500">{t('errors.addEditProducts')}</p>
              </div>
            </div>

            {myStores && myStores.length > 0 && (
              <select
                value={selectedStore || ""}
                onChange={(e) => setSelectedStore(e.target.value || null)}
                className="px-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{t('errors.allStores')}</option>
                {myStores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.nameAr}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Add Product Button */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('errors.productsList')}</h2>
            <p className="text-gray-600 text-sm">
              {t('errors.totalProducts', { count: products?.length || 0 })}
              {selectedStore && ` ${t('errors.fromSelectedStore')}`}
            </p>
          </div>
          {myStores && myStores.length > 0 ? (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddProduct(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('errors.addProduct')}
            </button>
          ) : (
            <button
              onClick={() => toast.error(t('errors.createStoreFirst'))}
              className="px-6 py-3 bg-gray-300 text-gray-600 font-semibold rounded-xl cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('errors.addProduct')}
            </button>
          )}
        </div>

        {/* Products Grid */}
        {products === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('errors.noProductsYet')}</h3>
            <p className="text-gray-600 mb-6">{t('errors.startAddingProducts')}</p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 inline-block me-2" />
              {t('errors.addProduct')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <ProductImage product={product} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-3 start-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {product.images.length}
                    </div>
                  )}
                  <div className="absolute top-3 end-3">
                    <button
                      onClick={() => handleToggleAvailability(product._id, product.isAvailable)}
                      className={`p-2 rounded-lg shadow-lg ${
                        product.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {product.isAvailable ? (
                        <Eye className="w-5 h-5 text-white" />
                      ) : (
                        <Power className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 text-start">{product.nameAr}</h3>
                  {product.storeName && (
                    <p className="text-xs text-orange-600 mb-2 text-start">📍 {product.storeName}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-3 text-start line-clamp-2">{product.descriptionAr}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">{product.price} EGP</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ms-2">{product.originalPrice} EGP</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{product.preparationTime} {t('errors.minutePrep')}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.quantity} {t('errors.piece')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setShowAddProduct(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {t('errors.editProduct')}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <ProductFormModal
          sessionToken={sessionToken}
          stores={myStores || []}
          product={editingProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ stores, product, onClose, sessionToken }: { stores: any[]; product?: any; onClose: () => void; sessionToken?: string | null }) {
  // التحقق من وجود متاجر
  if (stores.length === 0) {
    toast.error(t('errors.createStoreFirstBeforeAddingProducts'));
    onClose();
    return null;
  }

  const [formData, setFormData] = useState({
    storeId: product?.storeId || stores[0]._id,
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    category: product?.category || "",
    weight: product?.weight?.toString() || "",
    preparationTime: product?.preparationTime?.toString() || "",
    quantity: product?.quantity?.toString() || "", // {t('errors.stockQuantity')}
    code: product?.code || "", // {t('errors.productCode')}
    colors: product?.colors || [], // {t('errors.availableColors')}
    sizes: product?.sizes || [], // {t('errors.availableSizes')}
  });

  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(""); // لإدراج رابط صورة مباشر
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // معاينة الصورة
  const imagePreviewUrls = useQuery(
    api.files.getFileUrls,
    imageUrls.length > 0 ? { storageIds: imageUrls } : "skip"
  );
  const resolvedImageUrls = imagePreviewUrls || imageUrls;
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Category mapping: store category -> related product categories
  const categoryMapping: { [key: string]: string[] } = {
    "مطاعم": ["برجر", "بيتزا", "مشاوي", "ساندوتشات", "وجبات سريعة", "أطباق رئيسية", "مقبلات", "سلطات", "شوربات", "مشروبات", "حلويات"],
    "كافيهات": ["قهوة", "شاي", "عصائر", "سموثي", "حلويات", "كعك", "بسكويت", "سناكس"],
    "سوبر ماركت": ["ألبان", "مخبوزات", "معلبات", "مشروبات", "وجبات جاهزة", "منظفات", "عناية شخصية"],
    "مخابز": ["خبز", "فطائر", "حلويات", "كعك", "بسكويت"],
    "حلويات": ["شوكولاتة", "حلويات شرقية", "حلويات غربية", "آيس كريم", "كعك"],
    "جزارة": ["لحم بقري", "لحم ضأن", "دجاج", "أسماك", "لحم مفروم"],
    "خضار وفاكهة": ["خضار", "فاكهة", "عصائر طبيعية"],
    "صيدليات": ["أدوية", "فيتامينات", "عناية شخصية", "مستحضرات طبية"],
    "مستحضرات تجميل": ["مكياج", "عناية بالبشرة", "عناية بالشعر", "عطور"],
    "عطور": ["عطور رجالية", "عطور نسائية", "عطور أطفال"],
    "ملابس": ["ملابس رجالية", "ملابس نسائية", "ملابس أطفال", "ملابس رياضية"],
    "أحذية وشنط": ["أحذية رجالية", "أحذية نسائية", "شنط", "حقائب"],
    "إلكترونيات": ["هواتف", "لابتوب", "أجهزة منزلية", "إكسسوارات"],
    "موبايلات": ["هواتف ذكية", "إكسسوارات موبايل", "شاشات حماية"],
    "كمبيوتر ولابتوب": ["لابتوب", "كمبيوتر مكتبي", "إكسسوارات"],
    "أجهزة منزلية": ["ثلاجات", "غسالات", "مكيفات", "أفران"],
    "أثاث": ["غرف نوم", "طاولات", "كراسي", "خزائن"],
    "مفروشات": ["سجاد", "ستائر", "مفروشات"],
    "مكتبات": ["كتب", "قرطاسية", "أدوات مكتبية"],
    "ألعاب أطفال": ["ألعاب تعليمية", "ألعاب رياضية", "ألعاب إلكترونية"],
    "رياضة": ["ملابس رياضية", "أحذية رياضية", "معدات رياضية"],
    "مراكز صيانة": ["صيانة هواتف", "صيانة كمبيوتر", "صيانة أجهزة"],
    "خدمات سيارات": ["قطع غيار", "إكسسوارات سيارات", "زيوت"],
    "مغاسل": ["غسيل ملابس", "تنظيف جاف", "كي ملابس"],
    "حلاقة وتجميل": ["قص شعر", "تجميل", "عناية بالبشرة"],
    "جيم ولياقة": ["عضلات", "كارديو", "يوجا"],
    "مراكز تعليم": ["دورات", "كتب تعليمية", "أدوات تعليمية"],
    "عيادات": ["طب عام", "أسنان", "عيادات متخصصة"],
    "معامل تحاليل": ["تحاليل دم", "تحاليل أشعة"],
    "خدمات أخرى": ["خدمات متنوعة"],
    "أخرى": ["أخرى"]
  };

  const [manuallyEditedFields, setManuallyEditedFields] = useState({
    name: false,
    description: false,
  });

  // Translation function using MyMemory free API
  const translateText = async (text: string): Promise<string> => {
    if (!text || text.trim() === "") return "";
    
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`
      );
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      }
      return "";
    } catch (error) {
      console.error("Translation error:", error);
      return "";
    }
  };

  // Debounce function to avoid excessive API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced translation handlers
  const handleNameArChange = debounce(async (value: string) => {
    if (!manuallyEditedFields.name && value.trim() !== "") {
      const translated = await translateText(value);
      if (translated) {
        setFormData(prev => ({ ...prev, name: translated }));
      }
    }
  }, 800);

  const handleDescriptionArChange = debounce(async (value: string) => {
    if (!manuallyEditedFields.description && value.trim() !== "") {
      const translated = await translateText(value);
      if (translated) {
        setFormData(prev => ({ ...prev, description: translated }));
      }
    }
  }, 800);

  const [allCategories, setAllCategories] = useState<Array<{storeId: string, category: string}>>(() => {
    // جلب الفئات المحفوظة من localStorage أو استخدام الفئات الافتراضية
    const savedCategories = localStorage.getItem('productCategories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch {
        const defaultCategories = ["برجر", "بيتزا", "مشاوي", "مشروبات", "حلويات", "سلطات", "أخرى"];
        return stores.map(store => 
          defaultCategories.map(cat => ({ storeId: store._id, category: cat }))
        ).flat();
      }
    }
    const defaultCategories = ["برجر", "بيتزا", "مشاوي", "مشروبات", "حلويات", "سلطات", "أخرى"];
    return stores.map(store => 
      defaultCategories.map(cat => ({ storeId: store._id, category: cat }))
    ).flat();
  }); // كل الفئات لكل المتاجر

  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  // Filter categories based on selected store's category
  const filteredCategories = useMemo(() => {
    if (!formData.storeId) return [];
    
    // Get the selected store
    const selectedStore = stores.find(s => s._id === formData.storeId);
    if (!selectedStore) return [];
    
    // Get the store's category
    const storeCategory = selectedStore.category;
    
    // Get mapped categories for this store category
    const mappedCategories = categoryMapping[storeCategory] || [];
    
    // Get custom categories for this store
    const customCategories = allCategories
      .filter(cat => cat.storeId === formData.storeId)
      .map(cat => cat.category);
    
    // Combine mapped and custom categories, remove duplicates
    const combinedCategories = [...mappedCategories, ...customCategories];
    return combinedCategories.filter((cat, index, arr) => arr.indexOf(cat) === index);
  }, [allCategories, formData.storeId, stores]);

  // حفظ الفئات في localStorage عند التحديث
  useEffect(() => {
    localStorage.setItem('productCategories', JSON.stringify(allCategories));
  }, [JSON.stringify(allCategories)]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // التحقق من صيغ الصور
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    for (let i = 0; i < files.length; i++) {
      if (!validTypes.includes(files[i].type)) {
        toast.error(t('merchant.productsManager.invalidImageType'));
        return;
      }
    }

    if (imageUrls.length + files.length > 10) {
      toast.error(t('merchant.productsManager.maxImages'));
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadUrl = await generateUploadUrl({ sessionToken });
        
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(t('merchant.productsManager.uploadFailed'));
        }

        const { storageId } = await result.json();
        uploadedUrls.push(storageId);
      }

      setImageUrls([...imageUrls, ...uploadedUrls]);
      toast.success(t('merchant.productsManager.uploadSuccess', { count: uploadedUrls.length }));
    } catch (error) {
      toast.error(t('merchant.productsManager.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // إضافة صورة من رابط مباشر
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      toast.error("الرجاء إدخال رابط صورة");
      return;
    }

    // التحقق من صيغة الرابط
    try {
      new URL(imageUrlInput);
    } catch {
      toast.error("الرجاء إدخال رابط صحيح (يبدأ بـ http أو https)");
      return;
    }

    if (imageUrls.length >= 10) {
      toast.error("الحد الأقصى 10 صور للمنتج");
      return;
    }

    // إضافة الرابط
    setImageUrls([...imageUrls, imageUrlInput]);
    setImageUrlInput("");
    setPreviewUrl(null);
    toast.success("تمت إضافة الصورة");
  };

  // معاينة الصورة قبل الإضافة
  const handlePreviewUrl = () => {
    if (!imageUrlInput.trim()) {
      toast.error("الرجاء إدخال رابط صورة");
      return;
    }

    try {
      new URL(imageUrlInput);
      setPreviewUrl(imageUrlInput);
    } catch {
      toast.error("الرجاء إدخال رابط صحيح");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      toast.error("يجب إضافة صورة واحدة على الأقل");
      return;
    }

    try {
      const productData = {
        storeId: formData.storeId as any,
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || undefined,
        category: formData.category,
        weight: parseFloat(formData.weight) || undefined,
        preparationTime: parseInt(formData.preparationTime) || undefined,
        quantity: parseInt(formData.quantity) || 0,
        code: formData.code,
        images: imageUrls,
        colors: formData.colors,
        sizes: formData.sizes,
        isAvailable: true,
      };

      if (product) {
        await updateProduct({ sessionToken, productId: product._id, ...productData });
        toast.success("تم تحديث المنتج بنجاح!");
      } else {
        await createProduct({ sessionToken, ...productData });
        toast.success("تم إضافة المنتج بنجاح!");
      }
      
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* اختيار المتجر */}
          {stores.length > 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">المتجر</label>
              <select
                required
                value={formData.storeId}
                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.nameAr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* رفع الصور */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              صور المنتج (حد أقصى 10 صور)
            </label>
            
            <div className="grid grid-cols-5 gap-3 mb-3">
              {imageUrls.map((url, index) => {
                const isDirectUrl = url.startsWith("http://") || url.startsWith("https://");
                const displayUrl = resolvedImageUrls[index] || (isDirectUrl ? url : undefined);
                return (
                  <div key={index} className="relative group">
                    {displayUrl ? (
                      <img src={displayUrl} alt={`صورة ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        جاري تحميل الصورة...
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 end-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 start-1 bg-orange-500 text-white px-2 py-0.5 rounded text-xs">
                        رئيسية
                      </div>
                    )}
                  </div>
                );
              })}
              
              {imageUrls.length < 10 && (
                <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">رفع صورة</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            
            {uploading && (
              <p className="text-sm text-orange-600 text-start">جاري رفع الصور...</p>
            )}
            <p className="text-xs text-gray-500 text-start">
              الصورة الأولى ستكون الصورة الرئيسية للمنتج
            </p>

            {/* إضافة صورة من رابط مباشر */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-start">أو أضفِ صورة من رابط مباشر</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="مثال: https://images.unsplash.com/photo-xxx"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-start"
                />
                <button
                  type="button"
                  onClick={handlePreviewUrl}
                  className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                >
                  معاينة
                </button>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={imageUrls.length >= 10}
                  className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    imageUrls.length >= 10
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  إضافة
                </button>
              </div>

              {/* معاينة الصورة */}
              {previewUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">معاينة:</p>
                  <div className="flex gap-4 items-start">
                    <img 
                      src={previewUrl} 
                      alt="معاينة" 
                      className="w-32 h-24 object-cover rounded-lg border-2 border-gray-300"
                      onError={() => {
                        toast.error("لا يمكن تحميل الصورة من هذا الرابط");
                        setPreviewUrl(null);
                      }}
                    />
                    <div className="flex-1 text-xs text-gray-600">
                      <p><strong>الرابط:</strong></p>
                      <p className="break-all text-gray-700 mt-1">{previewUrl}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">كود المنتج</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="مثال: BRG001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">الاسم بالعربية</label>
              <input
                type="text"
                required
                value={formData.nameAr}
                onChange={(e) => {
                  setFormData({ ...formData, nameAr: e.target.value });
                  handleNameArChange(e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="مثال: برجر لحم"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">Name (English)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setManuallyEditedFields(prev => ({ ...prev, name: true }));
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Example: Beef Burger"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">الوصف بالعربية</label>
            <textarea
              required
              value={formData.descriptionAr}
              onChange={(e) => {
                setFormData({ ...formData, descriptionAr: e.target.value });
                handleDescriptionArChange(e.target.value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              rows={3}
              placeholder="وصف المنتج..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">Description (English)</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setManuallyEditedFields(prev => ({ ...prev, description: true }));
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              rows={3}
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">السعر (EGP)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="25.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">السعر الأصلي (اختياري)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="30.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">الوزن (اختياري)</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="500g, 1kg, 250ml"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">عدد القطع (المخزون)</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="100"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-start">الفئة</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={!formData.storeId}
                className={`px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all ${
                  !formData.storeId 
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              >
                <option value="">
                  {!formData.storeId ? 'اختر المتجر أولاً' : 'اختر الفئة'}
                </option>
                {filteredCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="أضف فئة جديدة"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategory && formData.storeId && !filteredCategories.includes(newCategory)) {
                    setAllCategories([...allCategories, { storeId: formData.storeId, category: newCategory }]);
                    setFormData({ ...formData, category: newCategory });
                    setNewCategory("");
                  }
                }}
                disabled={!formData.storeId}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  !formData.storeId 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Plus className="w-5 h-5" />
                إضافة فئة
              </button>
            </div>
            {filteredCategories.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 text-start">الفئات المتاحة: {filteredCategories.join(', ')}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">وقت التحضير (دقيقة)</label>
            <input
              type="number"
              required
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="15"
            />
          </div>

          {/* قسم الألوان */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الألوان المتاحة (اختياري)</h3>
            
            {/* إضافة لون جديد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="مثال: أحمر، أزرق، أسود، أبيض"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (newColor) {
                    setFormData({
                      ...formData,
                      colors: [...formData.colors, newColor]
                    });
                    setNewColor("");
                  } else {
                    toast.error("يرجى إدخال اسم اللون");
                  }
                }}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة لون
              </button>
            </div>

            {/* عرض الألوان المضافة */}
            {formData.colors.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">الألوان المضافة:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200"
                    >
                      <div className="w-6 h-6 rounded border border-gray-300" style={{backgroundColor: color}}></div>
                      <span className="text-gray-900 font-medium">{color}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            colors: formData.colors.filter((_: string, i: number) => i !== index)
                          });
                        }}
                        className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* قسم المقاسات */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المقاسات المتاحة (اختياري)</h3>
            
            {/* إضافة مقاس جديد */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="رمز المقاس (S, M, L, 28، 30)"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <input
                type="text"
                value={newSizeLabel}
                onChange={(e) => setNewSizeLabel(e.target.value)}
                placeholder="عرض المقاس (صغير، وسط، كبير)"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSize && newSizeLabel) {
                    setFormData({
                      ...formData,
                      sizes: [...formData.sizes, { name: newSize, label: newSizeLabel }]
                    });
                    setNewSize("");
                    setNewSizeLabel("");
                  } else {
                    toast.error("يرجى ملء جميع الحقول");
                  }
                }}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة مقاس
              </button>
            </div>

            {/* عرض المقاسات المضافة */}
            {formData.sizes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">المقاسات المضافة:</h4>
                <div className="space-y-2">
                  {formData.sizes.map((size: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex gap-3">
                        <span className="font-semibold text-gray-900 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">
                          {size.name}
                        </span>
                        <span className="text-gray-700 self-center">{size.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            sizes: formData.sizes.filter((_: any, i: number) => i !== index)
                          });
                        }}
                        className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {product ? "تحديث المنتج" : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
