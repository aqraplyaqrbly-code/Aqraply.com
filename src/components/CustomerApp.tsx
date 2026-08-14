import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";
import CustomerLogin from "./CustomerLogin";
import CustomerRegister from "./CustomerRegister";
import CustomerOrders from "./CustomerOrders";
import OrderDetails from "./OrderDetails";
import { useAuth } from "../contexts/AuthContextNew";
import { normalizeArabicText } from "../lib/utils";

// Cart Item Interface
interface CartItem {
  productId: Id<"products">;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  color?: string;
  size?: string;
}
import { ProductImage } from "./ProductImage";
import LocationTracker from "./LocationTracker";
import CustomerLocationTracker from "./CustomerLocationTracker";
import LocationButton from "./LocationButton";
import StoreDistance from "./StoreDistance";
import WalletPayment from "./WalletPayment";
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
  Wallet,
  MessageSquare,
  Home,
  Package,
  LogOut,
  Clock,
  X,
  Plus,
  Minus,
  Truck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Store,
  Phone,
  Lock,
} from "lucide-react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useCart } from "./CartContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { NavigationBar } from "./NavigationBar";
import SuspensionCheck from "./SuspensionCheck";
import CustomerReviewPage from "./CustomerReviewPage";
import StoreRatingsPage from "./StoreRatingsPage";
import ProductRatingsPage from "./ProductRatingsPage";
import ChangePasswordModal from "./ChangePasswordModal";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Fallback NavigationBar component in case import fails
const FallbackNavigationBar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { t } = useTranslation();

  return (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-3 sm:px-4">
      <div className="flex justify-between items-center h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Aqraply Logo" className="h-24 w-auto" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <NotificationBell />
          <button
            onClick={() => navigate('/customer/cart')}
            className="text-gray-600 hover:text-orange-600 transition-colors relative p-1 sm:p-0"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/customer/orders')}
            className="text-gray-600 hover:text-orange-600 transition-colors p-1 sm:p-0"
          >
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => navigate('/customer/profile')}
            className="text-gray-600 hover:text-orange-600 transition-colors p-1 sm:p-0"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
  );
};

