import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  orderId: string;
  storeId: string;
  productId?: string;
  reviewType: 'store' | 'product';
  productName?: string;
  storeName?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  orderId,
  storeId,
  productId,
  reviewType,
  productName,
  storeName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createStoreReview = useMutation(api.reviews.createStoreReview);
  const createProductReview = useMutation(api.reviews.createProductReview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }

    setIsSubmitting(true);

    try {
      if (reviewType === 'store') {
        await createStoreReview({
          storeId: storeId as any,
          orderId: orderId as any,
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success('تم إضافة تقييم المتجر بنجاح!');
      } else {
        await createProductReview({
          productId: productId as any,
          storeId: storeId as any,
          orderId: orderId as any,
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success('تم إضافة تقييم المنتج بنجاح!');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء إضافة التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'سيء جداً';
      case 2: return 'سيء';
      case 3: return 'متوسط';
      case 4: return 'جيد';
      case 5: return 'ممتاز';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {reviewType === 'store' ? 'تقييم المتجر' : 'تقييم المنتج'}
        </h3>
        <div className="text-sm text-gray-600">
          {reviewType === 'store' ? storeName : productName}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* التقييم بالنجوم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            التقييم
          </label>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-sm font-medium text-gray-700">
                {getRatingText(rating)}
              </div>
            )}
          </div>
        </div>

        {/* التعليق */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              تعليق (اختياري)
            </div>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك رأيك مع الآخرين..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/500 حرف
          </div>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال التقييم
            </>
          )}
        </button>
      </form>

      {/* معلومات إضافية */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          سيتم نشر تقييمك بعد التحقق من الشراء
        </div>
      </div>
    </div>
  );
}
