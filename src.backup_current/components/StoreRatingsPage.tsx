import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ReviewList from './ReviewList';
import { ArrowLeft, Store, Star } from 'lucide-react';
import RatingComponent from './RatingComponent';

export default function StoreRatingsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  // جلب بيانات المتجر
  const store = useQuery(api.stores.getStoreById, storeId ? { storeId: storeId as any } : "skip");

  // جلب المراجعات
  const reviews = useQuery(api.reviews.getStoreReviews, {
    storeId: storeId as any,
  });

  useEffect(() => {
    if (!storeId) {
      navigate('/customer');
      return;
    }
  }, [storeId, navigate]);

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => navigate('/customer')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">تقييمات المتجر</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">المتجر غير موجود</h3>
            <p className="text-gray-600">يرجى التحقق من رابط المتجر</p>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(`/customer/store/${storeId}`)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">تقييمات المتجر</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* معلومات المتجر */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{store.nameAr}</h3>
              <p className="text-sm text-gray-600">{store.location?.addressAr}</p>
            </div>
          </div>

          {/* التقييم الإجمالي */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RatingComponent rating={averageRating} size="lg" showValue={false} />
              <span className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-600">
              {reviews?.length || 0} تقييم{reviews?.length === 1 ? '' : ''}
            </p>
          </div>
        </div>

        {/* قائمة المراجعات */}
        {reviews && reviews.length > 0 && (
          <ReviewList
            reviews={reviews}
            reviewType="store"
            title="جميع التقييمات"
          />
        )}

        {/* رسالة عند عدم وجود مراجعات */}
        {!reviews || reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد تقييمات بعد
            </h3>
            <p className="text-gray-600">
              كن أول من يقيم هذا المتجر
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
