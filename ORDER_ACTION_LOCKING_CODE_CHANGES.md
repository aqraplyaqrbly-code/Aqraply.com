# Order Action Locking - Complete Code Changes

## 1. convex/schema.ts

### Change: Added "rejected" status to orders table

```typescript
// Line 152 - Updated status union
orders: defineTable({
    customerId: v.id("profiles"),
    storeId: v.id("stores"),
    captainId: v.optional(v.id("profiles")),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      nameAr: v.string(),
      price: v.number(),
      quantity: v.number(),
      imageUrl: v.optional(v.string()),
      color: v.optional(v.string()),
      size: v.optional(v.string()),
      sku: v.optional(v.string()),
      productCode: v.optional(v.string()),
      code: v.optional(v.string()),
    })),
    totalAmount: v.number(),
    deliveryFee: v.number(),
    // ✅ CHANGED: Added "rejected" to status options
    status: v.union(
      v.literal("pending"), 
      v.literal("confirmed"), 
      v.literal("preparing"), 
      v.literal("ready"), 
      v.literal("picked_up"), 
      v.literal("assigned"), 
      v.literal("delivering"), 
      v.literal("delivered"), 
      v.literal("rejected"),  // ← NEW
      v.literal("cancelled")
    ),
    customerLocation: v.object({
      address: v.string(),
      addressAr: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    // ... rest of schema
})
```

---

## 2. convex/orders.ts

### Update 1: updateOrderStatus() - Accept rejected status

```typescript
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    // ✅ CHANGED: Added "rejected" to allowed statuses
    status: v.union(
      v.literal("pending"), 
      v.literal("confirmed"), 
      v.literal("preparing"), 
      v.literal("ready"), 
      v.literal("picked_up"), 
      v.literal("delivered"), 
      v.literal("rejected"),  // ← NEW
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const { orderId, status } = args;
    await ctx.db.patch(orderId, {
      status,
      updatedAt: Date.now(),
      ...(status === "delivered" ? { actualDeliveryTime: Date.now() } : {})
    });
  },
});
```

---

### Update 2: acceptOrder() - Add validation

```typescript
// ✅ CHANGED: Added transition validation
export const acceptOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // ✅ NEW: Validate status transition
    if (order.status !== "pending") {
      throw new ConvexError(
        `لا يمكن قبول طلب في حالة ${order.status}. يجب أن يكون الطلب قيد الانتظار`
      );
    }

    await ctx.db.patch(args.orderId, {
      captainId: profile._id,
      status: "assigned",
      updatedAt: Date.now(),
    });
  },
});
```

---

### Update 3: rejectOrder() - Set to rejected status with validation

```typescript
// ✅ CHANGED: Set status to "rejected" instead of "pending", add validation
export const rejectOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // ✅ NEW: Validate status transition
    if (order.status !== "pending") {
      throw new ConvexError(
        `لا يمكن رفض طلب في حالة ${order.status}. يجب أن يكون الطلب قيد الانتظار`
      );
    }

    // ✅ CHANGED: Set status to "rejected" (terminal) instead of "pending"
    await ctx.db.patch(args.orderId, {
      captainId: undefined,
      status: "rejected",  // ← Was: "pending"
      updatedAt: Date.now(),
    });
  },
});
```

---

### Update 4: updateOrderStatusByCaptain() - Add validation

```typescript
// ✅ CHANGED: Added transition validation
export const updateOrderStatusByCaptain = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("assigned"), v.literal("delivering")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // ✅ NEW: Validate status transitions
    if (args.status === "delivering") {
      // Can only start delivery from assigned status
      if (order.status !== "assigned") {
        throw new ConvexError(
          `لا يمكن بدء التوصيل من حالة ${order.status}. يجب أن يكون الطلب معيناً أولاً`
        );
      }
    }

    await ctx.db.patch(args.orderId, {
      captainId: profile._id,
      status: args.status,
      updatedAt: Date.now(),
      ...(args.status === "delivering" ? { pickupTime: Date.now() } : {}),
    });
  },
});
```

---

### Update 5: completeOrder() - Add validation

```typescript
// ✅ CHANGED: Added transition validation and captain authorization
export const completeOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // ✅ NEW: Validate status transition
    if (order.status !== "delivering") {
      throw new ConvexError(
        `لا يمكن إكمال طلب في حالة ${order.status}. يجب أن يكون الطلب قيد التوصيل`
      );
    }

    // ✅ NEW: Validate captain authorization
    if (order.captainId !== profile._id) {
      throw new ConvexError("ليس لديك صلاحية لإكمال هذا الطلب");
    }

    await ctx.db.patch(args.orderId, {
      captainId: profile._id,
      status: "delivered",
      actualDeliveryTime: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

---

## 3. src/components/OrderActionButtons.tsx (NEW FILE)

```typescript
import React from "react";
import { Id } from "@convex-dev/client";
import { CheckCircle, XCircle, Truck, Clock } from "lucide-react";

