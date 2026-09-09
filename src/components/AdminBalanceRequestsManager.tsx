import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { DollarSign, CheckCircle, XCircle, Clock, Wallet, CreditCard, Banknote, Loader2, Filter, Image as ImageIcon, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function AdminBalanceRequestsManager() {
  const { t } = useTranslation();
  const { sessionToken } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Get all balance requests
  const requests = useQuery(api.balanceRequests.getAllBalanceRequests, { sessionToken, status: statusFilter === "all" ? undefined : statusFilter });

  // Approve mutation
  const approveRequest = useMutation(api.balanceRequests.approveBalanceRequest);

  // Reject mutation
  const rejectRequest = useMutation(api.balanceRequests.rejectBalanceRequest);

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest({ sessionToken, requestId });
      toast.success("تمت الموافقة على الطلب بنجاح");
    } catch (error: any) {
      toast.error(error.message || "فشلت الموافقة على الطلب");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }

    try {
      await rejectRequest({
        sessionToken,
        requestId: selectedRequest._id,
        rejectionReason,
      });
      toast.success("تم رفض الطلب بنجاح");
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.message || "فشل رفض الطلب");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 ml-1" />
            قيد الانتظار
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 ml-1" />
            تمت الموافقة
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </span>
        );
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return <Banknote className="w-5 h-5" />;
      case "cash":
        return <Wallet className="w-5 h-5" />;
      case "card":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "تحويل بنكي";
      case "cash":
        return "نقداً";
      case "card":
        return "بطاقة ائتمان";
      default:
        return method;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">طلبات شحن الرصيد</h2>
          <p className="text-gray-600 mt-1">إدارة طلبات شحن المحافظ</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">جميع الطلبات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {requests && requests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {requests.map((request: any) => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 rounded-full p-2">
                        {getPaymentMethodIcon(request.paymentMethod)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {request.amount} EGP
                        </p>
                        <p className="text-sm text-gray-600">
                          {getPaymentMethodName(request.paymentMethod)}
                        </p>
                      </div>
                    </div>
                    {request.notes && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                        {request.notes}
                      </p>
                    )}
                    {request.receiptImageUrl && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setSelectedImageUrl(request.receiptImageUrl);
                            setShowImageModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>عرض صورة الإيصال</span>
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(request.createdAt).toLocaleString("ar-EG")}
                    </p>
                    {request.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg">
                        سبب الرفض: {request.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="mr-4 flex flex-col items-end gap-3">
                    {getStatusBadge(request.status)}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          موافقة
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد طلبات شحن
            </h3>
            <p className="text-gray-600">
              {statusFilter === "all" ? "لا توجد طلبات شحن حالياً" : `لا توجد طلبات ${statusFilter === "pending" ? "قيد الانتظار" : statusFilter === "approved" ? "تمت الموافقة عليها" : "مرفوضة"}`}
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">رفض طلب الشحن</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سبب الرفض
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="أدخل سبب رفض الطلب"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  رفض الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImageUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImageUrl(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img
              src={selectedImageUrl}
              alt="صورة الإيصال"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
