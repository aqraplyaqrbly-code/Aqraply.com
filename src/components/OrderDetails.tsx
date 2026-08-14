import { useState } from "react";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Clock, MapPin, Phone, CreditCard, Package, CheckCircle } from "lucide-react";
import OrderItem from "./OrderItem";
import { useAuth } from "../contexts/AuthContextNew";

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAuthenticated, sessionToken } = useAuth();
  const [order] = useQuery(api.orders.getOrderById, isAuthenticated && orderId ? { orderId: orderId as any, sessionToken } : "skip");

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">الطلب غير موجود</h3>
          <p className="text-gray-600">لم يتم العثور على تفاصيل الطلب</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-orange-100 text-orange-800";
      case "ready": return "bg-purple-100 text-purple-800";
      case "picked_up": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "confirmed": return "تم التأكيد";
      case "preparing": return "قيد التحضير";
      case "ready": return "جاهز للتسليم";
      case "picked_up": return "تم الاستلام";
      case "delivered": return "تم التسليم";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash": return "الدفع عند الاستلام";
      case "wallet": return "المحفظة الإلكترونية";
      case "card": return "بطاقة الائتمان";
      default: return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب #{order._id.slice(0, 8)}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{getPaymentMethodText(order.paymentMethod)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order.items.length} منتج</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المنتجات</h2>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <OrderItem key={`${item.productId}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات التوصيل</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900 font-medium">{order.customerLocation.addressAr}</p>
                <p className="text-sm text-gray-600 mt-1">
                  📍 {order.customerLocation.latitude.toFixed(4)}, {order.customerLocation.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            {order.deliveryInstructions && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">تعليمات التوصيل</p>
                  <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="text-gray-900">{order.totalAmount.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">رسوم التوصيل</span>
              <span className="text-gray-900">{order.deliveryFee.toFixed(2)} ج.م</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">الإجمالي</span>
                <span className="font-bold text-orange-600 text-lg">
                  {(order.totalAmount + order.deliveryFee).toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
