import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ReviewList from './ReviewList';
import { ArrowLeft, Package, Star } from 'lucide-react';
import RatingComponent from './RatingComponent';
import { ProductImage } from './ProductImage';
import { useAuth } from '../contexts/AuthContextNew';

export default function ProductRatingsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { sessionToken, isAuthenticated } = useAuth();
  
  // جلب بيانات المنتج
  const product = useQuery(api.products.getProductWithImage, isAuthenticated && sessionToken && productId ? { 
    sessionToken,
    productId: productId as any 
  } : "skip");

  // جلب المراجعات
  const reviews = useQuery(api.reviews.getProductReviews, {
    productId: productId as any,
  });

  useEffect(() => {
    if (!productId) {
      navigate('/customer');
      return;
    }
  }, [productId, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => navigate('/customer')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">تقييمات المنتج</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">المنتج غير موجود</h3>
            <p className="text-gray-600">يرجى التحقق من رابط المنتج</p>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(`/customer/store/${product.storeId}`)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">تقييمات المنتج</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* معلومات المنتج */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex gap-4">
            {/* صورة المنتج */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <ProductImage product={product} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{product.nameAr}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.descriptionAr}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">{product.price} EGP</span>
              </div>
            </div>
          </div>

          {/* التقييم الإجمالي */}
          <div className="bg-gray-50 rounded-lg p-4 text-center mt-4">
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
            reviewType="product"
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
              كن أول من يقيم هذا المنتج
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
