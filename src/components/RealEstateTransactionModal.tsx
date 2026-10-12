import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { CheckCircle, DollarSign, Home, Building2, Info, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

interface RealEstateTransactionModalProps {
  productId: Id<"products">;
  listingType: "sale" | "rent" | "contract_exit";
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RealEstateTransactionModal({
  productId,
  listingType,
  price,
  onClose,
  onSuccess,
}: RealEstateTransactionModalProps) {
  const { t, i18n } = useTranslation();
  const { sessionToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState<"sold" | "rented" | null>(null);

  const markTransaction = useMutation(api.products.markRealEstateTransaction);

  // Calculate commission based on listing type
  const calculateCommission = (type: "sold" | "rented"): number => {
    if (type === "rented") {
      // Fixed fee for rentals (e.g., 50 EGP instead of broker's month)
      return 50;
    } else {
      // Small percentage for sales (0.5%)
      return Math.round(price * 0.005);
    }
  };

  const handleMarkTransaction = async (type: "sold" | "rented") => {
    if (!sessionToken) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setIsProcessing(true);
    setSelectedType(type);

    try {
      const commission = calculateCommission(type);

      await markTransaction({
        productId,
        sessionToken,
        transactionType: type,
        commissionAmount: commission,
      });

      toast.success(
        type === "sold"
          ? "تم توثيق عملية البيع بنجاح!"
          : "تم توثيق عملية الإيجار بنجاح!"
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error marking transaction:", error);
      toast.error("فشل توثيق العملية، يرجى المحاولة مرة أخرى");
    } finally {
      setIsProcessing(false);
      setSelectedType(null);
    }
  };

  const isArabic = i18n.language === 'ar';

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">توثيق إتمام الصفقة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Commission Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-2">آلية العمولة الرمزية من اقربلي</p>
                <p className="text-green-700 text-sm leading-relaxed">
                  بدلاً من دفع شهر السمسار الكامل، تدفع عمولة رمزية صغيرة فقط عند إتمام الصفقة.
                  هذا يوفر عليك الكثير من المال ويضمن جودة الخدمة.
                </p>
              </div>
            </div>

            {/* Current Price */}
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">سعر العقار:</span>
                <span className="text-lg font-bold text-gray-900">{price.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Transaction Options */}
          <div className="space-y-4 mb-6">
            {/* Sale Option */}
            {listingType === "sale" || listingType === "contract_exit" ? (
              <button
                onClick={() => handleMarkTransaction("sold")}
                disabled={isProcessing}
                className={`w-full p-5 border-2 rounded-xl transition-all ${
                  selectedType === "sold"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">تم البيع</p>
                      <p className="text-sm text-gray-600">توثيق عملية بيع العقار</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">العمولة (0.5%)</p>
                    <p className="text-xl font-bold text-green-600">
                      {calculateCommission("sold")} EGP
                    </p>
                  </div>
                </div>
              </button>
            ) : null}

            {/* Rent Option */}
            {listingType === "rent" ? (
              <button
                onClick={() => handleMarkTransaction("rented")}
                disabled={isProcessing}
                className={`w-full p-5 border-2 rounded-xl transition-all ${
                  selectedType === "rented"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">تم الإيجار</p>
                      <p className="text-sm text-gray-600">توثيق عملية إيجار العقار</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">العمولة الثابتة</p>
                    <p className="text-xl font-bold text-blue-600">
                      {calculateCommission("rented")} EGP
                    </p>
                  </div>
                </div>
              </button>
            ) : null}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-3 text-gray-600 font-semibold hover:text-gray-800 transition-all hover:bg-gray-50 rounded-xl"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
