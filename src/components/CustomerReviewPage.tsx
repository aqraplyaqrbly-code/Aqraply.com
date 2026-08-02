import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { ArrowLeft, Package, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContextNew';
import { useTranslation } from 'react-i18next';

export default function CustomerReviewPage() {
  const { t } = useTranslation();
  const { orderId, reviewType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showForm, setShowForm] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // جلب بيانات الطلب
  const order = useQuery(api.orders.getOrderById, isAuthenticated && orderId ? { orderId: orderId as any } : "skip");

  // جلب المراجعات
  const storeReviews = useQuery(api.reviews.getStoreReviews, {
    storeId: order?.storeId as any,
  });

  const productReviews = useQuery(api.reviews.getProductReviews, {
    productId: order?.items[0]?.productId as any,
  });

  useEffect(() => {
    if (!orderId) {
      navigate('/customer/orders');
      return;
    }
  }, [orderId, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => navigate('/customer/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t('customer.reviewsPage.title')}</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('customer.reviewsPage.orderNotFound')}</h3>
            <p className="text-gray-600">{t('customer.reviewsPage.checkOrderLink')}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleReviewSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
    toast.success(t('customer.reviewsPage.reviewAddedSuccess'));
  };

  const isStoreReview = reviewType === 'store';
  const reviews = isStoreReview ? storeReviews : productReviews;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/customer/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isStoreReview ? t('customer.reviewsPage.storeReview') : t('customer.reviewsPage.productReview')}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* {t('customer.reviewsPage.orderInfo')} */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              {isStoreReview ? (
                <Store className="w-5 h-5 text-orange-600" />
              ) : (
                <Package className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {isStoreReview ? t('customer.reviewsPage.storeReview') : t('customer.reviewsPage.productReview')}
              </h3>
              <p className="text-sm text-gray-600">{t('errors.orderNumberPrefix')} {order.orderNumber}</p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {isStoreReview ? (
              <div>
                <span className="font-medium">{t('customer.reviewsPage.store')}:</span> {order.storeInfo?.nameAr}
              </div>
            ) : (
              <div>
                <span className="font-medium">{t('customer.reviewsPage.products')}:</span>
                <ul className="mt-1 space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-gray-900">{item.nameAr}</span>
                      <span className="text-gray-500">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* {t('customer.reviewsPage.reviewForm')} */}
        {showForm && (
          <ReviewForm
            orderId={order._id}
            storeId={order.storeId}
            productId={order.items[0]?.productId}
            reviewType={isStoreReview ? 'store' : 'product'}
            productName={order.items[0]?.nameAr}
            storeName={order.storeInfo?.nameAr}
            onSuccess={handleReviewSuccess}
          />
        )}

        {/* {t('customer.reviewsPage.reviewList')} */}
        {reviews && reviews.length > 0 && (
          <div className="mt-6">
            <ReviewList
              key={refreshKey}
              reviews={reviews}
              reviewType={isStoreReview ? 'store' : 'product'}
              title={`${t('customer.reviews')} ${isStoreReview ? t('customer.reviewsPage.thisStore') : t('customer.reviewsPage.thisProduct')}`}
            />
          </div>
        )}

        {/* {t('customer.reviewsPage.noReviews')} */}
        {(!reviews || reviews.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {!showForm ? t('customer.reviewsPage.thanksForReview') : t('customer.reviewsPage.noReviews')}
            </h3>
            <p className="text-gray-600">
              {!showForm ? t('customer.reviewsPage.reviewWillBePublished') : `${t('customer.reviewsPage.beFirstReview')} ${isStoreReview ? t('customer.reviewsPage.thisStore') : t('customer.reviewsPage.thisProduct')}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
