# Order Action Locking Implementation - Complete Documentation

## Overview
Implemented order action locking system for Captain Dashboard with state-based transitions, backend validation, and user-friendly UI feedback.

## Status Transitions & Behavior

### Order Status Flow
```
pending → assigned → delivering → delivered
       → rejected (terminal state)
```

### Action Rules

| Status | Available Actions | Buttons Shown | Locked |
|--------|------------------|---------------|--------|
| pending | Accept or Reject | Both accept/reject | No |
| assigned | Start Delivery | Only "بدء التوصيل" | No |
| delivering | Complete | Only "تم التوصيل" | No |
| delivered | None | None (Success state) | Yes |
| rejected | None | None (Final state) | Yes |
| cancelled | None | None (Final state) | Yes |

---

## Files Modified

### 1. **convex/schema.ts**
**Changes:** Added "rejected" status to orders table

```typescript
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
)
```

---

### 2. **convex/orders.ts**
**Changes:** 4 major mutations updated with validation

#### acceptOrder()
- **Validation:** Only `pending` orders can be accepted
- **Error:** "لا يمكن قبول طلب في حالة {status}. يجب أن يكون الطلب قيد الانتظار"
- **Transition:** pending → assigned

```typescript
if (order.status !== "pending") {
  throw new ConvexError(`لا يمكن قبول طلب في حالة ${order.status}. يجب أن يكون الطلب قيد الانتظار`);
}
```

#### rejectOrder()
- **Validation:** Only `pending` orders can be rejected
- **Error:** "لا يمكن رفض طلب في حالة {status}. يجب أن يكون الطلب قيد الانتظار"
- **Transition:** pending → rejected
- **Result:** Sets captainId to undefined, status to "rejected"

```typescript
if (order.status !== "pending") {
  throw new ConvexError(`لا يمكن رفض طلب في حالة ${order.status}. يجب أن يكون الطلب قيد الانتظار`);
}
await ctx.db.patch(args.orderId, {
  captainId: undefined,  // ← Remove captain assignment
  status: "rejected",
  updatedAt: Date.now(),
});
```

#### updateOrderStatusByCaptain()
- **Validation:** Only `assigned` orders can transition to `delivering`
- **Error:** "لا يمكن بدء التوصيل من حالة {status}. يجب أن يكون الطلب معيناً أولاً"
- **Transition:** assigned → delivering
- **Timestamp:** Records pickupTime

```typescript
if (args.status === "delivering") {
  if (order.status !== "assigned") {
    throw new ConvexError(`لا يمكن بدء التوصيل من حالة ${order.status}. يجب أن يكون الطلب معيناً أولاً`);
  }
}
```

#### completeOrder()
- **Validation:** 
  1. Only `delivering` orders can be completed
  2. Only assigned captain can complete the order
- **Errors:**
  - "لا يمكن إكمال طلب في حالة {status}. يجب أن يكون الطلب قيد التوصيل"
  - "ليس لديك صلاحية لإكمال هذا الطلب"
- **Transition:** delivering → delivered
- **Timestamp:** Records actualDeliveryTime

```typescript
if (order.status !== "delivering") {
  throw new ConvexError(`لا يمكن إكمال طلب في حالة ${order.status}. يجب أن يكون الطلب قيد التوصيل`);
}
if (order.captainId !== profile._id) {
  throw new ConvexError("ليس لديك صلاحية لإكمال هذا الطلب");
}
```

---

### 3. **src/components/OrderActionButtons.tsx** (NEW)
**Purpose:** Centralized action button logic with conditional visibility

**Key Features:**
- Status-based button visibility (only shows relevant buttons)
- Disabled state styling (gray when locked)
- Active state styling (colored when available)
- Terminal state display message
- Comprehensive tooltips

**Props:**
```typescript
interface OrderActionButtonsProps {
  orderId: Id<"orders">;
  status: string;
  isLoading?: boolean;
  onAccept: (orderId: Id<"orders">) => void;
  onReject: (orderId: Id<"orders">) => void;
  onStartDelivery: (orderId: Id<"orders">) => void;
  onComplete: (orderId: Id<"orders">) => void;
}
```

