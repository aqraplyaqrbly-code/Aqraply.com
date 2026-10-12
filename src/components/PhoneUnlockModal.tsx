import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { Phone, Lock, Wallet, CheckCircle, X, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

interface PhoneUnlockModalProps {
  productId: Id<"products">;
  ownerPhone: string;
  microFee: number;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export default function PhoneUnlockModal({
  productId,
  ownerPhone,
  microFee,
  onClose,
  onUnlockSuccess,
}: PhoneUnlockModalProps) {
  const { t, i18n } = useTranslation();
  const { sessionToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const unlockPhone = useMutation(api.products.unlockOwnerPhone);
  const wallet = useQuery(api.wallets.getUserWallet, sessionToken ? { userId: sessionToken } : "skip");

  const handleUnlock = async () => {
    if (!sessionToken) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // Check wallet balance
    if (!wallet || wallet.balance < microFee) {
      toast.error("رصيد المحفظة غير كافٍ لدفع الرسوم الرمزية");
      return;
    }

    setIsProcessing(true);

    try {
      await unlockPhone({
        productId,
        sessionToken,
      });

      setIsPaid(true);
      toast.success("تم فتح رقم المالك بنجاح!");
      onUnlockSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error unlocking phone:", error);
      toast.error("فشل فتح رقم المالك، يرجى المحاولة مرة أخرى");
    } finally {
      setIsProcessing(false);
    }
  };

  const isArabic = i18n.language === 'ar';

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">فتح رقم المالك</h2>
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
          {!isPaid ? (
            <>
              {/* Warning Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">سياسة الحماية والخصوصية</p>
                    <p className="text-blue-700">
                      للحفاظ على خصوصية المالك، رقم الهاتف مشفر ويتطلب دفع رسوم رمزية صغيرة لعرضه.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">الرسوم الرمزية</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{microFee} EGP</span>
                </div>
                <p className="text-sm text-gray-600">
                  سُيخصم من محفظتك لحماية المعلومات الشخصية وضمان جودة التواصل.
                </p>
              </div>

              {/* Wallet Balance */}
              {wallet && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">رصيدك الحالي:</span>
                    <span className="text-xl font-bold text-green-600">{wallet.balance} EGP</span>
                  </div>
                </div>
              )}

              {/* Unlock Button */}
              <button
                onClick={handleUnlock}
                disabled={isProcessing || (wallet && wallet.balance < microFee)}
                className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isProcessing || (wallet && wallet.balance < microFee)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    ادفع {microFee} EGP وافتح الرقم
                  </>
                )}
              </button>

              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="w-full py-3 mt-3 text-gray-600 font-semibold hover:text-gray-800 transition-all hover:bg-gray-50 rounded-xl"
              >
                إلغاء
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الفتح بنجاح!</h3>
                <p className="text-gray-600 mb-6">يمكنك الآن التواصل مع المالك مباشرة</p>

                {/* Phone Number */}
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-6 h-6 text-green-600" />
                    <span className="text-3xl font-bold text-green-800 text-2xl" dir="ltr">
                      {ownerPhone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`tel:${ownerPhone}`)}
                  className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  اتصل الآن
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
