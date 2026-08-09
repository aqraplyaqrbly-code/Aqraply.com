import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { normalizeArabicText } from "../lib/utils";
import {
  Store,
  Package,
  TrendingUp,
  Settings,
  BarChart3,
  ShoppingBag,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  User,
  Truck,
  Search,
  RefreshCw,
  Menu,
  X,
  Star,
  ArrowUpRight,
  Printer,
  Eye,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextNew";
import ProductsManager from "./ProductsManager";
import StoreSettings from "./StoreSettings";
import InvoicePrint from "./InvoicePrint";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

interface MerchantDashboardContentProps {
  profile: any;
}

export default function MerchantDashboardContent({ profile }: MerchantDashboardContentProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Routes>
        <Route path="/" element={<MerchantLayout profile={profile}><DashboardHome profile={profile} /></MerchantLayout>} />
        <Route path="/products" element={<MerchantLayout profile={profile}><ProductsManager /></MerchantLayout>} />
        <Route path="/orders" element={<MerchantLayout profile={profile}><Orders profile={profile} /></MerchantLayout>} />
        <Route path="/analytics" element={<MerchantLayout profile={profile}><Analytics profile={profile} /></MerchantLayout>} />
        <Route path="/settings" element={<MerchantLayout profile={profile}><StoreSettings /></MerchantLayout>} />
      </Routes>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function MerchantLayout({ profile, children }: { profile: any; children: React.ReactNode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: "/merchant", label: t('errors.home'), icon: BarChart3 },
    { path: "/merchant/products", label: t('errors.products'), icon: Package },
    { path: "/merchant/orders", label: t('errors.orders'), icon: ShoppingBag },
    { path: "/merchant/analytics", label: t('errors.reports'), icon: TrendingUp },
    { path: "/merchant/settings", label: t('errors.settings'), icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/merchant") return location.pathname === "/merchant";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch {
      toast.error(t('errors.logoutFailed'));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-row-reverse">
      {/* Sidebar - Takes its own space */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-gradient-to-b from-orange-600 to-red-700 text-white h-screen shadow-xl">
        <div className="p-6 border-b border-orange-500">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Aqraply Logo" className="h-24 w-auto" />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-orange-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-500">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">لوحة التاجر</h1>
                <p className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[120px]">
                  {profile.businessNameAr || profile.businessName || profile.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
            <div className="absolute right-0 top-0 w-64 sm:w-72 h-full bg-gradient-to-b from-orange-600 to-red-700 text-white" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 border-b border-orange-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold">لوحة التاجر</h1>
                    <p className="text-xs text-orange-200 truncate max-w-[120px] sm:max-w-[140px]">
                      {profile.businessNameAr || profile.businessName || profile.fullName}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-orange-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-orange-500">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-200 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ profile }: { profile: any }) {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const myStores = useQuery(api.stores.getMyStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const navigate = useNavigate();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const storeId = selectedStoreId || myStores?.[0]?._id || null;
  const store = myStores?.find((s) => s._id === storeId);

  const storeOrders = useQuery(
    api.orders.getStoreOrders,
    storeId && isAuthenticated && sessionToken ? { storeId: storeId as Id<"stores">, status: undefined, sessionToken } : "skip"
  );

  const deliveredOrders = storeOrders?.filter((o) => o.status === "delivered") || [];
  const pendingOrders = storeOrders?.filter((o) =>
    ["pending", "confirmed", "preparing"].includes(o.status)
  ) || [];
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);

  // ✅ المشكلة محلولة: إجمالي الطلبات يُحسب من storeOrders.length بدلاً من store.totalOrders
  const totalOrdersCount = storeOrders?.length ?? 0;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">مرحباً، {profile.fullName} 👋</h1>
          <p className="text-gray-500 mt-1 text-sm lg:text-base">إليك ملخص أداء متجرك</p>
        </div>
        {myStores && myStores.length > 1 && (
          <select
            value={storeId || ""}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 w-full sm:w-auto"
          >
            {myStores.map((s) => (
              <option key={s._id} value={s._id}>{s.nameAr}</option>
            ))}
          </select>
        )}
      </div>

      {!myStores || myStores.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 lg:p-16 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
            <Store className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">لا توجد متاجر بعد</h3>
          <p className="text-gray-500 mb-4 lg:mb-6 text-sm lg:text-base">ابدأ بإنشاء متجرك الأول للبدء في البيع</p>
          <button
            onClick={() => navigate("/merchant/settings")}
            className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm lg:text-base"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            إنشاء متجر جديد
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <MerchantStatCard
              icon={<ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />}
              title="إجمالي الطلبات"
              value={totalOrdersCount}  // ✅ استخدام العدد الصحيح
              color="blue"
            />
            <MerchantStatCard
              icon={<CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />}
              title="طلبات مكتملة"
              value={deliveredOrders.length}
              color="green"
            />
            <MerchantStatCard
              icon={<Clock className="w-5 h-5 lg:w-6 lg:h-6" />}
              title="طلبات نشطة"
              value={pendingOrders.length}
              color="orange"
            />
            <MerchantStatCard
              icon={<TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" />}
              title="إجمالي الإيرادات"
              value={`${totalRevenue.toLocaleString()} EGP`}
              color="purple"
            />
          </div>

          {/* Store Info */}
          {store && (
            <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">معلومات المتجر</h3>
                <button
                  onClick={() => navigate("/merchant/settings")}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  تعديل
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">اسم المتجر</p>
                  <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{store.nameAr}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">التقييم</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{store.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">رسوم التوصيل</p>
                  <p className="font-semibold text-gray-900">{store.deliveryFee} EGP</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">الحد الأدنى</p>
                  <p className="font-semibold text-gray-900">{store.minOrderAmount} EGP</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">آخر الطلبات</h3>
              <button
                onClick={() => navigate("/merchant/orders")}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                عرض الكل
              </button>
            </div>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">رقم الطلب</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">العميل</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">المبلغ</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">الحالة</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">الوقت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!storeOrders ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : storeOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        لا توجد طلبات بعد
                      </td>
                    </tr>
                  ) : (
                    storeOrders.slice(0, 8).map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono font-bold text-orange-700">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-700">
                              {order.customerInfo?.fullName || "—"}
                            </p>
                            {order.storeInfo && (
                              <div className="mt-1">
                                <p className="text-xs text-purple-600 font-medium">
                                  {order.storeInfo.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {order.total} EGP
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(order._creationTime).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {!storeOrders ? (
                <div className="p-4 text-center text-gray-400">
                  جاري التحميل...
                </div>
              ) : storeOrders.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  لا توجد طلبات حالياً
                </div>
              ) : (
                storeOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customerInfo?.fullName}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">{order.total} EGP</span>
                      <span className="text-gray-500">
                        {new Date(order._creationTime).toLocaleString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function Orders({ profile }: { profile: any }) {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const myStores = useQuery(api.stores.getMyStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);

  const storeId = selectedStoreId || myStores?.[0]?._id || null;

  const storeOrders = useQuery(
    api.orders.getStoreOrders,
    storeId && isAuthenticated && sessionToken ? { storeId: storeId as Id<"stores">, status: undefined, sessionToken } : "skip"
  );

  const storageIdsToResolve = useMemo(() => {
    const ids = new Set<string>();
    const isHttpUrl = (s?: unknown) =>
      typeof s === "string" &&
      (s.startsWith("http://") || s.startsWith("https://"));

    for (const order of storeOrders || []) {
      for (const item of order.items || []) {
        const img = (item as any).imageUrl as unknown;
        if (typeof img === "string" && img && !isHttpUrl(img)) ids.add(img);
      }

      const storeImageUrl = (order as any).storeInfo?.imageUrl as unknown;
      const storeImageId = (order as any).storeInfo?.imageId as unknown;
      if (typeof storeImageUrl === "string" && storeImageUrl && !isHttpUrl(storeImageUrl)) {
        ids.add(storeImageUrl);
      }
      if (typeof storeImageId === "string" && storeImageId && !isHttpUrl(storeImageId)) {
        ids.add(storeImageId);
      }
    }

    return Array.from(ids);
  }, [storeOrders]);

  const resolvedStorageUrls = useQuery(
    api.files.getFileUrls,
    storageIdsToResolve.length ? { storageIds: storageIdsToResolve } : "skip"
  );

  const imageIdToUrl = useMemo(() => {
    const map = new Map<string, string>();
    if (!resolvedStorageUrls) return map;
    storageIdsToResolve.forEach((id, idx) => {
      map.set(id, resolvedStorageUrls[idx] as string);
    });
    return map;
  }, [resolvedStorageUrls, storageIdsToResolve]);

  const placeholderImg = "https://picsum.photos/seed/product/48/48.jpg";
  const resolveImageSrc = (value?: unknown) => {
    if (!value || typeof value !== "string") return placeholderImg;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return imageIdToUrl.get(value) || placeholderImg;
  };

  const filteredOrders = (storeOrders || [])
    .filter((o) => !selectedStatus || o.status === selectedStatus)
    .filter(
      (o) =>
        !searchTerm ||
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        normalizeArabicText(o.customerInfo?.fullName || '').includes(normalizeArabicText(searchTerm))
    );

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({
        sessionToken,
        orderId: orderId as Id<"orders">,
        status: newStatus,
      });
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث الحالة");
    }
  };

  const nextStatus: Record<string, { status: string; label: string }> = {
    pending: { status: "confirmed", label: "تأكيد الطلب" },
    confirmed: { status: "preparing", label: "بدء التحضير" },
    preparing: { status: "ready", label: "جاهز للاستلام" },
  };

  const statuses = [
    { key: null, label: "الكل" },
    { key: "pending", label: "قيد الانتظار" },
    { key: "confirmed", label: "مؤكد" },
    { key: "preparing", label: "قيد التحضير" },
    { key: "ready", label: "جاهز" },
    { key: "delivering", label: "قيد التوصيل" },
    { key: "delivered", label: "تم التوصيل" },
    { key: "cancelled", label: "ملغي" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">
            {storeOrders ? `${storeOrders.length} طلب` : "جاري التحميل..."}
          </p>
        </div>
        {myStores && myStores.length > 1 && (
          <select
            value={storeId || ""}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          >
            {myStores.map((s) => (
              <option key={s._id} value={s._id}>{s.nameAr}</option>
            ))}
          </select>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "قيد الانتظار", status: "pending", color: "yellow" },
          { label: "قيد التحضير", status: "preparing", color: "purple" },
          { label: "جاهز", status: "ready", color: "teal" },
          { label: "تم التوصيل", status: "delivered", color: "green" },
        ].map(({ label, status, color }) => {
          const count = storeOrders?.filter((o) => o.status === status).length || 0;
          const colorMap: Record<string, string> = {
            yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
            purple: "bg-purple-50 border-purple-200 text-purple-700",
            teal: "bg-teal-50 border-teal-200 text-teal-700",
            green: "bg-green-50 border-green-200 text-green-700",
          };
          return (
            <div key={status} className={`rounded-2xl p-4 border ${colorMap[color]}`}>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm font-medium mt-1">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map(({ key, label }) => (
            <button
              key={String(key)}
              onClick={() => setSelectedStatus(key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === key
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">رقم الطلب</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">العميل</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">المنتجات</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">كود المنتج</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">الوقت</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!storeOrders ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد طلبات</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-mono font-bold text-orange-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          {order.customerInfo?.fullName || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        {order.items.slice(0, 2).map((item: any, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <img
                              src={resolveImageSrc(item.imageUrl)}
                              alt={item.nameAr}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover bg-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <span className="font-medium text-[10px] sm:text-xs">
                                {item.nameAr} × {item.quantity}
                              </span>
                              {(item.color || item.size) && (
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                  {item.color && <span>{item.color}</span>}
                                  {item.color && item.size && <span>, </span>}
                                  {item.size && <span>{item.size}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-[10px] sm:text-xs text-gray-400">+{order.items.length - 2} أخرى</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-[10px] sm:text-xs text-gray-600 space-y-1">
                        {order.items.slice(0, 2).map((item: any, i: number) => (
                          <div key={i} className="font-mono text-[10px] sm:text-xs">
                            {item.code || item.productCode || item.sku || "—"}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-[10px] sm:text-xs text-gray-400">...</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900">
                      {order.total} EGP
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-[10px] sm:text-xs text-gray-500">
                      {new Date(order._creationTime).toLocaleString("ar-EG")}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                          title="طباعة الفاتورة"
                        >
                          <Printer className="w-3 h-3" />
                        </button>
                        {nextStatus[order.status] && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, nextStatus[order.status].status)
                            }
                            className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 px-2 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap"
                          >
                            {nextStatus[order.status].label}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print Modal */}
      {selectedOrderForInvoice && (
        <InvoicePrint
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function Analytics({ profile }: { profile: any }) {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const myStores = useQuery(api.stores.getMyStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const storeId = selectedStoreId || myStores?.[0]?._id || null;
  const stats = useQuery(
    api.admin.getMerchantStats,
    storeId && isAuthenticated && sessionToken ? { storeId: storeId as Id<"stores">, sessionToken } : "skip"
  );

  const storeOrders = useQuery(
    api.orders.getStoreOrders,
    storeId && isAuthenticated && sessionToken ? { storeId: storeId as Id<"stores">, status: undefined, sessionToken } : "skip"
  );

  const dailyData = (() => {
    if (!storeOrders) return [];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayOrders = storeOrders.filter(
        (o) => o._creationTime >= dayStart && o._creationTime < dayEnd
      );
      days.push({
        label: date.toLocaleDateString("ar-EG", { weekday: "short" }),
        revenue: dayOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0),
        count: dayOrders.length,
      });
    }
    return days;
  })();

  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-500 mt-1">تحليل أداء متجرك</p>
        </div>
        {myStores && myStores.length > 1 && (
          <select
            value={storeId || ""}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          >
            {myStores.map((s) => (
              <option key={s._id} value={s._id}>{s.nameAr}</option>
            ))}
          </select>
        )}
      </div>

      {!storeId ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">لا يوجد متجر محدد</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="إجمالي الطلبات"
              value={stats?.totalOrders ?? "—"}
              icon={<ShoppingBag className="w-5 h-5" />}
              color="blue"
            />
            <AnalyticsCard
              title="إجمالي الإيرادات"
              value={stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "—"}
              icon={<span className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">EGP</span>}
              color="green"
            />
            <AnalyticsCard
              title="صافي الإيرادات"
              value={stats ? `${stats.netRevenue.toLocaleString()} EGP` : "—"}
              icon={<TrendingUp className="w-5 h-5" />}
              color="orange"
            />
            <AnalyticsCard
              title="متوسط قيمة الطلب"
              value={stats ? `${Math.round(stats.averageOrderValue)} EGP` : "—"}
              icon={<ArrowUpRight className="w-5 h-5" />}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">الإيرادات اليومية (آخر 7 أيام)</h3>
              <div className="flex items-end gap-3 h-48">
                {dailyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {day.revenue > 0 ? day.revenue : ""}
                    </span>
                    <div className="w-full flex items-end" style={{ height: "140px" }}>
                      <div
                        className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 5 : 0)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع حالات الطلبات</h3>
              {stats?.statusCounts ? (
                <div className="space-y-3">
                  {[
                    { key: "delivered", label: "تم التوصيل", color: "bg-green-500" },
                    { key: "pending", label: "قيد الانتظار", color: "bg-yellow-500" },
                    { key: "preparing", label: "قيد التحضير", color: "bg-purple-500" },
                    { key: "cancelled", label: "ملغي", color: "bg-red-500" },
                    { key: "confirmed", label: "مؤكد", color: "bg-blue-500" },
                  ].map(({ key, label, color }) => {
                    const count = stats.statusCounts[key] || 0;
                    const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="text-sm text-gray-700">{label}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {count} ({pct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          {stats?.topProducts && stats.topProducts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">أكثر المنتجات مبيعاً</h3>
              <div className="space-y-4">
                {stats.topProducts.map((product: any, i: number) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-orange-200 text-orange-700"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{product.nameAr}</span>
                        <span className="text-sm text-gray-500">{product.count} مبيعة</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                          style={{
                            width: `${stats.topProducts[0].count > 0 ? (product.count / stats.topProducts[0].count) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {product.revenue.toLocaleString()} EGP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commission Info */}
          {stats && (
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-4">ملخص العمولات</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-orange-700">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.totalRevenue.toLocaleString()} EGP</p>
                </div>
                <div>
                  <p className="text-sm text-orange-700">عمولة المنصة</p>
                  <p className="text-2xl font-bold text-red-700">{stats.totalCommission.toLocaleString()} EGP</p>
                </div>
                <div>
                  <p className="text-sm text-orange-700">صافي الأرباح</p>
                  <p className="text-2xl font-bold text-green-700">{stats.netRevenue.toLocaleString()} EGP</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function MerchantStatCard({
  icon, title, value, color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-3 lg:mb-4`}>
        {icon}
      </div>
      <p className="text-xs lg:text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg lg:text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function AnalyticsCard({
  title, value, icon, color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "مؤكد", cls: "bg-blue-100 text-blue-800" },
    assigned: { label: "تم التعيين", cls: "bg-indigo-100 text-indigo-800" },
    preparing: { label: "قيد التحضير", cls: "bg-purple-100 text-purple-800" },
    ready: { label: "جاهز", cls: "bg-teal-100 text-teal-800" },
    picked_up: { label: "تم الاستلام", cls: "bg-cyan-100 text-cyan-800" },
    delivering: { label: "قيد التوصيل", cls: "bg-orange-100 text-orange-800" },
    delivered: { label: "تم التوصيل", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "ملغي", cls: "bg-red-100 text-red-800" },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}