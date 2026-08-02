import React, { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Package, Store, Truck, Users, TrendingUp, MapPin, Phone, RefreshCw } from "lucide-react";
import { StatCard } from "./StatisticsCards";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { StatusBadge } from "./StatisticsCards";
import { useAuth } from "../../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export function DashboardHeader() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const stats = useDashboardStats();
  const orders = useQuery(api.orders.getAllOrders, isAuthenticated && sessionToken ? { sessionToken } : "skip");

  const recentOrders = orders?.slice(0, 8) || [];

  // Resolve image URLs from storage IDs
  const storageIdsToResolve = useMemo(() => {
    const ids = new Set<string>();
    const isHttpUrl = (s?: unknown) =>
      typeof s === "string" &&
      (s.startsWith("http://") || s.startsWith("https://"));

    for (const order of recentOrders || []) {
      for (const item of order.items || []) {
        const img = item.imageUrl as unknown;
        if (typeof img === "string" && img && !isHttpUrl(img)) ids.add(img);
      }
    }

    return Array.from(ids);
  }, [recentOrders]);

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('errors.welcomeBack')}</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('errors.platformOverview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
          title={t('errors.totalOrders')}
          value={stats?.totalOrders ?? "—"}
          sub={t('errors.pendingOrdersCount', { count: stats?.pendingOrders ?? 0 })}
          color="purple"
          trend="up"
        />
        <StatCard
          icon={<span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded">EGP</span>}
          title={t('errors.totalRevenue')}
          value={stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "—"}
          sub={`${t('errors.commission')}: ${stats?.totalCommission?.toLocaleString() ?? 0} EGP`}
          color="green"
          trend="up"
        />
        <StatCard
          icon={<Store className="w-5 h-5 sm:w-6 sm:h-6" />}
          title={t('errors.stores')}
          value={stats?.totalStores ?? "—"}
          sub={t('errors.activeStoresCount', { count: stats?.activeStores ?? 0 })}
          color="blue"
          trend="up"
        />
        <StatCard
          icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6" />}
          title={t('errors.captains')}
          value={stats?.totalCaptains ?? "—"}
          sub={t('errors.onlineCaptainsCount', { count: stats?.onlineCaptains ?? 0 })}
          color="orange"
          trend="up"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">{t('errors.registeredCustomers')}</span>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.totalCustomers ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">{t('errors.last7DaysOrders')}</span>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.recentOrders ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">{t('errors.last7DaysRevenue')}</span>
            <span className="text-base sm:text-lg font-bold text-gray-500">EGP</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats ? `${stats.recentRevenue.toLocaleString()} EGP` : "—"}
          </p>
        </div>
      </div>

      {/* Order Status Distribution */}
      {stats?.statusCounts && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('errors.orderStatusDistribution')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { key: "pending", label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
              { key: "confirmed", label: "مؤكد", color: "bg-blue-100 text-blue-700" },
              { key: "preparing", label: "قيد التحضير", color: "bg-purple-100 text-purple-700" },
              { key: "delivering", label: "قيد التوصيل", color: "bg-orange-100 text-orange-700" },
              { key: "delivered", label: "تم التوصيل", color: "bg-green-100 text-green-700" },
              { key: "cancelled", label: "ملغي", color: "bg-red-100 text-red-700" },
              { key: "assigned", label: "تم التعيين", color: "bg-indigo-100 text-indigo-700" },
              { key: "ready", label: "جاهز", color: "bg-teal-100 text-teal-700" },
            ].map(({ key, label, color }) => (
              <div key={key} className={`rounded-xl p-3 sm:p-4 ${color}`}>
                <p className="text-xl sm:text-2xl font-bold">{stats.statusCounts[key] || 0}</p>
                <p className="text-xs sm:text-sm font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('errors.recentOrders')}</h3>
          <button
            onClick={() => window.location.href = "/admin/orders"}
            className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {t('errors.viewAll')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-28">{t('errors.orderNumber')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-32">{t('errors.customer')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-80">{t('errors.storeData')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-24">{t('errors.amount')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-28">{t('errors.status')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 w-28">{t('errors.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    {t('errors.noOrdersYet')}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-mono font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {order.customerInfo?.fullName || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {order.storeInfo?.name || "—"}
                        </div>
                        {order.storeInfo?.address && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.storeInfo?.address}
                          </div>
                        )}
                        {order.storeInfo?.phone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.storeInfo?.phone}
                          </div>
                        )}
                        {/* عرض المنتجات مع الصور والأكواد */}
                        <div className="mt-2 space-y-1">
                          {order.items.slice(0, 2).map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <img
                                  src={resolveImageSrc(item.imageUrl)}
                                  alt={item.nameAr || item.name || t('errors.product')}
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = placeholderImg;
                                  }}
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover bg-gray-100 flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-[10px] sm:text-xs">
                                    {item.nameAr || item.name || t('errors.product')} × {item.quantity}
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
                            <div className="text-[10px] sm:text-xs text-gray-400">+{order.items.length - 2} {t('errors.other')}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">
                      {order.total} EGP
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
