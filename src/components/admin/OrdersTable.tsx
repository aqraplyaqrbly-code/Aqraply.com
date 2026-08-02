import React, { useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { UserCheck, XCircle, Search, Phone, Package, MapPin, Printer, Eye, RefreshCw } from "lucide-react";
import InvoicePrint from "../InvoicePrint";
import { StatusBadge } from "./StatisticsCards";
import { useOrders } from "../../hooks/useOrders";
import { useImageResolution } from "../../utils/imageUtils";
import { Order } from "../../types/admin";
import { useTranslation } from "react-i18next";

function OrderRow({
  order,
  captains,
  assigningCaptain,
  onStartAssign,
  onAssignCaptain,
  onCancelOrder,
  onSelectInvoice,
  resolveImageSrc,
  t,
}: {
  order: any;
  captains: any[] | null | undefined;
  assigningCaptain: string | null;
  onStartAssign: (orderId: string) => void;
  onAssignCaptain: (orderId: string, captainId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onSelectInvoice: (order: any) => void;
  resolveImageSrc?: (value?: unknown) => string;
  t: any;
}) {
  const captainOptions = useMemo(
    () => captains?.filter((c) => c.isActive && c.isOnline) ?? [],
    [captains]
  );

  return (
    <tr className="min-h-[50px] hover:bg-gray-50 transition-colors">
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold text-purple-700">
        {order.orderNumber}
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900">
            {order.customerInfo?.fullName || "—"}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">{order.customerInfo?.phone || ""}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {order.customerLocation?.addressAr ?? order.deliveryLocation?.addressAr ?? "—"}
          </p>
        </div>
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-medium text-gray-900">
            {order.storeInfo?.name || "—"}
          </div>
          {order.storeInfo?.address && (
            <div className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="break-words">{order.storeInfo?.address}</span>
            </div>
          )}
          {order.storeInfo?.phone && (
            <div className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span className="break-words">{order.storeInfo?.phone}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item: any, idx: number) => (
            <div
              key={`${item.productId ?? item.productCode ?? item.sku ?? item._id ?? item.nameAr}-${idx}`}
              className="flex items-start gap-2"
            >
              <img
                src={resolveImageSrc ? resolveImageSrc(item.imageUrl) : item.imageUrl}
                alt={item.nameAr || item.name || t('admin.ordersTable.product')}
                loading="lazy"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover bg-gray-100 flex-shrink-0"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.onerror = null;
                  t.src = "https://via.placeholder.com/40?text=No+Img";
                }}
              />
              <div className="flex-1">
                <span className="font-medium text-[10px] sm:text-xs">
                  {item.nameAr || item.name || t('admin.ordersTable.product')} × {item.quantity}
                </span>
                {(item.color || item.selectedSize) && (
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    {item.color && <span>{item.color}</span>}
                    {item.color && item.selectedSize && <span>, </span>}
                    {item.selectedSize && <span>{item.selectedSize}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-[10px] sm:text-xs text-gray-400">+{order.items.length - 2} {t('admin.ordersTable.other')}</div>
          )}
        </div>
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="text-[10px] sm:text-xs text-gray-600 space-y-1">
          {order.items.slice(0, 2).map((item: any) => (
            <div key={item.productId ?? item.productCode ?? item.sku ?? item._id ?? item.nameAr} className="font-mono text-[10px] sm:text-xs">
              {item.productCode || item.code || item.sku || item.product?.code || item.product?.sku || "—"}
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-[10px] sm:text-xs text-gray-400">...</div>
          )}
        </div>
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-900">
        {order.total} EGP
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        {order.captainId ? (
          <span className="text-[10px] sm:text-xs text-green-600 font-medium flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> {t('admin.ordersTable.assigned')}
          </span>
        ) : (
          <div className="relative">
            {assigningCaptain === order._id ? (
              <select
                className="text-[10px] sm:text-xs border border-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                onChange={(e) => {
                  if (e.target.value) onAssignCaptain(order._id, e.target.value);
                }}
                defaultValue=""
              >
                <option value="">{t('admin.ordersTable.selectCaptain')}</option>
                {captainOptions.map((c) => (
                  <option key={c._id} value={c.userId}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => onStartAssign(order._id)}
                className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {t('admin.ordersTable.assignCaptain')}
              </button>
            )}
          </div>
        )}
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-500">
        {new Date(order._creationTime).toLocaleDateString("ar-EG")}
      </td>
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {order.paymentMethod === 'wallet' && order.paymentReceiptImage && (
            <button
              onClick={() => window.open(order.paymentReceiptImage, '_blank')}
              className="text-[10px] sm:text-xs bg-green-100 text-green-700 hover:bg-green-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
              title={t('admin.ordersTable.viewReceipt')}
            >
              <Eye className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => onSelectInvoice(order)}
            className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
            title={t('admin.ordersTable.printInvoice')}
          >
            <Printer className="w-3 h-3" />
          </button>
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button
              onClick={() => onCancelOrder(order._id)}
              className="text-[10px] sm:text-xs bg-red-100 text-red-700 hover:bg-red-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors"
            >
              {t('admin.ordersTable.cancel')}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function areOrderRowPropsEqual(prevProps: any, nextProps: any) {
  if (prevProps.resolveImageSrc !== nextProps.resolveImageSrc) return false;
  if (prevProps.assigningCaptain !== nextProps.assigningCaptain) return false;

  const prevOrder = prevProps.order;
  const nextOrder = nextProps.order;
  if (!prevOrder || !nextOrder || prevOrder._id !== nextOrder._id) return false;
  if (
    prevOrder.orderNumber !== nextOrder.orderNumber ||
    prevOrder.total !== nextOrder.total ||
    prevOrder.status !== nextOrder.status ||
    prevOrder.captainId !== nextOrder.captainId ||
    prevOrder.paymentMethod !== nextOrder.paymentMethod ||
    prevOrder.paymentReceiptImage !== nextOrder.paymentReceiptImage
  ) {
    return false;
  }

  const prevCust = prevOrder.customerInfo ?? {};
  const nextCust = nextOrder.customerInfo ?? {};
  if (prevCust.fullName !== nextCust.fullName || prevCust.phone !== nextCust.phone) return false;

  if (
    (prevOrder.customerLocation?.addressAr ?? "") !== (nextOrder.customerLocation?.addressAr ?? "") ||
    (prevOrder.deliveryLocation?.addressAr ?? "") !== (nextOrder.deliveryLocation?.addressAr ?? "")
  ) {
    return false;
  }

  const prevStore = prevOrder.storeInfo ?? {};
  const nextStore = nextOrder.storeInfo ?? {};
  if (
    prevStore.name !== nextStore.name ||
    prevStore.address !== nextStore.address ||
    prevStore.phone !== nextStore.phone
  ) {
    return false;
  }

  if (prevOrder.items.length !== nextOrder.items.length) return false;
  for (let i = 0; i < prevOrder.items.length; i++) {
    const prevItem = prevOrder.items[i];
    const nextItem = nextOrder.items[i];
    if (
      prevItem.productId !== nextItem.productId ||
      prevItem.productCode !== nextItem.productCode ||
      prevItem.sku !== nextItem.sku ||
      prevItem.quantity !== nextItem.quantity ||
      prevItem.nameAr !== nextItem.nameAr ||
      prevItem.imageUrl !== nextItem.imageUrl ||
      prevItem.color !== nextItem.color ||
      prevItem.selectedSize !== nextItem.selectedSize ||
      prevItem.price !== nextItem.price
    ) {
      return false;
    }
  }

  const prevCaptains = prevProps.captains ?? [];
  const nextCaptains = nextProps.captains ?? [];
  if (prevCaptains.length !== nextCaptains.length) return false;
  for (let i = 0; i < prevCaptains.length; i++) {
    const prevCaptain = prevCaptains[i];
    const nextCaptain = nextCaptains[i];
    if (
      prevCaptain._id !== nextCaptain._id ||
      prevCaptain.userId !== nextCaptain.userId ||
      prevCaptain.fullName !== nextCaptain.fullName ||
      prevCaptain.isActive !== nextCaptain.isActive ||
      prevCaptain.isOnline !== nextCaptain.isOnline
    ) {
      return false;
    }
  }

  return true;
}

const MemoizedOrderRow = React.memo(OrderRow, areOrderRowPropsEqual);

export function OrdersTable() {
  const { t } = useTranslation();
  const {
    orders,
    filteredOrders,
    captainOptions,
    selectedStatus,
    searchTerm,
    assigningCaptain,
    selectedOrderForInvoice,
    handleSearchTermChange,
    handleSelectStatus,
    handleStartAssign,
    handleSelectInvoice,
    handleAssignCaptain,
    handleCancelOrder,
    setSelectedOrderForInvoice,
  } = useOrders();

  const resolveImageSrc = useImageResolution(filteredOrders || []);

  const statuses = [
    { key: null, label: t('admin.ordersTable.statuses.all') },
    { key: "pending", label: t('admin.ordersTable.statuses.pending') },
    { key: "confirmed", label: t('admin.ordersTable.statuses.confirmed') },
    { key: "assigned", label: t('admin.ordersTable.statuses.assigned') },
    { key: "preparing", label: t('admin.ordersTable.statuses.preparing') },
    { key: "ready", label: t('admin.ordersTable.statuses.ready') },
    { key: "delivering", label: t('admin.ordersTable.statuses.delivering') },
    { key: "delivered", label: t('admin.ordersTable.statuses.delivered') },
    { key: "cancelled", label: t('admin.ordersTable.statuses.cancelled') },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('admin.ordersTable.title')}</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {orders ? `${orders.length} ${t('admin.ordersTable.totalOrders')}` : t('admin.ordersTable.loading')}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.ordersTable.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full pr-10 pl-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            {statuses.map(({ key, label }) => (
              <button
                key={String(key)}
                onClick={() => handleSelectStatus(key)}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === key
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full min-w-[900px]">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.orderNumber')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-40">{t('admin.ordersTable.customer')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-56">{t('admin.ordersTable.storeData')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-80">{t('admin.ordersTable.products')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.productCode')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-24">{t('admin.ordersTable.amount')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.status')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.captain')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.date')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase w-28">{t('admin.ordersTable.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!orders ? (
                <tr>
                  <td colSpan={10} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">{t('admin.ordersTable.loading')}</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-xs sm:text-sm">{t('admin.ordersTable.noOrders')}</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <MemoizedOrderRow
                    key={order._id}
                    order={order}
                    captains={captainOptions}
                    assigningCaptain={assigningCaptain}
                    onStartAssign={handleStartAssign}
                    onAssignCaptain={handleAssignCaptain}
                    onCancelOrder={handleCancelOrder}
                    onSelectInvoice={handleSelectInvoice}
                    resolveImageSrc={resolveImageSrc}
                    t={t}
                  />
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
