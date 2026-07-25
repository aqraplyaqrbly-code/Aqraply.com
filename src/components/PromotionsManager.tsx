import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Tag, Plus, X, Calendar, Percent } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../contexts/AuthContextNew";

interface PromotionsManagerProps {
  storeId: Id<"stores">;
}

export default function PromotionsManager({ storeId }: PromotionsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { sessionToken } = useAuth();
  const products = useQuery(api.products.getStoreProducts, {
    storeId,
    availableOnly: false,
  });
  const promotions = useQuery(api.promotions.getStorePromotions, { storeId });
  const createPromotion = useMutation(api.promotions.createPromotion);
  const cancelPromotion = useMutation(api.promotions.cancelPromotion);

  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    titleAr: "",
    discountPercentage: 10,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error("يرجى اختيار منتج");
      return;
    }

    try {
      await createPromotion({
        sessionToken,
        storeId,
        productId: formData.productId as Id<"products">,
        title: formData.title,
        titleAr: formData.titleAr,
        discountPercentage: formData.discountPercentage,
        startDate: new Date(formData.startDate).getTime(),
        endDate: new Date(formData.endDate).getTime(),
      });
      toast.success("تم إنشاء العرض بنجاح! 🎉");
      setShowCreateForm(false);
      setFormData({
        productId: "",
        title: "",
        titleAr: "",
        discountPercentage: 10,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  const handleCancel = async (promotionId: Id<"promotions">) => {
    try {
      await cancelPromotion({ sessionToken, promotionId });
      toast.success("تم إلغاء العرض");
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  if (!products || !promotions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-orange-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة العروض الترويجية
          </h1>
          <p className="text-gray-600">
            أنشئ عروض خاصة لجذب المزيد من العملاء
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          عرض جديد
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-orange-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            إنشاء عرض ترويجي
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  المنتج
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                >
                  <option value="">اختر منتج</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.nameAr} - {product.price} EGP
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  عنوان العرض (English)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Summer Sale"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  عنوان العرض (عربي)
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                  placeholder="عرض الصيف"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  تاريخ النهاية
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                إنشاء العرض
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Promotions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">العروض النشطة</h3>
        {promotions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">لا توجد عروض نشطة حالياً</p>
            <p className="text-gray-500 text-sm mt-2">
              أنشئ عرضك الأول لجذب المزيد من العملاء
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo) => {
              const product = products.find((p) => p._id === promo.productId);
              return (
                <div
                  key={promo._id}
                  className="p-6 bg-white rounded-xl shadow-md border-2 border-orange-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Percent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-start">
                          {promo.titleAr}
                        </h4>
                        <p className="text-sm text-gray-600 text-start">
                          {product?.nameAr}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancel(promo._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Percent className="w-4 h-4" />
                      <span>خصم {promo.discountPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(promo.startDate).toLocaleDateString("ar-SA")} -{" "}
                        {new Date(promo.endDate).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>

                  {product && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">السعر الأصلي:</span>
                        <span className="text-gray-400 line-through">
                          {product.originalPrice || product.price} EGP
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          السعر بعد الخصم:
                        </span>
                        <span className="text-xl font-bold text-orange-600">
                          {product.price} EGP
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
