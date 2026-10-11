import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { X, Gift, Store, Sparkles, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";

interface PromotionalPopupProps {
  page?: string;
}

export default function PromotionalPopup({ page }: PromotionalPopupProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const popups = useQuery(api.promotionalPopups.getActivePopups, {
    page: page || location.pathname,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<any>(null);

  // Get image URL using the same pattern as ProductImage
  const imageKey = currentPopup?.imageId || currentPopup?.imageUrl;
  const isDirectUrl = typeof imageKey === "string" && (imageKey.startsWith("http://") || imageKey.startsWith("https://"));
  const resolvedImageUrl = useQuery(
    api.files.getFileUrl,
    imageKey && !isDirectUrl ? { storageId: imageKey } : "skip"
  );
  const imageUrl = isDirectUrl ? imageKey : resolvedImageUrl;

  useEffect(() => {
    if (!popups || popups.length === 0) {
      // No popups available, do nothing
      return;
    }

    // Get active popups with rotation mode enabled
    const rotationPopups = popups.filter(p => p.rotationMode === true);
    const regularPopups = popups.filter(p => p.rotationMode !== true);

    // If no rotation popups, use regular priority logic
    if (rotationPopups.length === 0) {
      const sortedPopups = [...regularPopups].sort((a, b) => b.priority - a.priority);
      const popup = sortedPopups[0];

      if (!popup) return;

      const checkPopup = () => {
        const storageKey = `popup-${popup._id}`;

        if (popup.showOnce) {
          const hasSeen = localStorage.getItem(storageKey);
          if (!hasSeen) {
            return true;
          }
          return false;
        }

        if (popup.showDaily) {
          const lastSeen = localStorage.getItem(`${storageKey}-date`);
          const today = new Date().toDateString();
          if (lastSeen !== today) {
            return true;
          }
          return false;
        }

        return true;
      };

      if (checkPopup()) {
        setCurrentPopup(popup);
        const timer = setTimeout(() => {
          setIsVisible(true);
          setIsAnimating(true);
        }, popup.delay);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Rotation logic: get the next popup in rotation
    const rotationKey = 'popup-rotation-index';
    const rotationIndex = parseInt(localStorage.getItem(rotationKey) || '0');
    const sortedRotationPopups = [...rotationPopups].sort((a, b) => b.priority - a.priority);
    const nextPopup = sortedRotationPopups[rotationIndex % sortedRotationPopups.length];

    if (!nextPopup) return;

    const checkPopup = () => {
      const storageKey = `popup-${nextPopup._id}`;

      if (nextPopup.showOnce) {
        const hasSeen = localStorage.getItem(storageKey);
        if (!hasSeen) {
          return true;
        }
        return false;
      }

      if (nextPopup.showDaily) {
        const lastSeen = localStorage.getItem(`${storageKey}-date`);
        const today = new Date().toDateString();
        if (lastSeen !== today) {
          return true;
        }
        return false;
      }

      return true;
    };

    if (checkPopup()) {
      setCurrentPopup(nextPopup);
      // Update rotation index for next time
      localStorage.setItem(rotationKey, String((rotationIndex + 1) % sortedRotationPopups.length));

      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, nextPopup.delay);
      return () => clearTimeout(timer);
    }
  }, [popups, page, location.pathname]);

  const handleClose = () => {
    if (!currentPopup) return;

    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);

    const storageKey = `popup-${currentPopup._id}`;

    if (currentPopup.showOnce) {
      localStorage.setItem(storageKey, 'true');
    }

    if (currentPopup.showDaily) {
      localStorage.setItem(`${storageKey}-date`, new Date().toDateString());
    }
  };

  const handleCTA = () => {
    if (!currentPopup) return;

    console.log('CTA clicked');
    console.log('Popup data:', currentPopup);
    console.log('CTA Link:', currentPopup.ctaLink);
    console.log('Navigate function:', typeof navigate);

    // Extract path from full URL if present
    let targetLink = currentPopup.ctaLink;
    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      try {
        const url = new URL(targetLink);
        targetLink = url.pathname;
        console.log('Extracted path from URL:', targetLink);
      } catch (e) {
        console.error('Error parsing URL:', e);
      }
    }

    handleClose();
    setTimeout(() => {
      console.log('About to navigate to:', targetLink);
      try {
        navigate(targetLink);
        console.log('Navigation executed successfully');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 300);
  };

  if (!isVisible || !currentPopup) return null;

  const isArabic = i18n.language === 'ar';
  const title = isArabic && currentPopup.titleAr ? currentPopup.titleAr : currentPopup.title;
  const description = isArabic && currentPopup.descriptionAr ? currentPopup.descriptionAr : currentPopup.description;
  const ctaText = isArabic && currentPopup.ctaTextAr ? currentPopup.ctaTextAr : currentPopup.ctaText;
  const backgroundColor = currentPopup.backgroundColor || 'from-orange-500 to-red-600';

  const getDefaultIcon = () => {
    switch (currentPopup.iconType) {
      case 'merchant-signup':
        return <Store className="w-6 h-6 text-white" />;
      case 'giveaway':
        return <Gift className="w-6 h-6 text-white" />;
      case 'discount':
        return <Tag className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={`bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className={`relative h-48 bg-gradient-to-br ${backgroundColor}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {getDefaultIcon()}
              </div>
            </div>
          )}

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${backgroundColor} rounded-full flex items-center justify-center shadow-lg`}>
              {getDefaultIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
          </div>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {description}
          </p>

          <button
            onClick={handleCTA}
            className={`w-full py-4 bg-gradient-to-r ${backgroundColor} text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg`}
          >
            {ctaText}
          </button>

          <button
            onClick={handleClose}
            className="w-full py-3 mt-3 text-gray-500 font-semibold hover:text-gray-700 transition-all hover:bg-gray-50 rounded-xl"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
