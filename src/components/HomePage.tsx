import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import LocationTracker from "./LocationTracker";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContextNew";
import { normalizeArabicText } from "../lib/utils";
import {
  Store,
  Search,
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  Wallet,
  Menu,
  X,
  ShoppingCart,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { useTranslation } from "react-i18next";


export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(t('errors.todaysOffers'));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  const [searchFilteredProducts, setSearchFilteredProducts] = useState<any[]>([]);
  const [displayStats, setDisplayStats] = useState({
    stores: 0,
    orders: 0,
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([t('errors.todaysOffers')]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const productsRef = useRef<HTMLElement>(null);

  // Fetch data
  const { sessionToken } = useAuth();
  const stores = useQuery(api.stores.getActiveStores);
  const allProducts = useQuery(api.products.getAllProductsWithImages, {
    availableOnly: false,
    ...(sessionToken && { sessionToken }),
  }) || [];
  const systemSettings = useQuery(api.systemSettings.getSettings);
  
  // Mutations for seeding/updating products with images
  const seedProducts = useMutation(api.products.seedProductsWithImages);
  const updateProductImages = useMutation(api.products.updateAllProductsWithImages);
  const [imagesUpdated, setImagesUpdated] = useState(false);

  // تحديث الصور تلقائياً عند جلب المنتجات لأول مرة
  useEffect(() => {
    if (
      !imagesUpdated &&
      allProducts.length > 0 &&
      allProducts.some((product) => !product.imageUrl && (!product.images || product.images.length === 0))
    ) {
      updateProductImages()
        .then(() => setImagesUpdated(true))
        .catch((error) => {
          console.error("خطأ في تحديث الصور تلقائياً:", error);
          setImagesUpdated(true);
        });
    }
  }, [allProducts?.length, imagesUpdated, updateProductImages]);

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

  // Animate stats on mount
  useEffect(() => {
    if (!stores) return;

    const storeCount = stores.length || 0;
    const orderCount = 10000; // Fixed daily orders estimate

    let storeAnimationFrame = 0;
    let orderAnimationFrame = 0;
    const animationDuration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
      const easedProgress = easeOutQuad(progress);

      setDisplayStats({
        stores: Math.floor(storeCount * easedProgress),
        orders: Math.floor(orderCount * easedProgress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [stores?.length]);

  // Scroll to products section when category changes
  useEffect(() => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCategory]);

  // Filter products by store category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === t('errors.todaysOffers')) {
      return allProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Get stores with the selected category
    const storesInCategory = stores.filter(s => s.category === selectedCategory);
    
    if (storesInCategory.length === 0) return [];

    // Get all products from stores in this category
    const storeIds = storesInCategory.map(s => s._id);
    return allProducts.filter(p => storeIds.includes(p.storeId));
  }, [selectedCategory, allProducts, stores, t]);

  // Handle location search
  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchLocation(searchTerm);

    if (!stores || !allProducts) return;

    if (searchTerm.trim() === "") {
      setFilteredStores([]);
      setSearchFilteredProducts([]);
      return;
    }

    // Filter stores by name or address
    const filteredStores = stores.filter(
      (store: any) =>
        normalizeArabicText(store.nameAr || '').includes(normalizeArabicText(searchTerm)) ||
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        normalizeArabicText(store.location?.addressAr || '').includes(normalizeArabicText(searchTerm)) ||
        store.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter products by name or category
    const filteredProducts = allProducts.filter(
      (product: any) =>
        normalizeArabicText(product.nameAr || '').includes(normalizeArabicText(searchTerm)) ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        normalizeArabicText(product.category || '').includes(normalizeArabicText(searchTerm))
    );

    setFilteredStores(filteredStores);
    setSearchFilteredProducts(filteredProducts);
    
    // Show first matching store or product at top
    if (filteredStores.length > 0) {
      // Move first matching store to top of stores list
      const firstStore = filteredStores[0];
      // You can add logic here to highlight or promote this store
    }
    
    if (filteredProducts.length > 0) {
      // You can add logic here to show first matching product prominently
      const firstProduct = filteredProducts[0];
      // You can add logic here to highlight or promote this product
    }
  };

  // Handle store navigation from search results
  const handleStoreSelect = (storeId: string) => {
    navigate(`/customer/store/${storeId}`);
    setSearchLocation("");
    setFilteredStores([]);
  };

  // Scroll categories
  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("categories-scroll");
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      setScrollPosition(newPosition);
      container.scrollLeft = newPosition;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Aqraply Logo" className="h-24 w-auto" />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/customer")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {t('errors.stores')}
              </button>
              <button
                onClick={() => navigate("/merchant")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {t('errors.merchantDashboardHome')}
              </button>
              <button
                onClick={() => navigate("/captain")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {t('errors.captainInterface')}
              </button>
              {/* رابط الإدارة مخفي - يمكن الوصول له عبر /admin-login */}
              {/* <button
                onClick={() => navigate("/admin")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                لوحة الإدارة
              </button> */}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium hidden md:block text-sm"
              >
                {t('errors.login')}
              </button>
              <button
                onClick={() => navigate("/customer")}
                className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
              >
                {t('errors.startNow')}
              </button>
              <button
                className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-orange-100 bg-white">
            <nav className="flex flex-col p-4 gap-2">
              <button
                onClick={() => navigate("/customer")}
                className="px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors text-start"
              >
                {t('errors.stores')}
              </button>
              <button
                onClick={() => navigate("/merchant")}
                className="px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors text-start"
              >
                {t('errors.merchantDashboardHome')}
              </button>
              <button
                onClick={() => navigate("/captain")}
                className="px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors text-start"
              >
                {t('errors.captainInterface')}
              </button>
              {/* رابط الإدارة مخفي - يمكن الوصول له عبر /admin-login */}
              {/* <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors text-start"
              >
                لوحة الإدارة
              </button> */}
            </nav>
          </div>
        )}
      </header>

      {/* Categories Bar - Sticky at Top */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto" dir="ltr">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              id="categories-scroll"
              className="flex-1 overflow-x-auto scrollbar-hide"
              dir={document.documentElement.dir === "rtl" ? "rtl" : "ltr"}
            >
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

            <button
              onClick={() => handleScroll("right")}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-orange-700">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/7362569/7362569-hd_1920_1080_24fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {/* Gradient overlay - Light Red */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-800/50 via-red-700/45 to-orange-800/50"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl w-full">
              {/* Main heading - Always Visible */}
              <h1 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight drop-shadow-2xl" style={{textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
                {t('errors.discoverNearbyStores')} <br />
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl" style={{textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
                  {t('errors.nearbyStores')}
                </span>
              </h1>

              {/* Description - Always Visible */}
              <p className="text-xs md:text-sm text-white mb-4 leading-relaxed font-semibold drop-shadow-lg" style={{textShadow: '0 3px 15px rgba(0,0,0,0.7)'}}>
                {t('errors.smartPlatform')}
              </p>
              <p className="text-xs md:text-xs text-white mb-6 font-semibold drop-shadow-lg" style={{textShadow: '0 3px 15px rgba(0,0,0,0.7)'}}>
                {t('errors.orderNow')}
              </p>

              {/* Search Bar - Always Visible */}
              <div className="relative max-w-xl mb-8">
                <div className="bg-white rounded-2xl shadow-2xl p-2.5 flex items-center gap-2 hover:shadow-3xl transition-shadow" style={{boxShadow: '0 10px 40px rgba(0,0,0,0.25)'}}>
                  <MapPin className="w-5 h-5 text-orange-600 ms-3 flex-shrink-0 font-bold" />
                  <input
                    type="text"
                    placeholder={t('errors.enterLocation')}
                    className="flex-1 px-3 py-2.5 outline-none text-gray-700 text-sm font-semibold placeholder-gray-500"
                    value={searchLocation}
                    onChange={handleLocationSearch}
                  />
                  <button
                    onClick={() => navigate("/customer")}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 flex-shrink-0 drop-shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {searchLocation && (filteredStores.length > 0 || searchFilteredProducts.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-40">
                    {filteredStores.length > 0 && (
                      <div className="border-b border-gray-200">
                        <div className="px-6 py-2 bg-orange-50 text-orange-700 font-bold text-sm">
                          المتاجر ({filteredStores.length})
                        </div>
                        {filteredStores.map((store) => (
                          <button
                            key={store._id}
                            onClick={() => handleStoreSelect(store._id)}
                            className="w-full px-6 py-4 text-right hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-start">
                                <h4 className="font-bold text-gray-900">{store.nameAr}</h4>
                                <p className="text-sm text-gray-600">{store.location?.addressAr}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-semibold text-sm">{store.rating}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchFilteredProducts.length > 0 && (
                      <div>
                        <div className="px-6 py-2 bg-blue-50 text-blue-700 font-bold text-sm">
                          المنتجات ({searchFilteredProducts.length})
                        </div>
                        {searchFilteredProducts.slice(0, 5).map((product) => (
                          <button
                            key={product._id}
                            onClick={() => handleStoreSelect(product.storeId)}
                            className="w-full px-6 py-3 text-right hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-start">
                                <h4 className="font-bold text-gray-900 text-sm">{product.nameAr}</h4>
                                <p className="text-xs text-gray-600">{product.category}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-orange-600">{product.price} EGP</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {searchLocation && filteredStores.length === 0 && searchFilteredProducts.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-6 text-center z-40">
                    <p className="text-gray-600">{t('errors.noStoresFound')}</p>
                  </div>
                )}
              </div>

              {/* Animated Stats - Always Visible */}
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {/* Stores Card */}
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-yellow-400/40 rounded-xl blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/40 hover:border-white/60 transition-all hover:bg-white/25 shadow-2xl" style={{boxShadow: '0 8px 32px rgba(0,0,0,0.3)'}}>
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        <span className="text-3xl md:text-4xl font-black text-white tabular-nums drop-shadow-lg" style={{textShadow: '0 3px 10px rgba(0,0,0,0.6)'}}>
                          {displayStats.stores}
                        </span>
                        <span className="text-2xl text-yellow-300 font-black drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>+</span>
                      </div>
                      <div className="text-white text-xs md:text-xs font-bold drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{t('customer.home.stores')}</div>
                    </div>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-xl blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/40 hover:border-white/60 transition-all hover:bg-white/25 shadow-2xl" style={{boxShadow: '0 8px 32px rgba(0,0,0,0.3)'}}>
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        <span className="text-3xl md:text-4xl font-black text-white tabular-nums drop-shadow-lg" style={{textShadow: '0 3px 10px rgba(0,0,0,0.6)'}}>
                          {(displayStats.orders / 1000).toFixed(1)}
                        </span>
                        <span className="text-xl text-yellow-300 font-black drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>K</span>
                      </div>
                      <div className="text-white text-xs md:text-xs font-bold drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{t('customer.home.orders')}</div>
                    </div>
                  </div>
                </div>

                {/* Delivery Time Card */}
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-xl blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/40 hover:border-white/60 transition-all hover:bg-white/25 shadow-2xl" style={{boxShadow: '0 8px 32px rgba(0,0,0,0.3)'}}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-5 h-5 text-yellow-300 drop-shadow-lg" style={{filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))'}} />
                        <span className="text-3xl md:text-4xl font-black text-white drop-shadow-lg" style={{textShadow: '0 3px 10px rgba(0,0,0,0.6)'}}>15</span>
                      </div>
                      <div className="text-white text-xs md:text-xs font-bold drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{t('errors.minute')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Sections */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* عروض اليوم */}
            {allProducts.filter(p => p.originalPrice && p.originalPrice > p.price).length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 {t('errors.todaysOffers')}</h2>
                  <p className="text-gray-600">{t('errors.enjoyBestDiscounts')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {allProducts.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 8).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/customer/store/${product.storeId}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-red-300"
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
                        <div className="pt-3 border-t border-gray-100 space-y-2 mt-auto">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-red-600">{product.price}</span>
                            <span className="text-xs text-gray-600">EGP</span>
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">{product.originalPrice} EGP</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* أفضل المنتجات */}
            {allProducts.filter(p => p.price < 500).length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">⭐ {t('errors.bestProducts')}</h2>
                  <p className="text-gray-600">{t('errors.trustedProducts')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {allProducts.filter(p => p.price < 500).slice(0, 8).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/customer/store/${product.storeId}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-yellow-300"
                    >
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
                        <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                          ⭐ {t('errors.selected')}
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col">
                        <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
                          {isArabic ? product.nameAr : product.name}
                        </h4>
                        <div className="pt-3 border-t border-gray-100 space-y-2 mt-auto">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-orange-600">{product.price}</span>
                            <span className="text-xs text-gray-600">EGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الأكثر مبيعا */}
            {allProducts.filter(p => p.images && p.images.length > 1).length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">🔥 {t('errors.bestSelling')}</h2>
                  <p className="text-gray-600">{t('errors.millionsChose')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {allProducts.filter(p => p.images && p.images.length > 1).slice(0, 8).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/customer/store/${product.storeId}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-green-300"
                    >
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
                        <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                          🔥 {t('errors.famous')}
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col">
                        <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
                          {isArabic ? product.nameAr : product.name}
                        </h4>
                        <div className="pt-3 border-t border-gray-100 space-y-2 mt-auto">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-orange-600">{product.price}</span>
                            <span className="text-xs text-gray-600">EGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المنتجات الجديدة */}
            {allProducts.length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">✨ {t('errors.newProducts')}</h2>
                  <p className="text-gray-600">{t('errors.latestAdditions')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {allProducts.sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0)).slice(0, 8).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/customer/store/${product.storeId}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-blue-300"
                    >
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
                        <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute top-3 right-3 bg-blue-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                          {t('errors.new')}
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col">
                        <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
                          {isArabic ? product.nameAr : product.name}
                        </h4>
                        <div className="pt-3 border-t border-gray-100 space-y-2 mt-auto">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-orange-600">{product.price}</span>
                            <span className="text-xs text-gray-600">EGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section ref={productsRef} className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory}
              </h2>
              <p className="text-gray-600">
                {t('errors.exploreBestProducts')}
              </p>
            </div>

            {!filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">
                  {t('errors.noProductsInCategory')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.slice(0, 12).map((product) => (
                  <div
                    key={product._id}
                    onClick={() =>
                      navigate(`/customer/store/${product.storeId}`)
                    }
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-gray-100 hover:border-orange-200"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-40 bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
                      <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}

                      {/* Image Counter */}
                      {product.images && product.images.length > 1 && (
                        <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          {product.images.length} {t('errors.images')}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-4 flex flex-col">
                      <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm mb-1">
                        {product.nameAr}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-3 flex-1">
                        {product.descriptionAr}
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Nearby Stores Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('errors.discoverNearbyStoresSection')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('errors.bestLocalStores')}
              </p>
            </div>

            {!stores || stores.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <Store className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">
                  {t('errors.noStoresAvailable')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stores.map((store) => (
                  <button
                    key={store._id}
                    onClick={() => navigate(`/customer/store/${store._id}`)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all overflow-hidden text-right group border border-gray-100 hover:border-orange-200"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
                      {store.imageUrl ? (
                        <img
                          src={store.imageUrl}
                          alt={store.nameAr}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <Store className="w-20 h-20 text-orange-400" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {store.nameAr}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                        {store.descriptionAr}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{store.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">
                            {store.estimatedDeliveryTime} {t('errors.minute')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">{t('errors.delivery')}</span>
                          <span className="text-lg font-bold text-orange-600">
                            {store.deliveryFee} EGP
                          </span>
                        </div>
                        <span className="px-3.5 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-200">
                          {store.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Platform Interfaces */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('errors.fourInterfacePlatform')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('errors.servesAllParties')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <button
                onClick={() => navigate("/customer")}
                className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 text-start"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('errors.customerInterface')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t('errors.browseStores')}
                </p>
                <div className="text-blue-600 font-semibold flex items-center gap-2">
                  {t('errors.startShopping')}
                  <TrendingUp className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => navigate("/merchant")}
                className="group p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 text-start"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('errors.merchantDashboardHome')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t('errors.manageStoreProducts')}
                </p>
                <div className="text-orange-600 font-semibold flex items-center gap-2">
                  {t('errors.manageStore')}
                  <TrendingUp className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => navigate("/captain")}
                className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 text-start"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('errors.captainInterface')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t('errors.receiveOrders')}
                </p>
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  {t('errors.startDelivery')}
                  <TrendingUp className="w-4 h-4" />
                </div>
              </button>

              {/* رابط الإدارة مخفي - يمكن الوصول له عبر /admin-login */}
              {/* <button
                onClick={() => navigate("/admin")}
                className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 text-start"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  لوحة الإدارة
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  تحكم كامل، تقارير تفصيلية، ومراقبة شاملة
                </p>
                <div className="text-purple-600 font-semibold flex items-center gap-2">
                  لوحة التحكم
                  <TrendingUp className="w-4 h-4" />
                </div>
              </button> */}
            </div>
          </div>
        </section>

        {/* Location Tracker Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('errors.locationTracking')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('errors.locationTrackingDesc')}
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <LocationTracker 
                onLocationUpdate={(location) => {
                  setUserLocation(location);
                  // تحديث المتاجر القريبة بناءً على الموقع
                  if (stores) {
                    const nearbyStores = stores.filter(store => {
                      if (!store.location || !location.address) return true; // إذا لم يكن هناك عنوان، اعرض المتجر
                      // حساب المسافة (يمكن إضافة منطق أكثر تعقيداً هنا)
                      return true; // حالياً نعرض جميع المتاجر
                    });
                    setFilteredStores(nearbyStores);
                  }
                }}
                className="w-full"
              />
            </div>

            {userLocation && (
              <div className="mt-8 text-center">
                <p className="text-green-600 font-medium">
                  {t('errors.locationSetSuccess')}
                </p>
                <button
                  onClick={() => navigate("/customer")}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {t('errors.exploreNearbyStores')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Aqraply</h3>
                    <p className="text-sm text-gray-400">أقربلي</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  {t('errors.smartPlatform')}
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-start">{t('errors.quickLinks')}</h4>
                <ul className="space-y-2 text-start">
                  <li>
                    <button
                      onClick={() => navigate("/customer")}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {t('errors.stores')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/merchant")}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {t('errors.merchantDashboardHome')}
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-start">{t('errors.more')}</h4>
                <ul className="space-y-2 text-start">
                  <li>
                    <button
                      onClick={() => navigate("/captain")}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {t('errors.captainInterface')}
                    </button>
                  </li>
                  {/* رابط الإدارة مخفي - يمكن الوصول له عبر /admin-login */}
                  {/* <li>
                    <button
                      onClick={() => navigate("/admin")}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      لوحة الإدارة
                    </button>
                  </li> */}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-start">{t('errors.contact')}</h4>
                <p className="text-gray-400 text-sm">
                  {t('errors.emailLabel')}: {systemSettings?.supportEmail || 'support@aqraply.com'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {t('errors.phoneLabel')}: {systemSettings?.supportPhone || '+20 100 123 4567'}
                </p>
                
                {/* Social Media Links */}
                <div className="flex gap-4 mt-4">
                  {systemSettings?.socialLinks?.facebook && (
                    <a
                      href={systemSettings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {systemSettings?.socialLinks?.twitter && (
                    <a
                      href={systemSettings.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {systemSettings?.socialLinks?.instagram && (
                    <a
                      href={systemSettings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {systemSettings?.socialLinks?.linkedin && (
                    <a
                      href={systemSettings.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                {t('errors.allRightsReserved')}
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
