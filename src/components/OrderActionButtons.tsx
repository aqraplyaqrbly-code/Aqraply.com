import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { CheckCircle, XCircle, Truck, Clock } from "lucide-react";

interface OrderActionButtonsProps {
  orderId: Id<"orders">;
  status: string;
  isLoading?: boolean;
  onAccept: (orderId: Id<"orders">) => void;
  onReject: (orderId: Id<"orders">) => void;
  onPickUp: (orderId: Id<"orders">) => void;
  onStartDelivery: (orderId: Id<"orders">) => void;
  onComplete: (orderId: Id<"orders">) => void;
}

/**
 * Order Action Buttons Component
 * 
 * Handles conditional button visibility and disabled states based on order status
 * 
 * Status transitions:
 * pending → assigned (accepted) → picked_up → delivering → delivered
 *        → rejected (terminal state)
 */
export default function OrderActionButtons({
  orderId,
  status,
  isLoading = false,
  onAccept,
  onReject,
  onPickUp,
  onStartDelivery,
  onComplete,
}: OrderActionButtonsProps) {
  // Determine which buttons should be shown and if they should be disabled
  const shouldShowAccept = status === "ready";
  const shouldShowReject = status === "ready";
  const shouldShowPickUp = status === "assigned";
  const shouldShowStartDelivery = status === "picked_up";
  const shouldShowComplete = status === "delivering";

  // All actions disabled if order is in terminal state (rejected, delivered, cancelled)
  const isTerminal = status === "rejected" || status === "delivered" || status === "cancelled";
  const allDisabled = isLoading || isTerminal;

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {/* Accept Order Button - Only visible and enabled for pending orders */}
      {shouldShowAccept && (
        <button
          onClick={() => onAccept(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[120px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all text-sm sm:text-base ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "اقبل الطلب"}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          استلم الطلب
        </button>
      )}

      {/* Reject Order Button - Only visible and enabled for pending orders */}
      {shouldShowReject && (
        <button
          onClick={() => onReject(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[120px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all text-sm sm:text-base ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "رفض الطلب"}
        >
          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          رفض الطلب
        </button>
      )}

      {/* Pick Up Order Button - Only visible and enabled for assigned orders */}
      {shouldShowPickUp && (
        <button
          onClick={() => onPickUp(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[120px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all text-sm sm:text-base ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "استلم من المتجر"}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          تم الاستلام
        </button>
      )}

      {/* Start Delivery Button - Only visible and enabled for picked_up orders */}
      {shouldShowStartDelivery && (
        <button
          onClick={() => onStartDelivery(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[120px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all text-sm sm:text-base ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "ابدأ التوصيل"}
        >
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          بدء التوصيل
        </button>
      )}

      {/* Complete Order Button - Only visible and enabled for delivering orders */}
      {shouldShowComplete && (
        <button
          onClick={() => onComplete(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[120px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all text-sm sm:text-base ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "أكمل التوصيل"}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          تم التوصيل
        </button>
      )}

      {/* Locked State Display - For rejected/delivered/cancelled orders */}
      {isTerminal && (
        <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center gap-2 text-gray-600 font-medium text-sm sm:text-base">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">
            {status === "delivered"
              ? "✓ تم التوصيل بنجاح - الطلب مكتمل"
              : status === "rejected"
                ? "✗ تم رفض الطلب - لا يمكن تغيير الحالة"
                : "◯ الطلب ملغى"}
          </span>
        </div>
      )}
    </div>
  );
}
