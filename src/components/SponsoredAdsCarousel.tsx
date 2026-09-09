import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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

interface SponsoredAdsCarouselProps {
  products: Product[];
  isMobile?: boolean;
  isFullWidth?: boolean;
}

export default function SponsoredAdsCarousel({ products, isMobile = false, isFullWidth = false }: SponsoredAdsCarouselProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const isArabic = i18n.language === 'ar';
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  
  const saveProductView = useMutation(api.browsingHistory.saveProductView);

  // Card dimensions based on mobile/desktop/fullWidth
  const cardWidth = isFullWidth ? 350 : (isMobile ? 140 : 180);
  const cardHeight = isFullWidth ? 450 : (isMobile ? 220 : 280);
  const imageHeight = isFullWidth ? 300 : (isMobile ? 110 : 140);
  const gap = isFullWidth ? 24 : (isMobile ? 8 : 12);

  // Auto-scroll functionality
  useEffect(() => {
    const minProducts = isFullWidth ? 3 : (isMobile ? 2 : 2);
    if (products.length <= minProducts || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = cardWidth + gap;
        
        // Check if we can scroll further
        if (container.scrollLeft + container.clientWidth < container.scrollWidth - 10) {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
          // Scroll back to start
          container.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [products.length, isPaused, cardWidth, gap, isMobile, isFullWidth]);

  // Update scroll button states and current index
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = cardWidth + gap;
      
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 10
      );
      
      // Calculate current index based on scroll position
      const newIndex = Math.round(container.scrollLeft / scrollAmount);
      setCurrentScrollIndex(newIndex);
    }
  };

  useEffect(() => {
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
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/customer/store/${product.storeId}`);
    saveProductView({ productId: product._id, sessionId: sessionToken });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`relative bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl ${isFullWidth ? 'p-6' : (isMobile ? 'p-3' : 'p-4')} shadow-lg border border-orange-100 ${isMobile ? '' : 'h-full flex flex-col'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`${isFullWidth ? 'text-2xl' : (isMobile ? 'text-base' : 'text-lg')} font-bold text-gray-900 mb-0.5`}>⭐ إعلانات ممولة</h2>
          <p className="text-gray-600 text-xs">منتجات ممولة من قبل التجار</p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition-all ${
              canScrollLeft
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronRight className={`${isFullWidth ? 'w-6 h-6' : (isMobile ? 'w-3 h-3' : 'w-4 h-4')}`} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition-all ${
              canScrollRight
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronLeft className={`${isFullWidth ? 'w-6 h-6' : (isMobile ? 'w-3 h-3' : 'w-4 h-4')}`} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto scrollbar-hide ${isMobile ? '' : 'flex-1'}`}
        style={{ 
          gap: `${gap}px`,
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
            className={`flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-300 group`}
            style={{ 
              width: `${cardWidth}px`, 
              height: `${cardHeight}px`,
              scrollSnapAlign: 'start' 
            }}
          >
            {/* Product Image */}
            <div className="relative w-full bg-gray-100 overflow-hidden" style={{ height: `${imageHeight}px` }}>
              <ProductImage
                product={product}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1.5 rounded-lg ${isFullWidth ? 'text-sm' : (isMobile ? 'text-[10px]' : 'text-xs')} font-bold shadow-md`}>
                ممول
              </div>
              
              {/* Rating Badge */}
              {product.rating && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <Star className={`${isFullWidth ? 'w-4 h-4' : (isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3')} text-yellow-500 fill-yellow-500`} />
                  <span className={`${isFullWidth ? 'text-sm' : (isMobile ? 'text-[10px]' : 'text-xs')} font-bold text-gray-800`}>{product.rating}</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={`p-4 flex flex-col flex-1`}>
              <h4 className={`font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors ${isFullWidth ? 'text-base' : (isMobile ? 'text-[10px]' : 'text-xs')} mb-3`} style={{ minHeight: isFullWidth ? '40px' : (isMobile ? '24px' : '32px') }}>
                {isArabic ? product.nameAr : product.name}
              </h4>
              
              <div className="mt-auto space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className={`${isFullWidth ? 'text-2xl' : (isMobile ? 'text-sm' : 'text-lg')} font-bold text-orange-600`}>{product.price}</span>
                  <span className={`${isFullWidth ? 'text-sm' : (isMobile ? 'text-[10px]' : 'text-xs')} text-gray-600`}>EGP</span>
                </div>
                
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className={`${isFullWidth ? 'text-sm' : (isMobile ? 'text-[10px]' : 'text-xs')} text-gray-400 line-through`}>
                    {product.originalPrice} EGP
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="mt-4 flex justify-center gap-2">
        {products.map((_, index) => (
          <div
            key={index}
            className="h-1.5 rounded-full bg-orange-200 transition-all"
            style={{
              width: index === currentScrollIndex ? '24px' : '8px',
              backgroundColor: index === currentScrollIndex ? '#f97316' : '#fed7aa',
            }}
          />
        ))}
      </div>
    </div>
  );
}