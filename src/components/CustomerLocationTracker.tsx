import { useState, useEffect } from 'react';
import { MapPin, Navigation, Crosshair, Loader2, Store } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

// حساب المسافة بين نقطتين (بالكيلومتر)
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
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

interface CustomerLocationTrackerProps {
  onLocationUpdate: (location: Location) => void;
  initialLocation?: Location;
  className?: string;
}

export function CustomerLocationTracker({ 
  onLocationUpdate, 
  initialLocation, 
  className = '' 
}: CustomerLocationTrackerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);

  // جلب المتاجر القريبة
  const stores = useQuery(api.stores.getActiveStores);

  // تحديث المتاجر القريبة عند تغير الموقع
  useEffect(() => {
    if (currentLocation && stores) {
      const nearby = stores
        .map(store => {
          if (!store.location) return { ...store, distance: Infinity };

          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            store.location.latitude,
            store.location.longitude
          );

          return { ...store, distance };
        })
        .filter(store => store.distance < 10) // المتاجر within 10km
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // أقرب 5 متاجر

      setNearbyStores(nearby);
    }
  }, [currentLocation, stores?.length]);

  // الحصول على الموقع الحالي
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = t('errors.browserNotSupportGeolocation');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsTracking(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);
        onLocationUpdate(location);
        setIsTracking(false);
        toast.success(t('errors.locationDetermined'));
      },
      (error) => {
        setIsTracking(false);
        let errorMsg = t('errors.locationDeterminationFailed');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = t('errors.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = t('errors.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMsg = t('errors.timeout');
            break;
        }

        setError(errorMsg);
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // بدء تتبع الموقع المستمر
  const startTracking = () => {
    if (!navigator.geolocation) {
      const errorMsg = t('errors.browserNotSupportGeolocation');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsTracking(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);
        onLocationUpdate(location);
      },
      (error) => {
        let errorMsg = t('errors.locationTrackingFailed');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = t('errors.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = t('errors.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMsg = t('errors.timeout');
            break;
        }

        setError(errorMsg);
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000, // 5 seconds
      }
    );

    setWatchId(id);
    toast.success(t('errors.trackingStarted'));
  };

  // إيقاف التتبع
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      toast.success(t('errors.trackingStopped'));
    }
  };

  // الحصول على العنوان من الإحداثيات
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || t('errors.addressNotAvailable');
        
        setCurrentLocation(prev => prev ? { ...prev, address } : null);
        onLocationUpdate({ latitude: lat, longitude: lng, address });
        return address;
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  // التحقق من دقة الموقع
  const getAccuracyLevel = (accuracy?: number): { level: string; color: string } => {
    if (!accuracy) return { level: t('errors.undefined'), color: 'text-gray-500' };
    
    if (accuracy < 10) return { level: t('errors.high'), color: 'text-green-600' };
    if (accuracy < 50) return { level: t('errors.medium'), color: 'text-yellow-600' };
    return { level: t('errors.low'), color: 'text-red-600' };
  };

  // تنظيف التتبع عند تفريغ المكون
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const accuracyLevel = getAccuracyLevel(currentLocation?.accuracy);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {t('errors.locationAndNearbyStores')}
        </h3>
        {currentLocation && (
          <span className={`text-xs font-medium ${accuracyLevel.color}`}>
            {t('errors.accuracy')}: {accuracyLevel.level}
          </span>
        )}
      </div>

      {/* معلومات الموقع الحالي */}
      {currentLocation && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">{t('errors.latitude')}:</span>
              <span className="font-mono text-gray-900 mr-1">
                {currentLocation.latitude.toFixed(6)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">{t('errors.longitude')}:</span>
              <span className="font-mono text-gray-900 mr-1">
                {currentLocation.longitude.toFixed(6)}
              </span>
            </div>
            {currentLocation.accuracy && (
              <div>
                <span className="text-gray-600">{t('errors.accuracy')}:</span>
                <span className="text-gray-900 mr-1">
                  ±{currentLocation.accuracy.toFixed(0)}م
                </span>
              </div>
            )}
            {currentLocation.address && (
              <div className="md:col-span-2">
                <span className="text-gray-600">{t('errors.address')}:</span>
                <span className="text-gray-900 mr-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {currentLocation.address}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* المتاجر القريبة */}
      {nearbyStores.length > 0 && (
        <div className="bg-green-50 rounded-lg p-3 mb-3">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-green-600" />
            {t('errors.nearbyStoresWithDistance')}
          </h4>
          <div className="space-y-2">
            {nearbyStores.map((store) => (
              <button
                key={store._id}
                onClick={() => navigate(`/customer/store/${store._id}`)}
                className="w-full flex flex-col items-start text-sm bg-white rounded p-3 hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-3 h-3 text-orange-600" />
                    <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      {store.nameAr}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span className="text-green-600 font-medium">
                      {store.distance.toFixed(1)} {t('errors.km')}
                    </span>
                  </div>
                </div>
                {store.location?.addressAr && (
                  <div className="flex items-start gap-1 text-gray-600 text-xs w-full">
                    <MapPin className="w-2.5 h-2.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{store.location.addressAr}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          onClick={getCurrentLocation}
          disabled={isTracking}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTracking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
          {isTracking ? t('errors.determining') : t('errors.determineLocation')}
        </button>

        {!watchId ? (
          <button
            onClick={startTracking}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {t('errors.startTracking')}
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {t('errors.stopTracking')}
          </button>
        )}

        {currentLocation && (
          <button
            onClick={() => getAddressFromCoords(currentLocation.latitude, currentLocation.longitude)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {t('errors.getAddress')}
          </button>
        )}
      </div>

      {/* حالة التتبع */}
      {watchId !== null && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          {t('errors.trackingActive')}
        </div>
      )}

      {/* إحصائيات المتاجر */}
      {currentLocation && stores && (
        <div className="mt-3 text-sm text-gray-600">
          <p>
            {t('errors.foundNearbyStores', { count: nearbyStores.length })} {t('errors.fromTotalStores', { total: stores.length })}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomerLocationTracker;