**Button Visibility Logic:**
```typescript
const shouldShowAccept = status === "pending";
const shouldShowReject = status === "pending";
const shouldShowStartDelivery = status === "assigned";
const shouldShowComplete = status === "delivering";

const isTerminal = status === "rejected" || status === "delivered" || status === "cancelled";
```

**Visual States:**
- Disabled (Gray): `bg-gray-300 text-gray-500 cursor-not-allowed`
- Disabled Rejected: Shows lock icon + message
- Active Accept (Green): `from-green-500 to-green-600`
- Active Reject (Red): `from-red-500 to-red-600`
- Active Start Delivery (Blue): `from-blue-500 to-blue-600`
- Active Complete (Orange): `from-orange-500 to-orange-600`

---

### 4. **src/components/OrderProgressTimeline.tsx** (NEW)
**Purpose:** Visual timeline showing order progress through stages

**Key Features:**
- 4-stage timeline: pending → assigned → delivering → delivered
- Color-coded stages based on progress
- Completion line fills progressively
- Stage-specific status messages
- Rejected state display with X icon

**Stages:**
1. قيد الانتظار (Pending) - Yellow
2. تم التعيين (Assigned) - Blue
3. قيد التوصيل (Delivering) - Orange
4. تم التوصيل (Delivered) - Green

**Status Messages:**
- pending: "الطلب قيد الانتظار - اضغط 'استلم الطلب' أو 'رفض الطلب'"
- assigned: "تم قبول الطلب - اضغط 'بدء التوصيل' عند الوصول للمتجر"
- delivering: "الطلب قيد التوصيل - اضغط 'تم التوصيل' عند الانتهاء"
- delivered: "✓ تم التوصيل بنجاح - الطلب مكتمل"
- rejected: "الطلب في حالة نهائية - لا يمكن إجراء أي تحديثات"

---

### 5. **src/components/CaptainDashboard.tsx**
**Changes:** 
- Added imports for new components
- Replaced inline button logic with `OrderActionButtons` component
- Added `OrderProgressTimeline` component
- Enhanced error handling with specific validation messages

**New Imports:**
```typescript
import OrderActionButtons from "./OrderActionButtons";
import OrderProgressTimeline from "./OrderProgressTimeline";
```

**New Component Usage:**
```typescript
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
```

**Enhanced Error Messages:**
All handlers now check for specific error conditions and provide targeted messages:

- Accept errors:
  - "هذا الطلب تم قبوله أو رفضه بالفعل"
  - "يجب أن يكون الطلب قيد الانتظار فقط"

- Reject errors:
  - "هذا الطلب تم قبوله أو رفضه بالفعل"
  - "يجب أن يكون الطلب قيد الانتظار فقط"

- Start Delivery errors:
  - "يجب أن تكون قد قبلت الطلب أولاً"
  - "يجب أن يكون الطلب معيناً (مقبول) أولاً"

- Complete errors:
  - "هذا الطلب غير قيد التوصيل حالياً"
  - "يجب أن يكون الطلب قيد التوصيل فقط"
  - "ليس لديك صلاحية لإكمال هذا الطلب"
  - "الطلب غير موجود"

---

## UI/UX Behavior

### Button Visibility & Locking

#### 1. Pending Order
```
✓ [استلم الطلب - GREEN] [رفض الطلب - RED]
  Progress: • → ○ → ○ → ○
  Message: "الطلب قيد الانتظار - اضغط 'استلم الطلب' أو 'رفض الطلب'"
```

#### 2. Accepted Order (Assigned)
```
  [Start Delivery - BLUE]
  Progress: ✓ → • → ○ → ○
  Message: "تم قبول الطلب - اضغط 'بدء التوصيل' عند الوصول للمتجر"
```