function StoreImage({
  imageIdOrUrl,
  alt,
  className = "w-full h-full object-cover",
}: {
  imageIdOrUrl?: string;
  alt: string;
  className?: string;
}) {
  // Generate a placeholder image based on store name
  const generatePlaceholderUrl = (name: string) => {
    const seed = name.replace(/\s+/g, '').toLowerCase();
    return `https://picsum.photos/seed/${seed}/400/300.jpg`;
  };

  // Use placeholder or original URL
  const src = imageIdOrUrl && imageIdOrUrl.startsWith('http') 
    ? imageIdOrUrl 
    : generatePlaceholderUrl(alt);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        // If image fails to load, use a default store image
        const target = e.currentTarget;
        target.src = 'https://picsum.photos/seed/store/400/300.jpg';
      }}
    />
  );
}
// ─── Product Detail Modal with Image Gallery ───────────────────────────────
function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart,
  size,
  onSelectSize 
}: { 
  product: any; 
  onClose: () => void; 
  onAddToCart: (product: any, sizeLabel?: string, color?: string, imageUrl?: string) => void;
  size: string | null;
  onSelectSize: (size: string | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  const isArabic = i18n.language === 'ar';
  const { sessionToken } = useAuth();
  
  // جلب بيانات المنتج المحدثة من DB (السعر والمقاسات والصور)
  const liveProduct = useQuery(api.products.getProductWithImage, { 
    productId: product._id,
    ...(sessionToken ? { sessionToken } : {})
  });
  
  // استخدام البيانات المحدثة أو البيانات المحلية كـ fallback
  const displayProduct = liveProduct || product;
  const images = displayProduct.images && displayProduct.images.length > 0 ? displayProduct.images : [];
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-40">
          <h2 className="text-lg font-bold text-gray-900">{isArabic ? displayProduct.nameAr : displayProduct.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <ProductImage product={displayProduct} imageIndex={currentImageIndex} className="w-full h-full object-cover" />
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ArrowRight className="w-5 h-5 text-gray-900" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 px-3 py-2 bg-black/60 text-white text-sm rounded-full font-semibold">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-orange-500 ring-2 ring-orange-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${t('common.image')} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{isArabic ? displayProduct.nameAr : displayProduct.name}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{isArabic ? displayProduct.descriptionAr : displayProduct.description}</p>
            </div>
            
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-bold text-orange-600">{displayProduct.price}</span>
              <span className="text-xl text-gray-600 font-semibold">{t('common.currency')}</span>
              {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
                <div className="flex items-center gap-2 ms-4">
                  <span className="text-xl text-gray-400 line-through">
                    {displayProduct.originalPrice} EGP
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sizes Selection */}
          {displayProduct.sizes && displayProduct.sizes.length > 0 && (
            <div className="space-y-4 border-b border-gray-100 pb-4">
              <h4 className="text-lg font-semibold text-gray-900">{t('customer.availableSizes')}</h4>
              <div className="grid grid-cols-3 gap-2">
                {displayProduct.sizes.map((sizeItem: any) => (
                  <button
                    key={sizeItem.name}
                    onClick={() => onSelectSize(size === sizeItem.name ? null : sizeItem.name)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 text-sm ${
                      size === sizeItem.name
                        ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {sizeItem.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors Selection */}
          {displayProduct.colors && displayProduct.colors.length > 0 && (
            <div className="space-y-4 border-b border-gray-100 pb-4">
              <h4 className="text-lg font-semibold text-gray-900">{t('customer.availableColors')}</h4>
              <div className="flex flex-wrap gap-3">
                {displayProduct.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    className={`py-2.5 px-4 rounded-lg font-semibold transition-all border-2 flex items-center gap-2 ${
                      selectedColor === color
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                      style={{backgroundColor: color}}
                    ></div>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => onAddToCart(displayProduct, size || undefined, selectedColor || undefined, images[currentImageIndex])}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" />
              {t('customer.addToCart')}
            </button>
            <button
              onClick={() => window.open(`/customer/ratings/product/${displayProduct._id}`, '_blank')}
              className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              {t('customer.viewRatings')}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function CustomerApp() {
  return (
    <SuspensionCheck allowedRoles={['customer', 'admin']}>
      <ErrorBoundary>
        <FallbackNavigationBar />
      <Routes>
        <Route path="/" element={<StoresList />} />
        <Route path="/store/:storeId" element={<StoreDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']} fallbackPath="/customer/login">
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/order-success/:orderId" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerOrders />
          </ProtectedRoute>
        } />
        <Route path="/orders/:orderId" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/review/:reviewType/:orderId" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerReviewPage />
          </ProtectedRoute>
        } />
        <Route path="/customer/review/:reviewType/:orderId" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerReviewPage />
          </ProtectedRoute>
        } />
        <Route path="/ratings/store/:storeId" element={<StoreRatingsPage />} />
        <Route path="/ratings/product/:productId" element={<ProductRatingsPage />} />
      </Routes>
      </ErrorBoundary>
    </SuspensionCheck>
  );
}

function StoresList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const stores = useQuery(api.stores.getActiveStores);
  const allProducts = useQuery(api.products.getAllProductsWithImages, { availableOnly: true, ...(sessionToken && { sessionToken }) });
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [showNearby, setShowNearby] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(t('errors.todaysOffers'));
  const [availableCategories, setAvailableCategories] = useState<string[]>([t('errors.todaysOffers')]);
  const { getItemCount } = useCart();
  
  const isArabic = i18n.language === 'ar';

  // All store categories from dropdown list
  const allStoreCategories = [
    "مطاعم", "كافيهات", "سوبر ماركت", "مخابز", "حلويات",
    "جزارة", "خضار وفاكهة", "صيدليات", "مستحضرات تجميل", "عطور",
    "ملابس", "أحذية وشنط", "إلكترونيات", "موبايلات", "كمبيوتر ولابتوب",
    "أجهزة منزلية", "أثاث", "مفروشات", "مكتبات", "ألعاب أطفال",
    "رياضة", "مراكز صيانة", "خدمات سيارات", "مغاسل", "حلاقة وتجميل",
    "جيم ولياقة", "مراكز تعليم", "عيادات", "معامل تحاليل", "خدمات أخرى", "أخرى"
  ];

  // Extract unique store categories from existing stores
  useEffect(() => {
    if (!stores || stores.length === 0) {
      setAvailableCategories([t('errors.todaysOffers'), ...allStoreCategories]);
      return;
    }

    const uniqueStoreCategories = Array.from(
      new Set(stores.map(s => s.category).filter(Boolean))
    ).sort() as string[];

    // Combine all categories with existing ones, remove duplicates
    const combinedCategories = [...allStoreCategories, ...uniqueStoreCategories];
    const sortedCategories = Array.from(new Set(combinedCategories)).sort();

    setAvailableCategories([t('errors.todaysOffers'), ...sortedCategories]);

    // Reset selected category if it no longer exists
    if (selectedCategory !== t('errors.todaysOffers') && !sortedCategories.includes(selectedCategory)) {
      setSelectedCategory(t('errors.todaysOffers'));
    }
  }, [stores?.length]);

  // Filter products by store category
  const filteredProductsByCategory = useMemo(() => {
    if (selectedCategory === t('errors.todaysOffers')) {
      return allProducts?.filter(p => p.originalPrice && p.originalPrice > p.price) || [];
    }

    // Get stores with the selected category
    const storesInCategory = stores?.filter(s => s.category === selectedCategory) || [];
    
    if (storesInCategory.length === 0) return [];

    // Get all products from stores in this category
    const storeIds = storesInCategory.map(s => s._id);
    return allProducts?.filter(p => storeIds.includes(p.storeId)) || [];
  }, [selectedCategory, allProducts, stores, t]);
  
  const nearbyStores = useQuery(api.location.getNearbyStores, 
    userLocation ? { 
      userLatitude: userLocation.latitude, 
      userLongitude: userLocation.longitude,
      maxDistance: 20 // 20km radius
    } : "skip"
  );

  // Loading state
  if (stores === undefined || allProducts === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleLocationFound = (latitude: number, longitude: number) => {
    setUserLocation({ latitude, longitude });
    setShowNearby(true);
  };

  // جلب المنتجات التي لها خصومات (عروض اليوم)
  const todayDeals = allProducts?.filter(product => 
    product.originalPrice && product.originalPrice > product.price
  ).slice(0, 10) || [];

  // أفضل المنتجات (منتجات عشوائية من المتاجر الموثوقة)
  const topRatedProducts = allProducts?.filter(p => p.price < 500)
    .slice(0, 10) || [];

  // الأكثر مبيعا (منتجات بسعر معقول وصور متعددة)
  const bestSellingProducts = allProducts?.filter(p => p.images && p.images.length > 1)
    .slice(0, 10) || [];

  // المنتجات الجديدة (أحدث المنتجات - مرتبة بـ _creationTime)
  const newProducts = allProducts?.sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
    .slice(0, 10) || [];

  const filteredStores = stores?.filter(store =>
    normalizeArabicText(store?.nameAr || '').includes(normalizeArabicText(searchQuery)) ||
    store?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    normalizeArabicText(store?.location?.addressAr || '').includes(normalizeArabicText(searchQuery)) ||
    store?.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredProducts = allProducts?.filter(product =>
    normalizeArabicText(product?.nameAr || '').includes(normalizeArabicText(searchQuery)) ||
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    normalizeArabicText(product?.category || '').includes(normalizeArabicText(searchQuery))
  ) || [];

  // حساب المسافة بين نقطتين
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // إضافة المسافة للمتاجر
  const storesWithDistance = filteredStores?.map(store => {
    if (!userLocation || !store.location) return { ...store, distance: null };
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      store.location.latitude,
      store.location.longitude
    );
    
    return { ...store, distance };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('auth.welcome')}</h1>
          <p className="text-orange-100">{t('customer.orderFromStores')}</p>
        </div>
      </div>

      {/* Location Tracker */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <CustomerLocationTracker 
          onLocationUpdate={(location) => {
            setUserLocation({ latitude: location.latitude, longitude: location.longitude });
            console.log('Customer location updated:', location);
          }}
          className="w-full"
        />
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('customer.searchPlaceholder')}
            className="w-full pr-12 pl-4 py-4 bg-white rounded-xl shadow-lg border-2 border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm mb-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto" dir="ltr">
            <div className="flex-1 overflow-x-auto scrollbar-hide" dir={document.documentElement.dir === "rtl" ? "rtl" : "ltr"}>
              <div className="flex gap-3 pb-0 min-w-max justify-center sm:justify-start">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 text-sm rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (filteredStores.length > 0 || filteredProducts.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 mb-6 bg-white rounded-xl shadow-lg p-4">
          {filteredStores.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">🏪 {t('customer.matchingStores')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStores.slice(0, 6).map((store) => (
                  <button
                    key={store._id}
                    onClick={() => navigate(`/customer/store/${store._id}`)}
                    className="bg-gray-50 rounded-lg p-3 text-right hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-300"
                  >
                    <h5 className="font-semibold text-gray-900">{isArabic ? store.nameAr : store.name}</h5>
                    <p className="text-sm text-gray-600">{isArabic ? store.location?.addressAr : store.location?.address}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🔍 {t('customer.matchingProducts')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredProducts.slice(0, 8).map((product) => (
                  <button
                    key={product._id}
                    onClick={() => navigate(`/customer/store/${product.storeId}`)}
                    className="bg-gray-50 rounded-lg p-3 text-right hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-300"
                  >
                    <h5 className="font-semibold text-gray-900 text-sm">{isArabic ? product.nameAr : product.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600">{product.price !== null && product.price !== undefined ? product.price.toFixed(2) : '—'} {t('common.currency')}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {filteredProducts.length > 8 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate(`/customer?search=${encodeURIComponent(searchQuery)}`)}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {t('customer.viewAllProducts')} ({filteredProducts.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {searchQuery && filteredStores.length === 0 && filteredProducts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-6 bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600">{t('customer.noStoresOrProductsFound')}</p>
        </div>
      )}

      {/* Products by Category */}
      {selectedCategory !== t('errors.todaysOffers') && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedCategory}</h2>
            <span className="text-sm text-gray-500 font-medium">({filteredProductsByCategory.length})</span>
          </div>

          {!filteredProductsByCategory || filteredProductsByCategory.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                {t('errors.noProductsInCategory')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProductsByCategory.slice(0, 12).map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-orange-200"
                >
                  <div className="relative w-full h-40 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
                    <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 flex flex-col">
                    <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
                      {isArabic ? product.nameAr : product.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-1 mb-3 flex-1">
                      {isArabic ? product.descriptionAr : product.description}
                    </p>

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-orange-600">
                          {product.price}
                        </span>
                        <span className="text-xs text-gray-600 font-medium">
                          EGP
                        </span>
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          {product.originalPrice} EGP
                        </div>
                      )}

                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* عروض اليوم - Today's Deals */}
      {todayDeals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">🎉 {t('customer.todaysDeals')}</h2>
            <span className="text-sm text-gray-500 font-medium">({todayDeals.length})</span>
          </div>

          {!allProducts ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {todayDeals.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden text-right group border border-gray-100 hover:border-red-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Discount Badge */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors mb-2">
                      {isArabic ? product.nameAr : product.name}
                    </h4>
                    
                    {/* Prices */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-red-600">{product.price !== null && product.price !== undefined ? product.price.toFixed(2) : '—'}</span>
                        <span className="text-xs text-gray-600">{t('common.currency')}</span>
                      </div>
                      {product.originalPrice && product.originalPrice > (product.price ?? 0) && (
                        <div className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toFixed(2)} {t('common.currency')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      
      {/* أفضل المنتجات - Top Rated */}
      {topRatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">⭐ {t('customer.topProducts')}</h2>
            <span className="text-sm text-gray-500 font-medium">{t('customer.exploreTopProducts')}</span>
          </div>

          {!allProducts ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {topRatedProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden text-right group border border-gray-100 hover:border-yellow-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-yellow-400 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      ⭐ {t('customer.featured')}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors mb-2">
                      {isArabic ? product.nameAr : product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-orange-600">{product.price}</span>
                        <span className="text-xs text-gray-600">{t('common.currency')}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* الأكثر مبيعا - Best Selling */}
      {bestSellingProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 {t('customer.bestSelling')}</h2>
            <span className="text-sm text-gray-500 font-medium">{t('customer.chosenByMillions')}</span>
          </div>

          {!allProducts ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {bestSellingProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden text-right group border border-gray-100 hover:border-green-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Sales Badge */}
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      🔥 {t('customer.popular')}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors mb-2">
                      {isArabic ? product.nameAr : product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-orange-600">{product.price}</span>
                        <span className="text-xs text-gray-600">{t('common.currency')}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* المنتجات الجديدة - New Products */}
      {newProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">✨ {t('customer.newProducts')}</h2>
            <span className="text-sm text-gray-500 font-medium">{t('customer.latestAdditions')}</span>
          </div>

          {!allProducts ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden text-right group border border-gray-100 hover:border-blue-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* New Badge */}
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      {t('customer.new')}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors mb-2">
                      {isArabic ? product.nameAr : product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-orange-600">{product.price}</span>
                        <span className="text-xs text-gray-600">{t('common.currency')}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      
      {/* Location Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📍 {t('customer.nearbyStores')}</h2>
              <p className="text-gray-600">{t('customer.discoverNearbyStores')}</p>
            </div>
            <LocationButton 
              onLocationFound={handleLocationFound}
              className="shadow-lg"
            />
          </div>

          {/* Nearby Stores */}
          {showNearby && nearbyStores && nearbyStores.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">{t('customer.storesNearYou')}</h3>
                <span className="text-sm text-blue-600 font-medium">({nearbyStores.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyStores.slice(0, 6).map((store: any) => (
                  <StoreDistance
                    key={store._id}
                    store={store}
                    distance={store.distance}
                    onClick={() => navigate(`/customer/store/${store._id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {showNearby && nearbyStores && nearbyStores.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد متاجر قريبة</h3>
              <p className="text-gray-600">جرب توسيع نطاق البحث أو تحديد موقع آخر</p>
            </div>
          )}
        </div>
      </div>

      {/* All Stores Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">🏪 جميع المتاجر</h2>
          <span className="text-sm text-gray-500 font-medium">({stores?.length || 0})</span>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {!stores ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : storesWithDistance && storesWithDistance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storesWithDistance.map((store) => (
              <button
                key={store._id}
                onClick={() => navigate(`/customer/store/${store._id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all overflow-hidden text-right group"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
                  <StoreImage
                    imageIdOrUrl={store.imageUrl}
                    alt={isArabic ? store.nameAr : store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{isArabic ? store.nameAr : store.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">{isArabic ? store.descriptionAr : store.description}</p>
                  
                  {/* Address with GPS and Distance */}
                  {store.location?.addressAr && (
                    <div className="flex items-start gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-700 line-clamp-2">{isArabic ? store.location.addressAr : store.location.address}</p>
                        {store.distance !== null && (
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            📍 {store.distance < 1 ? `${(store.distance * 1000).toFixed(0)} ${t('common.meters')}` : `${store.distance.toFixed(1)} ${t('common.km')}`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{store.rating !== null && store.rating !== undefined ? store.rating.toFixed(1) : '—'}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{store.estimatedDeliveryTime} {t('common.minutes')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">{t('customer.delivery')}</span>
                      <span className="text-lg font-bold text-orange-600">{(store.deliveryFee ?? 0).toFixed(2)} {t('common.currency')}</span>
                    </div>
                    <span className="px-3.5 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-200">
                      {store.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t('customer.noStoresAvailable')}</p>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}

function StoreDetails() {
  const { t, i18n } = useTranslation();
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, sessionToken } = useAuth();
  const store = useQuery(api.stores.getStoreById, storeId ? { storeId: storeId as any, ...(sessionToken ? { sessionToken } : {}) } : "skip");
  const products = useQuery(api.products.getStoreProductsWithImages, storeId ? { storeId: storeId as any, availableOnly: false } : "skip");
  const { cart, addToCart, getItemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [size, setSelectedSize] = useState<string | null>(null);
  
  const isArabic = i18n.language === 'ar';

  // Loading state
  if (store === undefined || products === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('customer.loadingStore')}</p>
        </div>
      </div>
    );
  }

  console.log("StoreDetails - storeId:", storeId);
  console.log("StoreDetails - store:", store);
  console.log("StoreDetails - products:", products);

  if (!storeId) {
    navigate('/customer');
    return null;
  }

  const handleAddToCart = (product: any, sizeLabel?: string, color?: string, imageUrl?: string) => {
    if (!store) return;

    // Use the selected image URL (storage ID) - this will be resolved to URL in the backend
    const selectedImageUrl = imageUrl || product.images?.[0] || "";

    addToCart(
      {
        storeId: store._id,
        storeName: store.name,
        storeNameAr: store.nameAr,
        deliveryFee: store.deliveryFee,
        minOrderAmount: store.minOrderAmount,
      },
      {
        productId: product._id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        quantity: 1,
        imageUrl: selectedImageUrl,
        color: color,
        selectedSize: sizeLabel,
      }
    );

    toast.success(`${t('customer.addedToCart')} ${isArabic ? product.nameAr : product.name}`);
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  // تجميع المنتجات حسب الفئة
  const productsByCategory = products?.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const categories = productsByCategory ? Object.keys(productsByCategory) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Debug Information */}
      {import.meta.env.DEV && (
        <div className="max-w-7xl mx-auto px-4 py-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 mb-4">
          <p>🔍 DEBUG: storeId={storeId}, store loaded={!!store}, products loaded={!!products}, products count={products?.length || 0}</p>
        </div>
      )}

      {/* Store Header */}
      {store && (
        <>
          <div className="relative h-72 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
            <StoreImage
              imageIdOrUrl={store.imageUrl}
              alt={isArabic ? store.nameAr : store.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <button
              onClick={() => navigate('/customer')}
              className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur hover:bg-white shadow-2xl rounded-full flex items-center justify-center font-bold text-gray-900 hover:scale-110 transform transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{isArabic ? store.nameAr : store.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{isArabic ? store.descriptionAr : store.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-yellow-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-600">{t('customer.rating')}</div>
                    <div className="font-bold text-yellow-700">{(store.rating ?? 0).toFixed(1)}</div>
                  </div>
                </div>
                <div className="bg-blue-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-600">{t('customer.time')}</div>
                    <div className="font-bold text-blue-700">{store.estimatedDeliveryTime} {t('common.mins')}</div>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-600">{t('customer.delivery')}</div>
                    <div className="font-bold text-orange-700">{(store.deliveryFee ?? 0).toFixed(2)} {t('common.currency')}</div>
                  </div>
                </div>
                <div className="bg-green-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-600">{t('customer.minOrder')}</div>
                    <div className="font-bold text-green-700">{(store.minOrderAmount ?? 0).toFixed(2)} {t('common.currency')}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{isArabic ? store.location.addressAr : store.location.address}</p>
                  {store.location.latitude && store.location.longitude && (
                    <p className="text-xs text-blue-600 mt-1">
                      📍 {store.location.latitude.toFixed(4)}, {store.location.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              {/* View Reviews Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/customer/ratings/store/${store._id}`)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Star className="w-5 h-5" />
                  {t('customer.viewRatingsReviews')}
                </button>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className={`max-w-7xl mx-auto px-4 mb-10 sticky top-0 z-30 bg-white/95 backdrop-blur py-4 -mx-4 px-4 transition-all ${selectedProduct ? 'pointer-events-none opacity-50' : ''}`}>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {t('customer.all')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="max-w-7xl mx-auto px-4 pb-32">
            {!products ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="pt-2 flex gap-2">
                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-4">لا توجد منتجات متاحة حالياً</p>
                <p className="text-sm text-gray-500 mb-6">
                  يرجى التأكد من إضافة منتجات للمتجر
                </p>
                <button
                  onClick={() => navigate('/customer')}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للمتاجر
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {(selectedCategory ? [selectedCategory] : categories).map((category) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-orange-200">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                      <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                      <span className="text-sm text-gray-500 font-medium">({productsByCategory?.[category]?.length || 0})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productsByCategory?.[category]?.map((product) => (
                        <div 
                          key={product._id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group border border-gray-100 hover:border-orange-200"
                        >
                          {/* Product Image */}
                          <div 
                            className="relative w-full h-52 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            {product.images && product.images.length > 1 && (
                              <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                {product.images.length} صور
                              </div>
                            )}
                            
                            {/* Badge for discount */}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </div>
                            )}
                            
                            {/* Quick Add Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (product.sizes && product.sizes.length > 0) {
                                  setSelectedProduct(product);
                                } else {
                                  handleAddToCart(product);
                                }
                              }}
                              className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300"
                            >
                              <Plus className="w-6 h-6" />
                            </button>
                          </div>
                          
                          {/* Product Info */}
                          <div 
                            className="flex-1 p-5 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm">{isArabic ? product.nameAr : product.name}</h4>
                              {product.quantity !== undefined && product.quantity > 0 && (
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">{t('customer.available')}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-4 flex-1">{isArabic ? product.descriptionAr : product.description}</p>
                            
                            {/* Price Section */}
                            <div className="space-y-2 pt-3 border-t border-gray-100">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-orange-600">{product.price !== null && product.price !== undefined ? product.price.toFixed(2) : '—'}</span>
                                <span className="text-xs text-gray-600 font-medium">EGP</span>
                              </div>
                              {product.originalPrice && product.originalPrice > (product.price ?? 0) && (
                                <div className="text-xs text-gray-400 line-through">
                                  {product.originalPrice.toFixed(2)} EGP
                                </div>
                              )}
                              
                              {/* Category Badge */}
                              <div className="flex items-center justify-between pt-2">
                                <span className="inline-block px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                                  {product.category}
                                </span>
                                {product.sizes && product.sizes.length > 0 && (
                                  <span className="text-xs text-gray-500">📏 {product.sizes.length} مقاسات</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Detail Modal */}
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => {
                setSelectedProduct(null);
                setSelectedSize(null);
              }}
              onAddToCart={(product, sizeLabel, color, imageUrl) => handleAddToCart(product, sizeLabel, color, imageUrl)}
              size={size}
              onSelectSize={setSelectedSize}
            />
          )}
        </>
      )}

      {/* Floating Cart Button */}
      {cart && cart.storeId === storeId && getItemCount() > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-50">
          <button
            onClick={() => navigate('/customer/cart')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 px-6 rounded-xl shadow-2xl hover:shadow-3xl flex items-center justify-between transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">{getItemCount()} منتج</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{cart.items.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0).toFixed(2)} EGP</span>
              <ArrowLeft className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}

// Component لعرض عنصر السلة مع مراقبة السعر المحدث من قاعدة البيانات
function CartItemWithLivePrice({ 
  item, 
  updateQuantity, 
  removeFromCart 
}: { 
  item: CartItem;
  updateQuantity: (productId: Id<"products">, quantity: number) => void;
  removeFromCart: (productId: Id<"products">) => void;
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { sessionToken } = useAuth();
  // جلب بيانات المنتج الحالية من DB للسعر المحدث
  const storedProduct = useQuery(api.products.getProductWithImage, { 
    productId: item.productId,
    ...(sessionToken ? { sessionToken } : {})
  });
  
  // استخدام السعر من DB أو السعر المخزن إذا لم يحمل
  const currentPrice = storedProduct?.price ?? item.price;
  const isPriceChanged = currentPrice !== item.price;

  return (
    <div className="p-4 flex gap-4">
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <ProductImage product={item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">{isArabic ? item.nameAr : item.name}</h4>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.color && (
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  🎨 {item.color}
                </span>
              )}
              {item.size && (
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  📏 {item.size}
                </span>
              )}
              {storedProduct?.sizes && storedProduct.sizes.length > 0 && (
                <span className="text-xs text-gray-500">
                  {t('customer.sizes')}: {Array.isArray(storedProduct.sizes) 
                    ? storedProduct.sizes.map((s: any) => typeof s === 'string' ? s : s.label).join(', ')
                    : storedProduct.sizes}
                </span>
              )}
              {storedProduct?.colors && storedProduct.colors.length > 0 && (
                <span className="text-xs text-gray-500">
                  {t('customer.colors')}: {storedProduct.colors.join(', ')}
                </span>
              )}
            </div>
            
            {/* Product Price Details */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-orange-600">
                  {(currentPrice ?? 0).toFixed(2)} {t('common.currency')}
                </span>
                {storedProduct?.originalPrice && storedProduct.originalPrice > (currentPrice ?? 0) && (
                  <span className="text-sm text-gray-400 line-through">
                    {(storedProduct.originalPrice ?? 0).toFixed(2)} {t('common.currency')}
                  </span>
                )}
                {storedProduct?.originalPrice && storedProduct.originalPrice > (currentPrice ?? 0) && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                    -{Math.round(((storedProduct.originalPrice - (currentPrice ?? 0)) / storedProduct.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              
              {storedProduct?.category && (
                <div className="text-xs text-gray-500">
                  {t('customer.category')}: {storedProduct.category}
                </div>
              )}
              
              {isArabic ? storedProduct?.descriptionAr : storedProduct?.description && (
                <div className="text-xs text-gray-600 line-clamp-2">
                  {isArabic ? storedProduct.descriptionAr : storedProduct.description}
                </div>
              )}
              
              {/* Stock Information */}
              <div className="flex items-center gap-2 text-xs">
                {storedProduct?.quantity !== undefined && storedProduct.quantity > 0 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('customer.available')} ({storedProduct.quantity} {t('customer.pieces')})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{t('customer.notAvailable')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {isPriceChanged && (
              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded inline-block mt-2 font-semibold">
                ⚠️ {t('customer.priceChanged')}: {item.price?.toFixed(2) ?? '—'} → {currentPrice?.toFixed(2) ?? '—'} {t('common.currency')}
              </div>
            )}
          </div>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="p-1 hover:bg-red-50 rounded text-red-500 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>سعر الوحدة:</span>
              <span className="font-medium">{currentPrice !== null && currentPrice !== undefined ? currentPrice.toFixed(2) : '—'} EGP</span>
              <span>×</span>
              <span className="font-medium">{item.quantity}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">الإجمالي:</span>
              <span className={`text-lg font-bold ${isPriceChanged ? 'text-red-600' : 'text-orange-600'}`}>
                {currentPrice !== null && currentPrice !== undefined ? (currentPrice * item.quantity).toFixed(2) : '—'} EGP
              </span>
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-green-600 font-medium">
                توفير: {(((storedProduct?.originalPrice ?? currentPrice) - (currentPrice ?? 0)) * item.quantity).toFixed(2)} EGP
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">قم بتسجيل الدخول لعرض سلة المشتريات</p>
          <button
            onClick={() => navigate('/customer/login?redirect=/customer/cart')}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً لإتمام الطلب');
      navigate('/customer/login?redirect=/customer/checkout');
      return;
    }
    navigate('/customer/checkout');
  };

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">ابدأ بإضافة منتجات من المتاجر</p>
          <button
            onClick={() => navigate('/customer')}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            تصفح المتاجر
          </button>
        </div>
      </div>
    );
  }

  const totals = getTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">سلة المشتريات</h1>
            <p className="text-sm text-gray-600">{cart.items.length} منتج</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Info */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{cart.storeNameAr}</h3>
                  <p className="text-sm text-gray-600">التوصيل: <span className="font-bold text-orange-600">{cart.deliveryFee} EGP</span></p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">تفاصيل المنتجات</h3>
                    <p className="text-sm text-gray-600">
                      {cart.items.length} منتج • {cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)} قطعة
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">المجموع الفرعي</div>
                    <div className="font-bold text-orange-600">{(totals.subtotal ?? 0).toFixed(2)} EGP</div>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <CartItemWithLivePrice 
                    key={item.productId} 
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - 1 column on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900 text-lg">ملخص الطلب</h4>
              <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {cart.items.length} منتج • {cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)} قطعة
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">المجموع الفرعي</div>
                    <div className="text-xs text-gray-500">قيمة المنتجات</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{(totals.subtotal ?? 0).toFixed(2)} EGP</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">رسوم التوصيل</div>
                    <div className="text-xs text-gray-500">توصيل إلى {cart.customerAddressAr || 'عنوانك'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {(totals.deliveryFee ?? 0).toFixed(2)} EGP
                  </div>
                  {totals.deliveryFee === 0 && (
                    <div className="text-xs text-green-600 font-medium">مجاني</div>
                  )}
                </div>
              </div>
              
              {(cart.freeDeliveryThreshold && totals.subtotal >= cart.freeDeliveryThreshold) && totals.deliveryFee > 0 && (
                <div className="flex items-center justify-between py-1">
                  <div className="text-xs text-green-600 font-medium">
                    🎉 حصلت على توصيل مجاني!
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    -{totals.deliveryFee.toFixed(2)} EGP
                  </div>
                </div>
              )}
              
              {cart.freeDeliveryThreshold && totals.subtotal < cart.freeDeliveryThreshold && (
                <div className="flex items-center justify-between py-1">
                  <div className="text-xs text-blue-600 font-medium">
                    🚚 للوصول للتوصيل المجاني:
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {(cart.freeDeliveryThreshold - totals.subtotal).toFixed(2)} EGP
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t-2 border-orange-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">₺</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">الإجمالي المستحق</div>
                    <div className="text-xs text-gray-500">المبلغ النهائي للدفع</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {totals.total.toFixed(2)} EGP
                  </div>
                  <div className="text-xs text-gray-500">
                    شامل الضريبة والرسوم
                  </div>
                  {totals.total > 1000 && (
                    <div className="text-xs text-green-600 font-medium">
                      🎁 طلب كبير يحقق مكافآت
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {cart.minOrderAmount && totals.subtotal < cart.minOrderAmount ? (
            <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-semibold">
              ⚠️ الحد الأدنى للطلب {cart.minOrderAmount.toFixed(2)} EGP (متبقي {(cart.minOrderAmount - totals.subtotal).toFixed(2)} EGP)
            </div>
          ) : null}

          <button
            onClick={handleCheckout}
            disabled={totals.subtotal < cart.minOrderAmount}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            إتمام الطلب
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { sessionToken, isAuthenticated, user, isLoading } = useAuth();
  const createOrder = useMutation(api.orders.createOrder);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">قم بتسجيل الدخول لإتمام عملية الشراء</p>
          <button
            onClick={() => navigate('/customer/login?redirect=/customer/checkout')}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guards to prevent duplicate redirects
  const hasCheckedLogin = useRef(false);
  const hasCheckedCart = useRef(false);

  // التحقق من تسجيل الدخول عند تحميل الصفحة - FIXED: Only redirect once
  useEffect(() => {
    if (!user && !hasCheckedLogin.current) {
      hasCheckedLogin.current = true;
      toast.error('يجب تسجيل الدخول أولاً لإتمام الطلب');
      navigate('/customer/login?redirect=/customer/checkout', { replace: true });
    }
  }, [user]);

  // التحقق من وجود سلة التسوق - FIXED: Only redirect once
  useEffect(() => {
    if (!cart && !hasCheckedCart.current) {
      hasCheckedCart.current = true;
      navigate('/customer/cart', { replace: true });
    }
  }, [cart]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet'>('cash');
  const [showWalletPayment, setShowWalletPayment] = useState(false);
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState<string | null>(null);
  const [address, setAddress] = useState({
    address: '',
    addressAr: '',
    latitude: 30.0444,
    longitude: 31.2357,
  });
  const [notes, setNotes] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const totals = getTotal();

  if (!cart) return null;
  if (user === undefined) return null;

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress({
            ...address,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success("تم تحديد موقعك بنجاح");
          setGettingLocation(false);
        },
        (error) => {
          toast.error("فشل تحديد الموقع. يرجى إدخال العنوان يدوياً");
          setGettingLocation(false);
        }
      );
    } else {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!address.addressAr) {
      toast.error('يرجى إدخال عنوان التوصيل');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        sessionToken,
        storeId: cart.storeId,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color, // إرسال اللون المختار
          selectedSize: item.selectedSize, // المقاس المختار
          imageUrl: item.imageUrl, // إرسال الصورة المختارة
        })),
        deliveryLatitude: address.latitude,
        deliveryLongitude: address.longitude,
        deliveryAddress: address.address || address.addressAr,
        deliveryAddressAr: address.addressAr,
        paymentMethod,
        paymentReceiptImage: paymentMethod === 'wallet' ? paymentReceiptUrl : undefined,
        customerNotes: notes || undefined,
      });

      clearCart();
      toast.success('تم إرسال طلبك بنجاح!');
      navigate(`/customer/order-success/${result.orderId}`);
    } catch (error) {
      let message = 'حدث خطأ أثناء إرسال الطلب';
      
      // معالجة خاصة لـ ConvexError
      if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      // رسائل مخصصة للأخطاء الشائعة
      if (message.includes('غير متوفر حالياً')) {
        message = 'عذراً، هذا المنتج غير متوفر حالياً';
        toast.error(message, {
          duration: 5000,
          action: {
            label: 'حذف من السلة',
            onClick: () => {
              // إزالة المنتجات غير المتوفرة من السلة
              clearCart();
            }
          }
        });
      } else if (message.includes('غير موجود')) {
        message = 'عذراً، أحد المنتجات لم يعد متاحاً';
        toast.error(message);
      } else {
        toast.error(message, {
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">إتمام الطلب</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        {user && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{user.name || 'مستخدم'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Location Tracker - Enhanced Delivery Address */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            🔄 تتبع الموقع الجغرافي وعنوان التوصيل
          </h3>
          
          <LocationTracker 
            onLocationUpdate={(location) => {
              setAddress({
                ...address,
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address || address.address,
                addressAr: location.address || address.addressAr,
              });
            }}
            initialLocation={{
              latitude: address.latitude,
              longitude: address.longitude,
              address: address.address,
            }}
            className="mb-4"
          />
          
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                العنوان بالعربية
              </label>
              <input
                type="text"
                required
                value={address.addressAr}
                onChange={(e) => setAddress({ ...address, addressAr: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="مثال: شارع التحرير، القاهرة"
              />
            </div>

            <button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation}
              className="w-full py-3 bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              {gettingLocation ? 'جاري تحديد الموقع...' : 'تحديد موقعي الحالي'}
            </button>

            {address.latitude !== 30.0444 && (
              <p className="text-xs text-green-600 text-start">
                ✓ تم تحديد الموقع بنجاح
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-600" />
            طريقة الدفع
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                paymentMethod === 'cash'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Banknote className="w-6 h-6 text-orange-600" />
              <div className="text-start flex-1">
                <p className="font-bold text-gray-900">الدفع عند الاستلام</p>
                <p className="text-sm text-gray-600">ادفع نقداً للكابتن</p>
              </div>
              {paymentMethod === 'cash' && (
                <CheckCircle className="w-6 h-6 text-orange-600" />
              )}
            </button>

            <button
              onClick={() => setShowWalletPayment(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                paymentMethod === 'wallet'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Wallet className="w-6 h-6 text-orange-600" />
              <div className="text-start flex-1">
                <p className="font-bold text-gray-900">المحفظة الإلكترونية</p>
                <p className="text-sm text-gray-600">تحويل أموال للمحفظة</p>
              </div>
              {paymentMethod === 'wallet' && (
                <CheckCircle className="w-6 h-6 text-orange-600" />
              )}
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            ملاحظات (اختياري)
          </h3>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            rows={3}
            placeholder="أي ملاحظات للمتجر أو الكابتن..."
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            ملخص الطلب
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-semibold text-gray-900">{(totals.subtotal ?? 0).toFixed(2)} EGP</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">رسوم التوصيل</span>
              <span className="font-semibold text-gray-900">{(totals.deliveryFee ?? 0).toFixed(2)} EGP</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-3 border-t-2 border-gray-200">
              <span className="text-gray-900">الإجمالي</span>
              <span className="text-2xl text-orange-600">{(totals.total ?? 0).toFixed(2)} EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Payment Modal */}
      {showWalletPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <WalletPayment
              onBack={() => setShowWalletPayment(false)}
              amount={totals.total}
              onPaymentComplete={(receiptUrl) => {
                setShowWalletPayment(false);
                setPaymentMethod('wallet');
                setPaymentReceiptUrl(receiptUrl || null);
                handleSubmit();
              }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !address.addressAr}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري إرسال الطلب...' : `تأكيد الطلب - ${(totals.total ?? 0).toFixed(2)} EGP`}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const order = useQuery(api.orders.getOrderById, orderId ? { orderId: orderId as any, sessionToken } : "skip");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال طلبك!</h2>
        <p className="text-gray-600 mb-6">سيتم تحضير طلبك قريباً</p>
        
        {order && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
            <p className="text-xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/customer/orders')}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            متابعة الطلب
          </button>
          <button
            onClick={() => navigate('/customer')}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

function MyOrders() {
  const navigate = useNavigate();
  const { sessionToken, isAuthenticated, user } = useAuth();
  const orders = useQuery(api.orders.getMyOrders, isAuthenticated && sessionToken && user?.profile?._id ? { customerId: user.profile._id } : "skip");
  // Guard to prevent duplicate redirects
  const hasRedirected = useRef(false);

  // إذا لم يكن مسجل دخول، إعادة توجيه لصفحة تسجيل الدخول - FIXED: Only redirect once
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        toast.error('يجب تسجيل الدخول لعرض طلباتك');
        navigate('/customer/login?redirect=/customer/orders', { replace: true });
      }
    }
  }, [user, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/customer')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">طلباتي</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!orders ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بطلب أول وجبة لك!</p>
            <button
              onClick={() => navigate('/customer')}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              تصفح المتاجر
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">رقم الطلب</p>
                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    {getStatusArabic(order.status)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base">{item.nameAr}</h4>
                          <p className="text-sm text-gray-600">{item.name}</p>
                        </div>
                        <span className="font-bold text-orange-600">{item.price * item.quantity} EGP</span>
                      </div>
                      
                      {/* Product Specifications */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">النوع:</span>
                          <span className="font-medium text-gray-700 mr-1">{item.category}</span>
                        </div>
                        {item.color && (
                          <div>
                            <span className="text-gray-500">اللون:</span>
                            <span className="font-medium text-gray-700 mr-1">{item.color}</span>
                          </div>
                        )}
                        {item.size && (
                          <div>
                            <span className="text-gray-500">المقاس:</span>
                            <span className="font-medium text-gray-700 mr-1">{item.size}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">الكمية:</span>
                          <span className="font-medium text-gray-700 mr-1">{item.quantity}</span>
                        </div>
                      </div>
                      
                      {/* Additional Specifications */}
                      {item.materials && item.materials.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">المواد:</span>
                          <span className="font-medium text-gray-700 mr-1">{item.materials.join(', ')}</span>
                        </div>
                      )}
                      
                      {item.origin && (
                        <div className="text-sm">
                          <span className="text-gray-500">المنشأ:</span>
                          <span className="font-medium text-gray-700 mr-1">{item.origin}</span>
                        </div>
                      )}
                      
                      {item.preparationTime && (
                        <div className="text-sm">
                          <span className="text-gray-500">وقت التحضير:</span>
                          <span className="font-medium text-gray-700 mr-1">{item.preparationTime} دقيقة</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600">الإجمالي</span>
                  <span className="text-xl font-bold text-orange-600">{order.total} EGP</span>
                </div>

                {/* التقييمات */}
                {order.status === 'delivered' && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/customer/review/store/${order._id}`)}
                        className="flex-1 bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        تقييم المتجر
                      </button>
                      <button
                        onClick={() => navigate(`/customer/review/products/${order._id}`)}
                        className="flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        تقييم المنتجات
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="orders" />
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const systemSettings = useQuery(api.systemSettings.getSettings);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/customer');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  // إذا لم يكن مسجل دخول، إعادة توجيه لصفحة تسجيل الدخول
  useEffect(() => {
    if (user === null) {
      navigate('/customer/login?redirect=/customer/profile');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.profile?.fullName || user?.name || 'مستخدم'}</h2>
              <p className="text-gray-600">{user?.email || 'guest@example.com'}</p>
              {user?.profile?.phone && (
                <p className="text-sm text-gray-500">{user.profile.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/customer/orders')}
              className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">طلباتي</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/customer')}
              className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">الرئيسية</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-between border-2 border-orange-200"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-600">تغيير كلمة المرور</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-orange-400" />
            </button>

            <button
              onClick={handleSignOut}
              className="w-full p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-between border-2 border-red-200"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-600">تسجيل الخروج</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Contact & Social Media Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">تواصل معنا</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-orange-600" />
              <span>{systemSettings?.supportEmail || 'support@aqraply.com'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 text-orange-600" />
              <span>{systemSettings?.supportPhone || '+20 100 123 4567'}</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-4">
            {systemSettings?.socialLinks?.facebook && (
              <a
                href={systemSettings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {systemSettings?.socialLinks?.twitter && (
              <a
                href={systemSettings.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-400 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {systemSettings?.socialLinks?.instagram && (
              <a
                href={systemSettings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {systemSettings?.socialLinks?.linkedin && (
              <a
                href={systemSettings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="profile" />

      <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
      />
    </div>
  );
}

function BottomNav({ active }: { active: 'home' | 'orders' | 'profile' }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-around">
        <button
          onClick={() => navigate('/customer')}
          className={`flex flex-col items-center gap-1 ${
            active === 'home' ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">الرئيسية</span>
        </button>

        <button
          onClick={() => navigate('/customer/orders')}
          className={`flex flex-col items-center gap-1 ${
            active === 'orders' ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <Package className="w-6 h-6" />
          <span className="text-xs font-semibold">طلباتي</span>
        </button>

        <button
          onClick={() => navigate('/customer/profile')}
          className={`flex flex-col items-center gap-1 ${
            active === 'profile' ? 'text-orange-600' : 'text-gray-600'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-semibold">حسابي</span>
        </button>
      </div>
    </div>
  );
}

function getStatusArabic(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    preparing: "قيد التحضير",
    ready: "جاهز للاستلام",
    picked_up: "تم الاستلام",
    delivering: "قيد التوصيل",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return statusMap[status] || status;
}