interface OrderActionButtonsProps {
  orderId: Id<"orders">;
  status: string;
  isLoading?: boolean;
  onAccept: (orderId: Id<"orders">) => void;
  onReject: (orderId: Id<"orders">) => void;
  onStartDelivery: (orderId: Id<"orders">) => void;
  onComplete: (orderId: Id<"orders">) => void;
}

/**
 * Order Action Buttons Component
 * 
 * Handles conditional button visibility and disabled states based on order status
 * 
 * Status transitions:
 * pending → accepted (assigned) → in_transit (delivering) → delivered
 *        → rejected (terminal state)
 */
export default function OrderActionButtons({
  orderId,
  status,
  isLoading = false,
  onAccept,
  onReject,
  onStartDelivery,
  onComplete,
}: OrderActionButtonsProps) {
  // Determine which buttons should be shown and if they should be disabled
  const shouldShowAccept = status === "pending";
  const shouldShowReject = status === "pending";
  const shouldShowStartDelivery = status === "assigned";
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
          className={`flex-1 min-w-[160px] px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "اقبل الطلب"}
        >
          <CheckCircle className="w-4 h-4" />
          استلم الطلب
        </button>
      )}

      {/* Reject Order Button - Only visible and enabled for pending orders */}
      {shouldShowReject && (
        <button
          onClick={() => onReject(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[160px] px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "رفض الطلب"}
        >
          <XCircle className="w-4 h-4" />
          رفض الطلب
        </button>
      )}

      {/* Start Delivery Button - Only visible and enabled for assigned orders */}
      {shouldShowStartDelivery && (
        <button
          onClick={() => onStartDelivery(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[160px] px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "ابدأ التوصيل"}
        >
          <Truck className="w-4 h-4" />
          بدء التوصيل
        </button>
      )}

      {/* Complete Order Button - Only visible and enabled for delivering orders */}
      {shouldShowComplete && (
        <button
          onClick={() => onComplete(orderId)}
          disabled={allDisabled}
          className={`flex-1 min-w-[160px] px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
            allDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
          }`}
          title={allDisabled ? "تم قفل الطلب" : "أكمل التوصيل"}
        >
          <CheckCircle className="w-4 h-4" />
          تم التوصيل
        </button>
      )}

      {/* Locked State Display - For rejected/delivered/cancelled orders */}
      {isTerminal && (
        <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center gap-2 text-gray-600 font-medium">
          <Clock className="w-5 h-5" />
          <span>
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
```

---

## 4. src/components/OrderProgressTimeline.tsx (NEW FILE)

```typescript
import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface OrderProgressTimelineProps {
  status: string;
}

/**
 * Order Progress Timeline Component
 * 
 * Shows visual representation of order state progression
 * 
 * Flow:
 * pending → assigned → delivering → delivered
 *        → rejected (terminal)
 */
export default function OrderProgressTimeline({ status }: OrderProgressTimelineProps) {
  const stages = [
    { id: "pending", label: "قيد الانتظار", icon: Clock, color: "yellow" },
    { id: "assigned", label: "تم التعيين", icon: CheckCircle, color: "blue" },
    { id: "delivering", label: "قيد التوصيل", icon: CheckCircle, color: "orange" },
    { id: "delivered", label: "تم التوصيل", icon: CheckCircle, color: "green" },
  ];

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
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${getStageColor(
                    index
                  )}`}
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
          "تم قبول الطلب - اضغط 'بدء التوصيل' عند الوصول للمتجر"}
        {status === "delivering" &&
          "الطلب قيد التوصيل - اضغط 'تم التوصيل' عند الانتهاء"}
        {status === "delivered" && "✓ تم التوصيل بنجاح - الطلب مكتمل"}
      </div>
    </div>
  );
}
```

---

## 5. src/components/CaptainDashboard.tsx

### Change 1: Updated imports (Lines 1-30)

```typescript
// ✅ ADDED: New component imports
import OrderActionButtons from "./OrderActionButtons";
import OrderProgressTimeline from "./OrderProgressTimeline";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  MapPin,
  Navigation,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  User,
  TrendingUp,
  Power,
  Bell,
  Star,
  Truck,
  Calendar,
  ArrowRight,
  MessageCircle,
  Store,
  Edit,
  Save,
  X,
  Mail,
  Camera,
  Upload
} from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";
```

---

### Change 2: Enhanced error handling (Lines 260-310)

```typescript
// ✅ CHANGED: Added specific error message handling
const handleAcceptOrder = async (orderId: Id<"orders">) => {
  try {
    await acceptOrder({ orderId });
    toast.success("✓ تم استلام الطلب بنجاح");
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("لا يمكن قبول")) {
      toast.error("هذا الطلب تم قبوله أو رفضه بالفعل");
    } else if (error.message?.includes("قيد الانتظار")) {
      toast.error("يجب أن يكون الطلب قيد الانتظار فقط");
    } else {
      toast.error("فشل استلام الطلب");
    }
  }
};

