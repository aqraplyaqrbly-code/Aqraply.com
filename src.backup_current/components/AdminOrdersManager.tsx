import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Package, User, MapPin, Phone, Mail, Clock, DollarSign, Store, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

const currency = "EGP";

export default function AdminOrdersManager() {
  const orders = useQuery(api.orders.getAllOrders) || [];
  const captains = useQuery(api.captains.getAvailableCaptains) || [];
  const assignCaptain = useMutation(api.admin.assignCaptainToOrder);
  const updateStatus = useMutation(api.orders.updateOrderStatus);

  // Calculate store statistics
  const storeStats = orders.reduce((acc, order) => {
    if (!order.storeInfo?.name) return acc;
    
    const storeName = order.storeInfo.name;
    if (!acc[storeName]) {
      acc[storeName] = {
        name: order.storeInfo.name,
        nameEn: order.storeInfo.nameEn,
        phone: order.storeInfo.phone,
        address: order.storeInfo.address,
        totalOrders: 0,
        totalRevenue: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
      };
    }
    
    acc[storeName].totalOrders++;
    acc[storeName].totalRevenue += order.total;
    
    if (order.status === "delivered") {
      acc[storeName].deliveredOrders++;
    } else if (order.status === "pending" || order.status === "confirmed") {
      acc[storeName].pendingOrders++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const [selectedOrder, setSelectedOrder] = useState<Id<"orders"> | null>(null);
  const [selectedCaptain, setSelectedCaptain] = useState<Id<"users"> | null>(null);

  const handleAssignCaptain = async () => {
    if (!selectedOrder || !selectedCaptain) {
      toast.error("يرجى اختيار الطلب والكابتن");
      return;
    }

    try {
      await assignCaptain({ orderId: selectedOrder, captainId: selectedCaptain });
      toast.success("تم تعيين الكابتن بنجاح");
      setSelectedOrder(null);
      setSelectedCaptain(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  const handleUpdateStatus = async (orderId: Id<"orders">, status: string) => {
    try {
      await updateStatus({ orderId, status });
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      assigned: "bg-purple-100 text-purple-800",
      preparing: "bg-orange-100 text-orange-800",
      delivering: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusArabic = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      assigned: "تم التعيين",
      preparing: "قيد التحضير",
      delivering: "قيد التوصيل",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الطلبات</h1>
          <p className="text-gray-600">عرض وإدارة جميع الطلبات وتعيين الكباتن</p>
        </div>

        {/* إحصائيات المتاجر */}
        {Object.keys(storeStats).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إحصائيات المتاجر</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(storeStats).map(([storeName, stats]) => (
                <div key={storeName} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{stats.name}</h3>
                      {stats.nameEn && (
                        <p className="text-xs text-gray-500">{stats.nameEn}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">إجمالي الطلبات</p>
                      <p className="font-bold text-lg text-blue-600">{stats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">الإيرادات</p>
                      <p className="font-bold text-lg text-green-600">{stats.totalRevenue.toFixed(2)} {currency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">مكتمل</p>
                      <p className="font-bold text-green-600">{stats.deliveredOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">معلق</p>
                      <p className="font-bold text-orange-600">{stats.pendingOrders}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="w-3 h-3" />
                      <span>{stats.phone}</span>
                    </div>
                    {stats.address && (
                      <div className="flex items-start gap-2 text-xs text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{stats.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتجات</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان المتجر</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتجر</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكابتن</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerInfo?.fullName || '—'}</div>
                      <div className="text-xs text-gray-500">{order.customerInfo?.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span>{item.nameAr}</span>
                            <span className="text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-500">+{order.items.length - 2} منتجات أخرى</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 mb-1">📍 {order.storeInfo?.nameAr || '—'}</div>
                        <div className="text-xs text-gray-700 mb-1">{order.storeInfo?.addressAr || order.storeInfo?.address || '—'}</div>
                        <div className="text-xs text-blue-600 font-medium">📞 {order.storeInfo?.phone || '—'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-purple-600">{order.total.toFixed(2)} {currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusArabic(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.storeInfo?.name || '—'}</div>
                        <div className="text-xs text-gray-500">{order.storeInfo?.phone || '—'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.captainId ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-xs text-gray-600">معين</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">غير معين</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <button
                        onClick={() => setSelectedOrder(order._id)}
                        className="text-purple-600 hover:text-purple-900 font-medium text-sm"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid gap-6">
          {orders.filter(order => selectedOrder === order._id).map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusArabic(order.status)}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-purple-600">{order.total.toFixed(2)} {currency}</p>
                  <p className="text-xs text-gray-500">الإجمالي</p>
                </div>
              </div>

              {/* معلومات المتجر */}
              {order.storeInfo && (
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-purple-600" />
                    معلومات المتجر
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-gray-700 font-medium">{order.storeInfo.name}</span>
                        {order.storeInfo.nameEn && (
                          <span className="text-gray-500 text-xs block">{order.storeInfo.nameEn}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <a href={`tel:${order.storeInfo.phone}`} className="text-purple-600 font-mono hover:underline">
                        {order.storeInfo.phone}
                      </a>
                    </div>
                    {order.storeInfo.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{order.storeInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* معلومات العميل والبائع */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  بيانات العميل والبائع
                </h4>
                
                {/* بيانات العميل */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">معلومات العميل</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.customerInfo?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-mono">{order.customerInfo?.phone}</span>
                    </div>
                    {order.customerInfo?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.customerInfo.email}</span>
                      </div>
                    )}
                    {order.customerInfo?.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{order.customerInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* بيانات البائع/التاجر */}
                {order.storeInfo && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-2">معلومات البائع</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 mb-1">📍 {order.storeInfo.nameAr || order.storeInfo.name || '—'}</div>
                        <div className="text-xs text-gray-700 mb-1">{order.storeInfo.addressAr || order.storeInfo.address || '—'}</div>
                        <div className="text-xs text-blue-600 font-medium">📞 {order.storeInfo.phone || '—'}</div>
                        {order.storeInfo.nameEn && (
                          <div className="text-xs text-gray-500 mt-1">{order.storeInfo.nameEn}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* عنوان التوصيل */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  عنوان التوصيل
                </h4>
                <p className="text-sm text-gray-700">{order.deliveryLocation.addressAr}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.deliveryLocation.latitude.toFixed(6)}, {order.deliveryLocation.longitude.toFixed(6)}
                </p>
              </div>

              {/* معلومات المتجر والمنتجات */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* معلومات المتجر */}
                {order.storeInfo && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Store className="w-4 h-4 text-red-600" />
                      بيانات المتجر التفصيلية
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Store className="w-4 h-4 text-red-400" />
                        <div>
                          <span className="text-gray-700 font-medium">{order.storeInfo.name}</span>
                          {order.storeInfo.nameEn && (
                            <span className="text-gray-500 text-xs block">{order.storeInfo.nameEn}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-red-400" />
                        <a href={`tel:${order.storeInfo.phone}`} className="text-red-600 font-mono hover:underline">
                          {order.storeInfo.phone}
                        </a>
                      </div>
                      {order.storeInfo.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{order.storeInfo.address}</span>
                        </div>
                      )}
                      
                      {/* إحصائيات المتجر */}
                      <div className="pt-3 border-t border-red-200">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-gray-600">نشط</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-gray-600">مقيّم</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* تفاصيل المنتجات */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">تفاصيل المنتجات</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-900">{item.nameAr}</h5>
                            <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                          </div>
                          <span className="font-bold text-lg text-orange-600">{(item.price * item.quantity).toFixed(2)} {currency}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">الكمية:</span>
                            <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded">{item.quantity} قطعة</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">السعر الواحد:</span>
                            <span className="font-medium text-gray-900">{item.price.toFixed(2)} {currency}</span>
                          </div>
                          
                          {item.color && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">اللون:</span>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border border-gray-300" style={{backgroundColor: item.color}}></div>
                                <span className="font-medium text-gray-900">{item.color}</span>
                              </div>
                            </div>
                          )}
                          
                          {item.selectedSize && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">المقاس:</span>
                              <span className="font-medium text-gray-900 bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.selectedSize}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* تفاصيل السعر */}
              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{order.subtotal.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم التوصيل</span>
                  <span className="font-medium">{order.deliveryFee.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">العمولة</span>
                  <span className="font-medium text-purple-600">{order.commission.toFixed(2)} {currency}</span>
                </div>
              </div>

              {/* تعيين الكابتن */}
              {order.status === "confirmed" && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">تعيين كابتن للتوصيل</h4>
                  <div className="flex gap-3">
                    <select
                      value={selectedOrder === order._id ? selectedCaptain || "" : ""}
                      onChange={(e) => {
                        setSelectedOrder(order._id);
                        setSelectedCaptain(e.target.value as Id<"users">);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">اختر كابتن</option>
                      {captains.map((captain) => (
                        <option key={captain._id} value={captain.userId}>
                          {captain.fullName} - {captain.vehicleType}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignCaptain}
                      disabled={selectedOrder !== order._id || !selectedCaptain}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      تعيين
                    </button>
                  </div>
                </div>
              )}

              {/* معلومات الكابتن المعين */}
              {order.captainId && (
                <div className="bg-green-50 rounded-xl p-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">الكابتن المعين</h4>
                  <p className="text-sm text-gray-700">تم تعيين كابتن لهذا الطلب</p>
                </div>
              )}

              {/* إجراءات سريعة للمتجر */}
              {order.storeInfo && (
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">إجراءات سريعة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => window.open(`tel:${order.storeInfo.phone}`)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>اتصل بالمتجر</span>
                    </button>
                    <button
                      onClick={() => {
                        if (order.storeInfo.address) {
                          window.open(`https://maps.google.com/?q=${encodeURIComponent(order.storeInfo.address)}`);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>عرض الخريطة</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.storeInfo.phone);
                        toast.success("تم نسخ رقم الهاتف");
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Store className="w-3 h-3 text-blue-600" />
                      <span>نسخ البيانات</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600">لم يتم إنشاء أي طلبات بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
