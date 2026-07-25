import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  onLocationFound: (latitude: number, longitude: number) => void;
  className?: string;
}

export default function LocationButton({ onLocationFound, className = "" }: LocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'فشل في تحديد الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض إذن الوصول للموقع';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return (
    <button
      onClick={handleGetLocation}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <MapPin className="w-5 h-5" />
      )}
      <span>{isLoading ? 'جاري تحديد الموقع...' : 'تحديد موقعي'}</span>
      {error && (
        <span className="text-xs text-red-200 ml-2">{error}</span>
      )}
    </button>
  );
}
