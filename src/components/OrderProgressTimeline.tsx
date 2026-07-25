import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

interface OrderProgressTimelineProps {
  status: string;
  orderId?: Id<"orders">;
  role?: "captain" | "merchant" | "admin" | "customer";
  onPickUp?: (orderId: Id<"orders">) => void;
  onStartDelivery?: (orderId: Id<"orders">) => void;
  onComplete?: (orderId: Id<"orders">) => void;
  onAccept?: (orderId: Id<"orders">) => void;
  onReject?: (orderId: Id<"orders">) => void;
  onPrepare?: (orderId: Id<"orders">) => void;
  onReady?: (orderId: Id<"orders">) => void;
  onAssignCaptain?: (orderId: Id<"orders">) => void;
}

/**
 * Order Progress Timeline Component
 * 
 * Shows visual representation of order state progression
 * Clickable stages based on user role
 * 
 * Flow by role:
 * Captain: pending → assigned → picked_up → delivering → delivered
 * Merchant: pending → confirmed → preparing → ready → delivering → delivered
 * Admin: Full control over all stages
 * Customer: View only
 */
export default function OrderProgressTimeline({ 
  status, 
  orderId,
  role = "customer",
  onPickUp,
  onStartDelivery,
  onComplete,
  onAccept,
  onReject,
  onPrepare,
  onReady,
  onAssignCaptain
}: OrderProgressTimelineProps) {
  // Define stages based on role
  const captainStages = [
    { id: "ready", label: "جاهز للاستلام", icon: Clock, color: "teal", clickable: true, action: onAccept },
    { id: "assigned", label: "تم القبول", icon: CheckCircle, color: "blue", clickable: true, action: onPickUp },
    { id: "picked_up", label: "تم الاستلام", icon: CheckCircle, color: "purple", clickable: true, action: onStartDelivery },
    { id: "delivering", label: "قيد التوصيل", icon: CheckCircle, color: "orange", clickable: true, action: onComplete },
    { id: "delivered", label: "تم التوصيل", icon: CheckCircle, color: "green", clickable: false },
  ];

  const merchantStages = [
    { id: "pending", label: "قيد الانتظار", icon: Clock, color: "yellow", clickable: false },
    { id: "confirmed", label: "مؤكد", icon: CheckCircle, color: "blue", clickable: false },
    { id: "preparing", label: "قيد التحضير", icon: CheckCircle, color: "purple", clickable: true, action: onPrepare },
    { id: "ready", label: "جاهز", icon: CheckCircle, color: "teal", clickable: true, action: onReady },
    { id: "delivering", label: "قيد التوصيل", icon: CheckCircle, color: "orange", clickable: false },
    { id: "delivered", label: "تم التوصيل", icon: CheckCircle, color: "green", clickable: false },
  ];

  const adminStages = [
    { id: "pending", label: "قيد الانتظار", icon: Clock, color: "yellow", clickable: true, action: onAssignCaptain },
    { id: "assigned", label: "تم التعيين", icon: CheckCircle, color: "blue", clickable: true, action: onAssignCaptain },
    { id: "picked_up", label: "تم الاستلام", icon: CheckCircle, color: "purple", clickable: true, action: onPickUp },
    { id: "delivering", label: "قيد التوصيل", icon: CheckCircle, color: "orange", clickable: true, action: onStartDelivery },
    { id: "delivered", label: "تم التوصيل", icon: CheckCircle, color: "green", clickable: false },
  ];

  const customerStages = [
    { id: "pending", label: "قيد الانتظار", icon: Clock, color: "yellow", clickable: false },
    { id: "confirmed", label: "مؤكد", icon: CheckCircle, color: "blue", clickable: false },
    { id: "preparing", label: "قيد التحضير", icon: CheckCircle, color: "purple", clickable: false },
    { id: "ready", label: "جاهز", icon: CheckCircle, color: "teal", clickable: false },
    { id: "delivering", label: "قيد التوصيل", icon: CheckCircle, color: "orange", clickable: false },
    { id: "delivered", label: "تم التوصيل", icon: CheckCircle, color: "green", clickable: false },
  ];

  const stagesMap: Record<string, typeof captainStages> = {
    captain: captainStages,
    merchant: merchantStages,
    admin: adminStages,
    customer: customerStages,
  };

  const stages = stagesMap[role] || customerStages;

  // Get current stage index
  const currentStageIndex = stages.findIndex((s) => s.id === status);
  const isRejected = status === "rejected";

  // Get color classes for completed, current, and pending stages
  const getStageColor = (index: number) => {
    if (isRejected) {
      return "bg-red-100 text-red-600 border-red-200";
    }

    if (index < currentStageIndex) {
      return "bg-green-100 text-green-600 border-green-200"; // Completed
    }
    if (index === currentStageIndex) {
      const colorMap: Record<string, string> = {
        yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
        blue: "bg-blue-100 text-blue-600 border-blue-200",
        purple: "bg-purple-100 text-purple-600 border-purple-200",
        teal: "bg-teal-100 text-teal-600 border-teal-200",
        orange: "bg-orange-100 text-orange-600 border-orange-200",
        green: "bg-green-100 text-green-600 border-green-200",
      };
      return colorMap[stages[index].color] || "bg-gray-100 text-gray-600 border-gray-200";
    }
    return "bg-gray-100 text-gray-400 border-gray-200"; // Not started
  };

  const getLineColor = (index: number) => {
    if (isRejected) {
      return "bg-red-200";
    }
    return index < currentStageIndex ? "bg-green-200" : "bg-gray-200";
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
      {isRejected ? (
        <div className="flex items-center justify-center gap-3 py-2">
          <XCircle className="w-6 h-6 text-red-600" />
          <span className="font-semibold text-red-600">تم رفض الطلب</span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Stage Icon */}
              <div 
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  stage.clickable && index === currentStageIndex ? 'hover:scale-110' : ''
                }`}
                onClick={() => {
                  console.log("Stage clicked:", stage.id, "index:", index, "currentStageIndex:", currentStageIndex);
                  console.log("Stage clickable:", stage.clickable, "has action:", !!stage.action);
                  if (stage.clickable && orderId && stage.action && index === currentStageIndex) {
                    console.log("Executing action for stage:", stage.id);
                    stage.action(orderId);
                  }
                }}
                title={stage.clickable && index === currentStageIndex ? `اضغط للانتقال إلى ${stages[index + 1]?.label || 'المرحلة التالية'}` : ''}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    stage.clickable && index === currentStageIndex 
                      ? 'hover:shadow-lg hover:border-opacity-100 cursor-pointer' 
                      : ''
                  } ${getStageColor(index)}`}
                >
                  <stage.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {stage.label}
                </span>
              </div>

              {/* Connecting Line (except after last stage) */}
              {index < stages.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded-full ${getLineColor(index)} transition-all`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Status Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 text-center">
        {isRejected && "الطلب في حالة نهائية - لا يمكن إجراء أي تحديثات"}
        {status === "pending" &&
          "الطلب قيد الانتظار - اضغط 'استلم الطلب' أو 'رفض الطلب'"}
        {status === "assigned" &&
          "تم قبول الطلب - اضغط على 'تم الاستلام' عند الوصول للمتجر"}
        {status === "picked_up" &&
          "تم استلام الطلب - اضغط على 'قيد التوصيل' لبدء التوصيل"}
        {status === "delivering" &&
          "الطلب قيد التوصيل - اضغط على 'تم التوصيل' عند الانتهاء"}
        {status === "delivered" && "✓ تم التوصيل بنجاح - الطلب مكتمل"}
      </div>
    </div>
  );
}