#### 3. In Transit (Delivering)
```
  [تم التوصيل - ORANGE]
  Progress: ✓ → ✓ → • → ○
  Message: "الطلب قيد التوصيل - اضغط 'تم التوصيل' عند الانتهاء"
```

#### 4. Delivered (Completed)
```
  [✓ تم التوصيل بنجاح - LOCKED]
  Progress: ✓ → ✓ → ✓ → ✓
  Message: "✓ تم التوصيل بنجاح - الطلب مكتمل"
```

#### 5. Rejected (Terminal)
```
  [✗ تم رفض الطلب - لا يمكن تغيير الحالة - LOCKED]
  Progress: X (Red, no progression)
  Message: "الطلب في حالة نهائية - لا يمكن إجراء أي تحديثات"
```

---

## Page Refresh Behavior

**✓ Status Persistence:** All order statuses are stored in Convex database
- Page refresh loads current status from database
- Buttons recalculate based on loaded status
- No temporary states or cookies used
- Captain cannot re-enable locked buttons through refresh

**Example:**
```typescript
// Order saved as status: "delivered"
Captain refreshes page
→ Component loads from database: status = "delivered"
→ OrderActionButtons shows locked state
→ No accept/reject/delivery buttons visible
```

---

## Backend Validation (Convex)

### Invalid Transitions Prevented:
| From | To | Allowed | Error |
|------|----|---------|----|
| delivered | accepted | ❌ | "لا يمكن قبول طلب في حالة delivered..." |
| delivered | rejected | ❌ | Cannot call mutation |
| delivered | delivering | ❌ | "لا يمكن بدء التوصيل من حالة delivered..." |
| rejected | accepted | ❌ | "لا يمكن قبول طلب في حالة rejected..." |
| rejected | delivering | ❌ | "لا يمكن بدء التوصيل من حالة rejected..." |
| rejected | delivered | ❌ | Cannot call mutation |
| assigned | accepted | ❌ | "لا يمكن قبول طلب في حالة assigned..." |
| assigned | rejected | ❌ | "لا يمكن رفض طلب في حالة assigned..." |
| delivering | accepted | ❌ | "لا يمكن قبول طلب في حالة delivering..." |
| delivering | rejected | ❌ | "لا يمكن رفض طلب في حالة delivering..." |

### Valid Transitions:
| From | To | Action | Authorization |
|------|----|--------|---|
| pending | assigned | acceptOrder() | Captain must exist |
| pending | rejected | rejectOrder() | Captain must exist |
| assigned | delivering | updateOrderStatusByCaptain() | Captain must own order |
| delivering | delivered | completeOrder() | Captain must own order |

---

## Success Messages (Arabic)

| Action | Message |
|--------|---------|
| Accept | "✓ تم استلام الطلب بنجاح" |
| Reject | "✗ تم رفض الطلب - الطلب أصبح مغلق" |
| Start Delivery | "✓ تم بدء التوصيل بنجاح" |
| Complete | "✓ تم التوصيل بنجاح - شكراً لك!" |

---

## Testing Checklist

### Test 1: Pending Order - Accept Flow
```
1. Captain sees order in pending status
2. Both "استلم الطلب" and "رفض الطلب" buttons visible
3. Timeline shows: [• pending] → [○ assigned] → [○ delivering] → [○ delivered]
4. Click "استلم الطلب"
5. Success: "✓ تم استلام الطلب بنجاح"
6. Status updates to "assigned"
7. Timeline shows: [✓ pending] → [• assigned] → [○ delivering] → [○ delivered]
8. Only "بدء التوصيل" button visible
9. Refresh page → Status persists as "assigned"
```

### Test 2: Pending Order - Reject Flow
```
1. Captain sees order in pending status
2. Both action buttons visible
3. Click "رفض الطلب"
4. Success: "✗ تم رفض الطلب - الطلب أصبح مغلق"
5. Status updates to "rejected"
6. Timeline shows red X: "الطلب في حالة نهائية"
7. No buttons visible - locked state displayed
8. Refresh page → Status persists as "rejected"
9. Cannot accept the order anymore
```

