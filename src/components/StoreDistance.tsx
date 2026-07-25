import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';

interface StoreDistanceProps {
  distance?: number;
  store: {
    _id: string;
    nameAr: string;
    descriptionAr: string;
    rating: number;
    estimatedDeliveryTime: number;
    deliveryFee: number;
    category: string;
    imageUrl?: string;
  };
  onClick: () => void;
}

export default function StoreDistance({ distance, store, onClick }: StoreDistanceProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all overflow-hidden text-right group w-full"
    >
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
        {store.imageUrl ? (
          <img 
            src={store.imageUrl} 
            alt={store.nameAr}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mb-2">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <span className="text-orange-600 font-medium">لا توجد صورة</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Distance Badge */}
        {distance !== undefined && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
            {distance < 1 ? `${(distance * 1000).toFixed(0)} م` : `${distance.toFixed(1)} كم`}
          </div>
        )}
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
            <span className="font-semibold">{store.estimatedDeliveryTime} دقيقة</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">التوصيل</span>
            <span className="text-lg font-bold text-orange-600">{store.deliveryFee} EGP</span>
          </div>
          <span className="px-3.5 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-200">
            {store.category}
          </span>
        </div>
      </div>
    </button>
  );
}