const handleRejectOrder = async (orderId: Id<"orders">) => {
  try {
    await rejectOrder({ orderId });
    toast.success("✗ تم رفض الطلب - الطلب أصبح مغلق");
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("لا يمكن رفض")) {
      toast.error("هذا الطلب تم قبوله أو رفضه بالفعل");
    } else if (error.message?.includes("قيد الانتظار")) {
      toast.error("يجب أن يكون الطلب قيد الانتظار فقط");
    } else {
      toast.error("فشل رفض الطلب");
    }
  }
};

const handleStartDelivery = async (orderId: Id<"orders">) => {
  try {
    await updateOrderStatusByCaptain({ orderId, status: "delivering" });
    toast.success("✓ تم بدء التوصيل بنجاح");
  } catch (error: any) {
    console.error("Start delivery error:", error);
    if (error.message?.includes("لا يمكن بدء")) {
      toast.error("يجب أن تكون قد قبلت الطلب أولاً");
    } else if (error.message?.includes("معيناً")) {
      toast.error("يجب أن يكون الطلب معيناً (مقبول) أولاً");
    } else {
      toast.error(`فشل بدء التوصيل: ${error.message || "خطأ غير معروف"}`);
    }
  }
};

const handleCompleteOrder = async (orderId: Id<"orders">) => {
  try {
    await completeOrder({ orderId });
    toast.success("✓ تم التوصيل بنجاح - شكراً لك!");
  } catch (error: any) {
    console.error("Complete order error:", error);
    if (error.message?.includes("لا يمكن إكمال")) {
      toast.error("هذا الطلب غير قيد التوصيل حالياً");
    } else if (error.message?.includes("قيد التوصيل")) {
      toast.error("يجب أن يكون الطلب قيد التوصيل فقط");
    } else if (error.message?.includes("ليس لديك صلاحية")) {
      toast.error("ليس لديك صلاحية لإكمال هذا الطلب");
    } else if (error.message?.includes("الطلب غير موجود")) {
      toast.error("الطلب غير موجود");
    } else {
      toast.error(`فشل التوصيل: ${error.message || "خطأ غير معروف"}`);
    }
  }
};
```

---

### Change 3: Replaced button section (Lines 740-770)

```typescript
// ✅ CHANGED: Replaced inline button div with new components
{/* Order Progress Timeline */}
<div className="mt-4">
  <OrderProgressTimeline status={order.status} />
</div>

{/* Action Buttons */}
<OrderActionButtons
  orderId={order._id}
  status={order.status}
  onAccept={handleAcceptOrder}
  onReject={handleRejectOrder}
  onStartDelivery={handleStartDelivery}
  onComplete={handleCompleteOrder}
/>

// ❌ REMOVED: Old button code
// <div className="flex gap-2 mt-4 flex-wrap">
//   <button onClick={() => handleAcceptOrder(order._id)}>استلم الطلب</button>
//   <button onClick={() => handleRejectOrder(order._id)}>رفض الطلب</button>
//   <button onClick={() => handleStartDelivery(order._id)}>بدء التوصيل</button>
//   <button onClick={() => handleCompleteOrder(order._id)}>تم التوصيل</button>
// </div>
```

---

## Summary

| File | Lines Changed | Type | Key Changes |
|------|---------------|------|------------|
| convex/schema.ts | 152 | Modified | Added "rejected" status |
| convex/orders.ts | 560-715 | Modified | Added validations to 4 mutations |
| OrderActionButtons.tsx | 1-130 | **NEW** | Component for conditional buttons |
| OrderProgressTimeline.tsx | 1-95 | **NEW** | Component for visual timeline |
| CaptainDashboard.tsx | 1-770 | Modified | Imports + Handlers + Components |

All changes implement complete order action locking with state validation and user-friendly UI.