### Test 3: Assigned Order - Start Delivery
```
1. Order in "assigned" status
2. Only "بدء التوصيل" button visible
3. Timeline shows: [✓ pending] → [• assigned] → [○ delivering] → [○ delivered]
4. Click "بدء التوصيل"
5. Success: "✓ تم بدء التوصيل بنجاح"
6. Status updates to "delivering"
7. Timeline shows: [✓ pending] → [✓ assigned] → [• delivering] → [○ delivered]
8. Only "تم التوصيل" button visible
9. Refresh page → Status persists as "delivering"
```

### Test 4: Delivering Order - Complete
```
1. Order in "delivering" status
2. Only "تم التوصيل" button visible
3. Timeline shows: [✓ pending] → [✓ assigned] → [• delivering] → [○ delivered]
4. Click "تم التوصيل"
5. Success: "✓ تم التوصيل بنجاح - شكراً لك!"
6. Status updates to "delivered"
7. Timeline shows: [✓ pending] → [✓ assigned] → [✓ delivering] → [✓ delivered]
8. No buttons visible - locked success state
9. Refresh page → Status persists as "delivered" with locked state
```

### Test 5: Invalid Transitions (Backend Validation)
```
Scenario: Try to accept already-assigned order
1. Order status: "assigned"
2. Frontend hides accept button
3. If somehow mutation called directly:
   Error: "لا يمكن قبول طلب في حالة assigned. يجب أن يكون الطلب قيد الانتظار"

Scenario: Try to deliver non-assigned order
1. Order status: "pending"
2. Frontend hides delivery buttons
3. If somehow mutation called directly:
   Error: "لا يمكن بدء التوصيل من حالة pending. يجب أن يكون الطلب معيناً أولاً"

Scenario: Wrong captain tries to complete order
1. Order assigned to Captain A
2. Captain B logged in
3. Error: "ليس لديك صلاحية لإكمال هذا الطلب"
```

### Test 6: Database Persistence
```
1. Captain A accepts order → status="assigned"
2. Close browser
3. Clear all cache
4. Re-open → Status still "assigned"
5. Accept button hidden, delivery button visible
6. Database correctly stored transition

1. Captain accepts and delivers order → status="delivered"
2. Network offline
3. Refresh page
4. No buttons shown - locked state
5. Goes online → Same locked state
```

---

## Component Hierarchy

```
CaptainDashboard.tsx
├── (existing components)
├── OrderProgressTimeline.tsx
│   └── Shows visual progress through stages
└── OrderActionButtons.tsx
    ├── Conditionally renders accept/reject buttons
    ├── Conditionally renders delivery button
    ├── Conditionally renders complete button
    └── Shows locked state when terminal
```

---

## Performance Considerations

- **OrderActionButtons:** Pure component, no mutations, re-renders only on status change
- **OrderProgressTimeline:** Pure component, no state, lightweight SVG rendering
- **Backend Validation:** Database consistency guaranteed before mutation completes
- **Page Refresh:** Single database query loads all order data with current status

---

## Future Enhancements

1. Add order cancellation flow with reasons
2. Add time tracking for each stage
3. Add customer notifications on status change
4. Add captain location tracking during delivery
5. Add estimated time of arrival (ETA)
6. Add rating/review after delivery completion
7. Add order history with timeline dates
8. Add bulk action capabilities for multiple orders

---

## Summary

✅ Order action locking fully implemented with:
- ✅ 4-status transition flow (pending → assigned → delivering → delivered)
- ✅ Backend validation preventing invalid transitions
- ✅ Frontend UI reflecting database state
- ✅ Visual progress timeline
- ✅ Status-based button visibility
- ✅ Disabled/locked state styling
- ✅ User-friendly Arabic error messages
- ✅ Page refresh persistence
- ✅ Zero TypeScript errors
- ✅ All validations working correctly
