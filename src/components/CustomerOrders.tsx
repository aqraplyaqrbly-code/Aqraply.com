import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function CustomerOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const orders = useQuery(api.orders.getCustomerOrders, user?.profile?._id ? { customerId: user.profile._id } : "skip");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "confirmed": return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "preparing": return <Package className="w-5 h-5 text-orange-500" />;
      case "ready": return <Package className="w-5 h-5 text-purple-500" />;
      case "picked_up": return <Truck className="w-5 h-5 text-indigo-500" />;
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return t(`customer.status.${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "preparing": return "bg-orange-50 text-orange-700 border-orange-200";
      case "ready": return "bg-purple-50 text-purple-700 border-purple-200";
      case "picked_up": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered": return "bg-green-50 text-green-700 border-green-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!user?.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('customer.mustLogin')}</h3>
          <p className="text-gray-600 mb-4">{t('customer.loginToViewOrders')}</p>
          <button
            onClick={() => navigate('/customer/login')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('auth.login')}
          </button>
        </div>
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('customer.noOrders')}</h3>
          <p className="text-gray-600 mb-4">{t('customer.noOrdersYet')}</p>
          <button
            onClick={() => navigate('/customer')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('customer.browseStores')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('customer.myOrders')}</h1>
          <p className="text-gray-600">{t('customer.trackOrders')}</p>
        </div>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('customer.order')} #{order._id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')} • {order.items.length} {t('customer.products')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-orange-600">
                      {(order.totalAmount + order.deliveryFee).toFixed(2)} {t('customer.currency')}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                </div>

                {/* Quick View of Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {order.items.slice(0, 4).map((item: any, index: number) => (
                    <OrderItem key={`${item.productId}-${index}`} item={item} />
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                      +{order.items.length - 4} {t('customer.otherProducts')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate(`/customer/review/products/${order._id}`)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      {t('customer.addReview')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
