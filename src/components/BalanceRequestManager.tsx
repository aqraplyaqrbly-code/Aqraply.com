import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { DollarSign, Plus, Clock, CheckCircle, XCircle, Wallet, CreditCard, Banknote, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

export default function BalanceRequestManager() {
  const { t } = useTranslation();
  const { user, sessionToken } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Debug: Log when showRequestForm changes
  const handleSetShowRequestForm = (value: boolean) => {
    console.log('setShowRequestForm called with:', value);
    setShowRequestForm(value);
  };
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [notes, setNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get user's wallet
  const wallet = useQuery(api.wallets.getMyWallet, { sessionToken });

  const systemSettings = useQuery(api.systemSettings.getSettings);

  // Get user's balance requests
  const requests = useQuery(api.balanceRequests.getUserBalanceRequests, { sessionToken });

  // Create balance request mutation
  const createRequest = useMutation(api.balanceRequests.createBalanceRequest);
  
  // Generate upload URL
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast.error("المبلغ يجب أن يكون أكبر من صفر");
        setIsSubmitting(false);
        return;
      }

      let receiptImageId: string | undefined;
      let receiptImageUrl: string | undefined;

      // Upload receipt image if provided
      if (receiptImage) {
        setIsUploading(true);
        try {
          const uploadUrl = await generateUploadUrl();
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": receiptImage.type },
            body: receiptImage,
          });
          
          if (!response.ok) {
            throw new Error("فشل رفع الصورة");
          }

          const { storageId } = await response.json();
          receiptImageId = storageId;
          // Store the storageId, we'll get the URL from backend
          receiptImageUrl = storageId;
        } catch (error: any) {
          toast.error(error.message || "فشل رفع الصورة");
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      await createRequest({
        sessionToken,
        amount: amountNum,
        paymentMethod,
        notes: notes || undefined,
        receiptImageId,
        receiptImageUrl,
      });

      toast.success("تم إرسال طلب الشحن بنجاح");
      handleSetShowRequestForm(false);
      setAmount("");
      setNotes("");
      setReceiptImage(null);
      setReceiptImageUrl("");
    } catch (error: any) {
      toast.error(error.message || "فشل إرسال الطلب");
    } finally {
      setIsSubmitting(false);
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
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm mb-1">رصيد المحفظة الحالي</p>
            <p className="text-4xl font-bold">
              {wallet?.balance || 0} <span className="text-2xl">EGP</span>
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => {
            console.log('Modal content clicked, preventing close');
            e.stopPropagation();
          }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">طلب شحن رصيد</h3>
                <p className="text-sm text-gray-500 mt-1">املأ البيانات التالية لشحن محفظتك</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSetShowRequestForm(false);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  المبلغ (EGP)
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="أدخل المبلغ"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold transition-all"
                    required
                    min="1"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">EGP</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  طريقة الدفع
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'bank_transfer', label: 'تحويل بنكي', icon: Banknote },
                    { value: 'cash', label: 'نقداً', icon: Wallet },
                    { value: 'card', label: 'بطاقة', icon: CreditCard },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPaymentMethod(method.value);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "bank_transfer" && systemSettings?.walletPhone && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <Banknote className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-900 mb-2">
                        رقم المحفظة للتحويل
                      </p>
                      <p className="text-xl font-bold text-blue-900 dir-ltr bg-white px-4 py-2 rounded-lg inline-block">
                        {systemSettings.walletPhone}
                      </p>
                      <p className="text-xs text-blue-700 mt-2">
                        يرجى التحويل على هذا الرقم ثم رفع صورة الإيصال
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="receipt-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                  صورة الإيصال <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer">
                  {receiptImage ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <div className="bg-green-100 rounded-full p-3">
                          <ImageIcon className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{receiptImage.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setReceiptImage(null);
                          setReceiptImageUrl("");
                        }}
                        className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline"
                      >
                        إزالة الصورة
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">
                        اسحب الصورة هنا أو انقر للاختيار
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          e.stopPropagation();
                          const file = e.target.files?.[0];
                          if (file) {
                            setReceiptImage(file);
                            setReceiptImageUrl(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label
                        htmlFor="receipt-upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Upload className="w-4 h-4" />
                        اختيار صورة
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                  ملاحظات <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات إضافية"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSetShowRequestForm(false);
                  }}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </span>
                  ) : (
                    "إرسال الطلب"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">طلبات شحن الرصيد</h2>
          <p className="text-gray-600 mt-1">إدارة طلبات شحن محفظتك</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Opening balance request form');
            handleSetShowRequestForm(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          طلب شحن جديد
        </button>
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
                      <div className="bg-orange-100 rounded-full p-2">
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
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(request.createdAt).toLocaleString("ar-EG")}
                    </p>
                    {request.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg">
                        سبب الرفض: {request.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="mr-4">
                    {getStatusBadge(request.status)}
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
            <p className="text-gray-600 mb-4">
              ابدأ بطلب شحن رصيد لمحفظتك
            </p>
            <button
              onClick={() => handleSetShowRequestForm(true)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              طلب شحن جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
