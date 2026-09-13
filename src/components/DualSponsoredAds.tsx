import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

interface Product {
  _id: string;
  nameAr: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  images?: string[];
  storeId: string;
  rating?: number;
}

interface DualSponsoredAdsProps {
  products: Product[];
  isSideLayout?: boolean; // New prop to indicate side layout
}

export default function DualSponsoredAds({ products, isSideLayout = false }: DualSponsoredAdsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const isArabic = i18n.language === 'ar';
  
  // Split products into two groups for side-by-side display
  const leftProducts = products.filter((_, index) => index % 2 === 0);
  const rightProducts = products.filter((_, index) => index % 2 === 1);
  
  const saveProductView = useMutation(api.browsingHistory.saveProductView);

  // Side layout: vertical carousel with all ads
  if (isSideLayout) {
    return (
      <VerticalSponsoredCarousel 
        products={products} 
        isArabic={isArabic}
        navigate={navigate}
        saveProductView={saveProductView}
        sessionToken={sessionToken}
      />
    );
  }

  // Regular layout: side-by-side dual cards
  return (
    <div className="w-full flex flex-row-reverse gap-4 pr-[50px]">
      {/* Left Card */}
      <SponsoredCard 
        products={leftProducts} 
        isArabic={isArabic}
        navigate={navigate}
        saveProductView={saveProductView}
        sessionToken={sessionToken}
      />
      
      {/* Right Card */}
      <SponsoredCard 
        products={rightProducts} 
        isArabic={isArabic}
        navigate={navigate}
        saveProductView={saveProductView}
        sessionToken={sessionToken}
      />
    </div>
  );
}

interface VerticalSponsoredCarouselProps {
  products: Product[];
  isArabic: boolean;
  navigate: any;
  saveProductView: any;
  sessionToken: string | null;
}

function VerticalSponsoredCarousel({ products, isArabic, navigate, saveProductView, sessionToken }: VerticalSponsoredCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const handleProductClick = (product: Product) => {
    navigate(`/customer/store/${product.storeId}`);
    saveProductView({ productId: product._id, sessionId: sessionToken });
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (products.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % products.length;
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const cards = container.children;
          if (cards[nextIndex]) {
            cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [products.length, isPaused]);

  // Update scroll button states
  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        setCanScrollUp(container.scrollTop > 0);
        setCanScrollDown(
          container.scrollTop + container.clientHeight < container.scrollHeight - 10
        );
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [products]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.children;

      if (direction === 'up') {
        const newIndex = Math.max(0, currentIndex - 1);
        if (cards[newIndex]) {
          cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setCurrentIndex(newIndex);
        }
      } else {
        const newIndex = Math.min(products.length - 1, currentIndex + 1);
        if (cards[newIndex]) {
          cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setCurrentIndex(newIndex);
        }
      }
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-white/40 h-full flex flex-col focus-within:ring-2 focus-within:ring-orange-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/95 to-orange-900/95 backdrop-blur-sm px-3 py-2 border-b border-orange-300/30 flex-shrink-0">
        <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg w-fit">
          ⭐ إعلانات ممولة
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={() => handleScroll('up')}
          disabled={!canScrollUp}
          className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            canScrollUp
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="السابق"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleScroll('down')}
          disabled={!canScrollDown}
          className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            canScrollDown
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="التالي"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto scrollbar-hide-vertical"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product)}
              className="flex-shrink-0 p-2 cursor-pointer group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-orange-300">
                {/* Product Image */}
                <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                  <ProductImage
                    product={product}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge */}
                  {product.rating && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                    </div>
                  )}

                  {/* Sponsored Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                    ممول
                  </div>

                  {/* Price Badge on Image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-orange-200">
                    {product.price ? (
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-orange-600">{product.price}</span>
                        <span className="text-xs text-gray-600 font-medium">EGP</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-500">اتصل للسعر</span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-2">
                  <h3 className="font-bold text-gray-900 text-xs mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {isArabic ? product.nameAr : product.name}
                  </h3>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.originalPrice} EGP
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 pb-3 flex-shrink-0">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const cards = container.children;
                if (cards[index]) {
                  cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }
            }}
            className={`h-2 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              index === currentIndex
                ? 'w-8 bg-orange-500 shadow-orange-300'
                : 'w-2 bg-orange-200 hover:bg-orange-300 hover:shadow-sm'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface SponsoredCardProps {
  products: Product[];
  isArabic: boolean;
  navigate: any;
  saveProductView: any;
  sessionToken: string | null;
}

function SponsoredCard({ products, isArabic, navigate, saveProductView, sessionToken }: SponsoredCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleProductClick = (product: Product) => {
    navigate(`/customer/store/${product.storeId}`);
    saveProductView({ productId: product._id, sessionId: sessionToken });
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (products.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % products.length;
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const cards = container.children;
          if (cards[nextIndex]) {
            cards[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
          }
        }
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [products.length, isPaused]);

  // Update scroll button states
  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft + container.clientWidth < container.scrollWidth - 10
        );
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.children;

      if (direction === 'left') {
        const newIndex = Math.max(0, currentIndex - 1);
        if (cards[newIndex]) {
          cards[newIndex].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
          setCurrentIndex(newIndex);
        }
      } else {
        const newIndex = Math.min(products.length - 1, currentIndex + 1);
        if (cards[newIndex]) {
          cards[newIndex].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
          setCurrentIndex(newIndex);
        }
      }
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-[360px] h-[500px] bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden shadow-xl border border-orange-200 flex-shrink-0 focus-within:ring-2 focus-within:ring-orange-500">
      {/* Header - Dark Brown/Burgundy Semi-transparent */}
      <div className="bg-gradient-to-r from-red-900/90 to-orange-900/90 backdrop-blur-sm px-3 py-2 border-b border-orange-300/30">
        <div className="flex items-center justify-between">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            ⭐ إعلانات ممولة
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                canScrollLeft
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                canScrollRight
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product)}
              className="flex-shrink-0 w-full h-full p-3 cursor-pointer group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex flex-col items-center">
                {/* Product Image */}
                <div className="relative w-full max-w-[280px] aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-orange-300">
                  <ProductImage
                    product={product}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge */}
                  {product.rating && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                    </div>
                  )}

                  {/* Sponsored Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                    ممول
                  </div>

                  {/* Price Badge on Image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-orange-200">
                    {product.price ? (
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-orange-600">{product.price}</span>
                        <span className="text-xs text-gray-600 font-medium">EGP</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-500">اتصل للسعر</span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="w-full max-w-[280px] mt-2 text-center">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {isArabic ? product.nameAr : product.name}
                  </h3>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.originalPrice} EGP
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 pb-3">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (scrollContainerRef.current) {
                  const container = scrollContainerRef.current;
                  const cards = container.children;
                  if (cards[index]) {
                    cards[index].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
                  }
                }
              }}
              className={`h-2 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                index === currentIndex
                  ? 'w-8 bg-orange-500 shadow-orange-300'
                  : 'w-2 bg-orange-200 hover:bg-orange-300 hover:shadow-sm'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}