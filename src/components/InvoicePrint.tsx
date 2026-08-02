import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Package, Truck, CreditCard, DollarSign, MapPin, Phone, User, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InvoicePrintProps {
  order: any;
  onClose: () => void;
}

export default function InvoicePrint({ order, onClose }: InvoicePrintProps) {
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: onClose,
  });

  const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
  const deliveryFee = order.deliveryFee || 0;
  const total = order.total || subtotal + deliveryFee;
  const isPaid = order.paymentStatus === 'paid';
  const paymentMethod = order.paymentMethod || 'cash';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{t('errors.invoice')}</h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">{t('errors.orderNumber')}: {order.orderNumber}</p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-white text-orange-600 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('errors.print')}
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="p-4 sm:p-6">
          {/* Store Info */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              {t('errors.storeData')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-500">{t('errors.storeName')}</p>
                <p className="font-semibold text-gray-900">{order.storeInfo?.name || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('errors.phoneNumber')}</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  {order.storeInfo?.phone || '—'}
                </p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="text-gray-500">{t('errors.address')}</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  {order.storeInfo?.address || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              {t('errors.customerData')}
            </h3>
            <div className="text-xs sm:text-sm">
              <div>
                <p className="text-gray-500">{t('errors.name')}</p>
                <p className="font-semibold text-gray-900">{order.customerInfo?.fullName || '—'}</p>
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <div>
                <p className="text-gray-500">{t('errors.orderDate')}</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order._creationTime).toLocaleString('ar-EG')}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              المنتجات
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600">المنتج</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-gray-600">الكمية</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-end text-[10px] sm:text-xs font-semibold text-gray-600">السعر</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-end text-[10px] sm:text-xs font-semibold text-gray-600">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div>
                            <p className="font-medium text-gray-900 text-xs sm:text-sm">{item.nameAr}</p>
                            {(item.color || item.selectedSize) && (
                              <div className="flex gap-1 sm:gap-2 mt-1">
                                {item.color && (
                                  <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded">
                                    {item.color}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded">
                                    {item.selectedSize}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-end text-xs sm:text-sm text-gray-600">{item.price} EGP</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-end text-xs sm:text-sm font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} EGP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-orange-200">
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              الملخص المالي
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">سعر المنتجات</span>
                <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                  سعر التوصيل
                </span>
                <span className="font-semibold text-gray-900">{deliveryFee.toFixed(2)} EGP</span>
              </div>
              <div className="border-t border-orange-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">الإجمالي النهائي</span>
                  <span className="text-lg sm:text-2xl font-bold text-orange-600">{total.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              حالة الدفع
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-500">طريقة الدفع</p>
                <p className="font-semibold text-gray-900">
                  {paymentMethod === 'cash' ? 'نقدي' : paymentMethod === 'card' ? 'بطاقة' : paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-500">حالة الدفع</p>
                <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                  isPaid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {isPaid ? 'مدفوع' : 'غير مدفوع'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">حالة الطلب</p>
            <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm font-semibold ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : order.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {order.status === 'pending' && 'قيد الانتظار'}
              {order.status === 'confirmed' && 'مؤكد'}
              {order.status === 'preparing' && 'قيد التحضير'}
              {order.status === 'ready' && 'جاهز'}
              {order.status === 'delivering' && 'قيد التوصيل'}
              {order.status === 'delivered' && 'تم التوصيل'}
              {order.status === 'cancelled' && 'ملغي'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-b-2xl flex gap-2 sm:gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            طباعة الفاتورة
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-xs sm:text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
