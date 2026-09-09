import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { DollarSign, Zap, Calendar, Plus, Trash2, CheckCircle, XCircle, Clock, Package, X, Store } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function SponsoredProductsManager() {
  const { t } = useTranslation();
  const { user, sessionToken } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Id<"products"> | null>(null);
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Check if user has a store
  if (!user?.profile?.storeId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <Store className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">لا يوجد متجر مسجل</h3>
          <p className="text-gray-600 mb-4">يجب عليك إنشاء متجر أولاً قبل إضافة إعلانات ممولة</p>
          <button
            onClick={() => window.location.href = "/merchant/settings"}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            إنشاء متجر جديد
          </button>
        </div>
      </div>
    );
  }

  // Get store products
  const storeProducts = useQuery(api.products.getStoreProductsWithImages, {
    storeId: user.profile.storeId as Id<"stores">,
    availableOnly: false,
  }) || [];

  // Get sponsored products stats
  const sponsoredStats = useQuery(api.sponsoredProducts.getSponsoredStats, {
    storeId: user.profile.storeId as Id<"stores">,
  }) || { total: 0, active: 0, expired: 0 };

  // Get store sponsored products
  const storeSponsoredProducts = useQuery(api.sponsoredProducts.getStoreSponsoredProducts, {
    storeId: user.profile.storeId as Id<"stores">,
  }) || [];

  const setProductSponsored = useMutation(api.sponsoredProducts.setProductSponsored);

  // Pricing configuration
  const pricing = {
    daily: 50, // EGP per day
    weekly: 300, // EGP per week
    monthly: 1000, // EGP per month
    priorityMultiplier: 1.5, // 50% extra for priority
  };

  const calculateCost = (days: number, prio: number): number => {
    const baseCost = days * pricing.daily;
    const priorityCost = prio > 1 ? baseCost * (pricing.priorityMultiplier - 1) : 0;
    return Math.round(baseCost + priorityCost);
  };

  const handleAddSponsored = async () => {
    if (!selectedProduct) {
      toast.error("يرجى اختيار منتج");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("يرجى تحديد تاريخ البداية والنهاية");
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (end <= start) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const cost = calculateCost(days, priority);

    try {
      await setProductSponsored({
        sessionToken: sessionToken,
        productId: selectedProduct,
        isSponsored: true,
        priority: priority,
        startDate: start,
        endDate: end,
      });

      toast.success(`تم إضافة المنتج الممول بنجاح! التكلفة: ${cost} EGP`);
      setShowAddModal(false);
      setSelectedProduct(null);
      setPriority(1);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      toast.error("فشل إضافة المنتج الممول");
      console.error("Error adding sponsored product:", error);
    }
  };

  const handleRemoveSponsored = async (productId: Id<"products">) => {
    try {
      await setProductSponsored({
        sessionToken: sessionToken,
        productId,
        isSponsored: false,
      });
      toast.success("تم إزالة الإعلان الممول");
    } catch (error) {
      toast.error("فشل إزالة الإعلان الممول");
      console.error("Error removing sponsored product:", error);
    }
  };

  const getDaysRemaining = (endDate: number) => {
    const now = Date.now();
    const remaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">⭐ إدارة الإعلانات المموّلة</h1>
          <p className="text-gray-600">قم بإدارة إعلانات منتجاتك المموّلة وزيادة ظهورها</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة إعلان ممول
        </button>
      </div>

      {/* Pricing Information */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-600" />
          أسعار الإعلانات المموّلة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">يومي</div>
            <div className="text-2xl font-bold text-orange-600">{pricing.daily} EGP</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">أسبوعي</div>
            <div className="text-2xl font-bold text-orange-600">{pricing.weekly} EGP</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">شهري</div>
            <div className="text-2xl font-bold text-orange-600">{pricing.monthly} EGP</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <Zap className="w-4 h-4 inline mr-1" />
          الأولوية العالية تضيف 50% إضافية على التكلفة
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">إجمالي الإعلانات</div>
              <div className="text-2xl font-bold text-gray-900">{sponsoredStats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">نشط</div>
              <div className="text-2xl font-bold text-gray-900">{sponsoredStats.active}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">منتهي</div>
              <div className="text-2xl font-bold text-gray-900">{sponsoredStats.expired}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Products List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">المنتجات المموّلة</h3>
        </div>
        {storeSponsoredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد منتجات ممولة حالياً</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
            >
              أضف إعلان ممول الآن
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {storeSponsoredProducts.map((product) => (
              <div key={product._id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.nameAr}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{product.nameAr}</h4>
                    <p className="text-sm text-gray-600">{product.price} EGP</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {getDaysRemaining(product.sponsoredEndDate || 0)} يوم متبقي
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    نشط
                  </span>
                  <button
                    onClick={() => handleRemoveSponsored(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Sponsored Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إضافة إعلان ممول</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اختر المنتج</label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(e.target.value as Id<"products">)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">اختر منتج...</option>
                  {storeProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.nameAr} - {product.price} EGP
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النهاية</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={1}>عادية</option>
                  <option value={2}>عالية (+50% تكلفة)</option>
                  <option value={3}>مميزة (+100% تكلفة)</option>
                </select>
              </div>

              {startDate && endDate && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">التكلفة المقدرة:</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mt-1">
                    {calculateCost(
                      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
                      priority
                    )} EGP
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddSponsored}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                إضافة الإعلان
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
