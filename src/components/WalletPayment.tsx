import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Phone, Copy, CheckCircle, ArrowLeft, Wallet, Smartphone, Upload, FileImage } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WalletPaymentProps {
  onBack: () => void;
  amount?: number;
  onPaymentComplete: (receiptUrl?: string) => void;
}

export default function WalletPayment({ onBack, amount, onPaymentComplete }: WalletPaymentProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // جلب رقم المحفظة من إعدادات النظام
  const systemSettings = useQuery(api.systemSettings.getSettings);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const walletPhone = systemSettings?.walletPhone || "01012345678"; // رقم افتراضي

  // معالجة رفع صورة الإيصال
  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast.error(t('errors.pleaseUploadImageOnly'));
        return;
      }
      
      // التحقق من حجم الملف (أقصى 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('errors.imageSizeTooLarge'));
        return;
      }
      
      setReceiptFile(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success(t('errors.receiptUploaded'));
    }
  };

  // حذف صورة الإيصال
  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    toast.success(t('errors.receiptDeleted'));
  };

  const copyPhoneNumber = () => {
    if (walletPhone) {
      navigator.clipboard.writeText(walletPhone);
      setCopied(true);
      toast.success(t('errors.walletNumberCopied'));
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(t('errors.walletNumberNotAvailable'));
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!receiptFile) {
      toast.error(t('errors.pleaseUploadReceiptFirst'));
      return;
    }
    
    setPaymentConfirmed(true);
    setIsUploading(true);
    
    try {
      // Upload receipt image to Convex storage
      const uploadUrl = await generateUploadUrl();
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": receiptFile.type },
        body: receiptFile,
      });

      if (!result.ok) {
        throw new Error(t('errors.receiptUploadFailed'));
      }

      const { storageId } = await result.json();
      
      setIsUploading(false);
      toast.success(t('errors.paymentConfirmed'));
      
      // Pass the storage ID to the parent component
      setTimeout(() => {
        onPaymentComplete(storageId);
      }, 500);
    } catch (error) {
      setIsUploading(false);
      toast.error(t('errors.errorUploadingReceipt'));
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{t('errors.walletPayment')}</h2>
        <div className="w-9"></div>
      </div>

      {!paymentConfirmed ? (
        <>
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">{t('errors.amountRequired')}</p>
              <p className="text-4xl font-bold text-gray-900">
                {(amount ?? 0).toFixed(2)} <span className="text-2xl text-gray-700">ج.م</span>
              </p>
              {amount && amount > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {t('errors.withDeliveryAndTax')}
                </p>
              )}
            </div>
          </div>

          {/* Wallet Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t('errors.paymentSteps')}</h3>
                <p className="text-sm text-gray-600">{t('errors.followStepsToComplete')}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-sm text-gray-700">{t('errors.openWalletApp')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-sm text-gray-700">{t('errors.chooseTransferMoney')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-sm text-gray-700">{t('errors.enterWalletNumber')}</p>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('errors.walletNumber')}</p>
                  <p className="text-xl font-bold text-gray-900">{walletPhone || t('errors.loading')}</p>
                </div>
              </div>
              <button
                onClick={copyPhoneNumber}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t('errors.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t('errors.copy')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-blue-600" />
                {t('errors.uploadReceiptImage')}
              </h3>
              <p className="text-sm text-gray-600">{t('errors.uploadClearReceipt')}</p>
            </div>

            {!receiptPreview ? (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('errors.clickToUploadReceipt')}</p>
                  <p className="text-xs text-gray-500">{t('errors.maxSize5MB')}</p>
                </div>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border-2 border-blue-200">
                  <img 
                    src={receiptPreview} 
                    alt={t('errors.paymentReceipt')} 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={removeReceipt}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('errors.imageUploaded')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Instructions */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">{t('errors.importantNotes')}</p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• {t('errors.enterCorrectAmount')} {(amount ?? 0).toFixed(2)} ج.م</li>
                  <li>• {t('errors.keepReceipt')}</li>
                  <li>• {t('errors.transferMayTakeMinutes')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePaymentConfirmation}
              disabled={isUploading || !receiptFile}
              className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                isUploading || !receiptFile
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('errors.confirmingPayment')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {receiptFile ? t('errors.transferredAndUploaded') : t('errors.pleaseUploadReceipt')}
                </>
              )}
            </button>
            
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              {t('errors.backToPaymentMethods')}
            </button>
          </div>
        </>
      ) : (
        /* Success State */
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('errors.paymentReceived')}</h3>
          <p className="text-gray-600 mb-6">
            {t('errors.paymentReceivedMessage')}
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800">
              {t('errors.orderWillBeConfirmed')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
