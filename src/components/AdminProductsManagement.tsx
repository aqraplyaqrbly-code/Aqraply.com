import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  CheckCircle,
  Store,
  Tag,
  Search,
  RefreshCw,
  XCircle,
  Clock,
  Ban,
} from "lucide-react";

export default function ProductsManagement() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const products = useQuery(api.admin.getAllProducts, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const pendingProducts = useQuery(api.products.getPendingProducts, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const toggleProduct = useMutation(api.admin.toggleProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const approveProduct = useMutation(api.products.approveProduct);
  const rejectProduct = useMutation(api.products.rejectProduct);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStore, setFilterStore] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterAvailable, setFilterAvailable] = useState<string | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingProduct, setRejectingProduct] = useState<string | null>(null);

  const stores = useQuery(api.stores.getActiveStores);
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  const filteredProducts = (products || [])
    .filter((p) => filterStore === null || p.storeId === filterStore)
    .filter((p) => filterCategory === null || p.category === filterCategory)
    .filter((p) => filterAvailable === null || 
      (filterAvailable === "available" && p.isAvailable) || 
      (filterAvailable === "unavailable" && !p.isAvailable))
    .filter((p) => 
      !searchTerm || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleToggleProduct = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleProduct({
        sessionToken,
        productId: productId as Id<"products">,
        isAvailable: !currentStatus,
      });
      toast.success(!currentStatus ? "تم تفعيل المنتج" : "تم إيقاف المنتج");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث حالة المنتج");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      return;
    }
    try {
      await deleteProduct({ sessionToken, productId: productId as Id<"products"> });
      toast.success("تم حذف المنتج");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حذف المنتج");
    }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      await approveProduct({
        sessionToken,
        productId: productId as Id<"products">,
      });
      toast.success("تمت الموافقة على المنتج بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشلت الموافقة على المنتج");
    }
  };

  const handleRejectProduct = async (productId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    try {
      await rejectProduct({
        sessionToken,
        productId: productId as Id<"products">,
        reason: rejectionReason,
      });
      toast.success("تم رفض المنتج بنجاح");
      setRejectionReason("");
      setRejectingProduct(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل رفض المنتج");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
        <p className="text-gray-500 mt-1">
          {products ? `${products.length} منتج إجماليًا` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">إجمالي المنتجات</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{products?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">المنتجات المتاحة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {products?.filter((p) => p.isAvailable).length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">المنتجات المعلقة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingProducts?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">عدد المتاجر</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stores?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">عدد الفئات</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
        </div>
      </div>

      {/* Toggle Button for Pending Products */}
      <div className="mb-6">
        <button
          onClick={() => setShowPending(!showPending)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            showPending
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {showPending ? "عرض جميع المنتجات" : `عرض المنتجات المعلقة (${pendingProducts?.length || 0})`}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <select
              value={filterStore || ""}
              onChange={(e) => setFilterStore(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">كل المتاجر</option>
              {stores?.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.nameAr}
                </option>
              ))}
            </select>
            <select
              value={filterCategory || ""}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">كل الفئات</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={filterAvailable || ""}
              onChange={(e) => setFilterAvailable(e.target.value || null)}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">الحالة</option>
              <option value="available">متاح</option>
              <option value="unavailable">غير متاح</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المنتج</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المتجر</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الفئة</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">السعر</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!products ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد منتجات</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.nameAr} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.nameAr || product.name}</p>
                          {product.descriptionAr && (
                            <p className="text-xs text-gray-500 line-clamp-1">{product.descriptionAr}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {stores?.find(s => s._id === product.storeId)?.nameAr || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                        {product.category || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{product.price} ج.م</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-gray-500 line-through">{product.originalPrice} ج.م</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.isAvailable ? "متاح" : "غير متاح"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleProduct(product._id, product.isAvailable)}
                          className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                            product.isAvailable
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {product.isAvailable ? "إيقاف" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Products Table */}
      {showPending && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">المنتجات المعلقة ({pendingProducts?.length || 0})</h2>
          <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-b from-orange-50 to-orange-100 border-b border-orange-200">
                  <tr>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المنتج</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المتجر</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الفئة</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">السعر</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!pendingProducts ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                        <p className="text-gray-400">جاري التحميل...</p>
                      </td>
                    </tr>
                  ) : pendingProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">لا توجد منتجات معلقة</p>
                      </td>
                    </tr>
                  ) : (
                    pendingProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-orange-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.nameAr} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{product.nameAr || product.name}</p>
                              {product.descriptionAr && (
                                <p className="text-xs text-gray-500 line-clamp-1">{product.descriptionAr}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {stores?.find(s => s._id === product.storeId)?.nameAr || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                            {product.category || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">{product.price} ج.م</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">{product.originalPrice} ج.م</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveProduct(product._id)}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              موافقة
                            </button>
                            <button
                              onClick={() => setRejectingProduct(product._id)}
                              className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              رفض
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Rejection Reason Modal */}
      {rejectingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">سبب الرفض</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="أدخل سبب رفض المنتج..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectionReason("");
                  setRejectingProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleRejectProduct(rejectingProduct)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
