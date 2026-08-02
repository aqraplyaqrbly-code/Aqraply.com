import React, { useState } from 'react';
import { Star, ThumbsUp, User, Calendar, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: number;
  customerName: string;
}

interface ReviewListProps {
  reviews: Review[];
  reviewType: 'store' | 'product';
  title?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ReviewList({
  reviews,
  reviewType,
  title,
  showLoadMore = false,
  onLoadMore,
  isLoading = false,
}: ReviewListProps) {
  const { t } = useTranslation();
  const markReviewHelpful = useMutation(api.reviews.markReviewHelpful);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const result = await markReviewHelpful({
        reviewId: reviewId as any,
        reviewType,
      });

      if (result.liked) {
        setLikedReviews(new Set([...likedReviews, reviewId]));
        toast.success(t('errors.thanksForRating'));
      } else {
        setLikedReviews(new Set([...likedReviews].filter(id => id !== reviewId)));
        toast.success(t('errors.ratingRemoved'));
      }
    } catch (error: any) {
      toast.error(error.message || t('errors.errorOccurred'));
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });

    return distribution.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    }));
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* العنوان والإحصائيات */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {title || `${reviewType === 'store' ? t('errors.storeRatings') : t('errors.productRatings')}`}
        </h3>
        
        {reviews.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= averageRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {reviews.length} {t('errors.rating')}
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  {getRatingDistribution().map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="text-sm text-gray-600 w-8">{rating}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 w-8 text-right">
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* قائمة المراجعات */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('errors.noRatingsYet')}
            </h3>
            <p className="text-gray-600">
              {reviewType === 'store' ? t('errors.beFirstToRateStore') : t('errors.beFirstToRateProduct')}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg p-6 border border-gray-100"
            >
              {/* رأس المراجعة */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(review.createdAt)}
                      {review.isVerified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">{t('errors.verified')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* التعليق */}
              {review.comment && (
                <div className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </div>
              )}

              {/* زر "مفيد" */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleMarkHelpful(review._id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    likedReviews.has(review._id)
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      likedReviews.has(review._id) ? 'fill-orange-600' : ''
                    }`}
                  />
                  {t('errors.helpful')} ({review.helpfulCount})
                </button>

                <div className="text-xs text-gray-400">
                  {reviewType === 'store' ? t('errors.storeReview') : t('errors.productReview')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* زر تحميل المزيد */}
      {showLoadMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t('errors.loadingMore') : t('errors.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
