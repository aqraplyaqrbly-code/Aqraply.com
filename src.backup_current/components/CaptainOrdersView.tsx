import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Package, MapPin, Phone, User, Navigation, CheckCircle, Store } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

const currency = "EGP";

interface Order {
  _id: Id<"orders">;
  orderNumber: string;
  status: string;
  total: number;
  customerInfo?: {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
  };
  storeInfo?: {
    name: string;
    address: string;
    phone: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address: string;
    addressAr: string;
  };
  items: Array<{
    productId: Id<"products">;
    name: string;
    nameAr: string;
    quantity: number;
    price: number;
  }>;
}

export default function CaptainOrdersView() {
  const orders = (useQuery(api.orders.getCaptainOrders, {}) || []) as Order[];
  const updateStatus = useMutation(api.orders.updateOrderStatusByCaptain);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter((order: Order) => order.status === selectedStatus);

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
      assigned: "bg-purple-100 text-purple-800",
      picked_up: "bg-blue-100 text-blue-800",
      delivering: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusArabic = (status: string) => {
    const statusMap: Record<string, string> = {
      assigned: "تم التعيين",
      picked_up: "تم الاستلام",
      delivering: "قيد التوصيل",
      delivered: "تم التوصيل",
    };
    return statusMap[status] || status;
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">طلبات التوصيل</h1>
          <p className="text-gray-600">إدارة طلبات التوصيل الخاصة بك</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: "all", label: "الكل" },
              { value: "assigned", label: "جديد" },
              { value: "picked_up", label: "تم الاستلام" },
              { value: "delivering", label: "قيد التوصيل" },
              { value: "delivered", label: "تم التوصيل" },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  selectedStatus === status.value
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => (
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
                  <p className="text-xl font-bold text-purple-600">{order.total.toFixed(2)} {currency}</p>
                </div>
              </div>

              {/* معلومات المتجر */}
              {order.storeInfo && (
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-purple-600" />
                    معلومات المتجر
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-700 font-medium">{order.storeInfo.name}</span>
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

              {/* معلومات العميل */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  معلومات العميل
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{order.customerInfo?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${order.customerInfo?.phone}`} className="text-blue-600 font-mono hover:underline">
                      {order.customerInfo?.phone}
                    </a>
                  </div>
                  {order.customerInfo?.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{order.customerInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* عنوان التوصيل */}
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  عنوان التوصيل
                </h4>
                <p className="text-sm text-gray-700 mb-3">{order.deliveryLocation.addressAr}</p>
                <button
                  onClick={() => openInMaps(order.deliveryLocation.latitude, order.deliveryLocation.longitude)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  فتح في الخرائط
                </button>
              </div>

              {/* المنتجات */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">المنتجات</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-900 font-medium">
                          {item.nameAr} × {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} {currency}</span>
                      </div>
                      {(item.color || item.selectedSize) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.color && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              اللون: {item.color}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              المقاس: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex gap-3">
                {order.status === "assigned" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "picked_up")}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    تم الاستلام من المتجر
                  </button>
                )}
                {order.status === "picked_up" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "delivering")}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    في الطريق للعميل
                  </button>
                )}
                {order.status === "delivering" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "delivered")}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    تم التوصيل
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600">لم يتم تعيين أي طلبات لك بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
