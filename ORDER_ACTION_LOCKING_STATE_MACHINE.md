# Order Action Locking - State Machine & Error Reference

## 📊 State Machine Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    ORDER STATUS STATE MACHINE                    │
└──────────────────────────────────────────────────────────────────┘

                              ┌─────────┐
                              │ pending │ (ACTIVE)
                              └────┬────┘
                    ┌─────────────┴─────────────┐
                    │                           │
          ┌─────────▼──────────┐      ┌────────▼────────┐
          │    acceptOrder()   │      │  rejectOrder()  │
          │  (Captain accepts) │      │  (Captain rejects)
          └─────────┬──────────┘      └────────┬────────┘
                    │                           │
                    │                           │
            ┌───────▼────────┐          ┌──────▼───────┐
            │    assigned    │          │   rejected   │ (LOCKED)
            │   (ACTIVE)     │          │ (TERMINAL)   │
            └───────┬────────┘          └──────────────┘
                    │
       ┌────────────▼───────────────┐
       │ updateOrderStatusByCaptain │
       │ ("delivering" only)         │
       └────────────┬───────────────┘
                    │
            ┌───────▼────────┐
            │  delivering    │
            │   (ACTIVE)     │
            └───────┬────────┘
                    │
          ┌─────────▼──────────┐
          │  completeOrder()   │
          │  (Captain delivers)│
          └─────────┬──────────┘
                    │
            ┌───────▼────────┐
            │   delivered    │ (LOCKED)
            │  (TERMINAL)    │
            └────────────────┘


LEGEND:
  ● pending    = Awaiting captain decision
  ● assigned   = Captain accepted, waiting to start delivery
  ● delivering = Order in transit
  ✓ delivered  = Order completed (LOCKED)
  ✗ rejected   = Order rejected (LOCKED)

TERMINAL STATES (Locked, no further transitions):
  - delivered ✓
  - rejected  ✗
  - cancelled
```

---

## 🚨 Invalid State Transitions

### Accepted Transitions Only

```
┌─────────────────────────────────────────────────────────────────┐
│               VALID TRANSITIONS (Allowed)                        │
├─────────────────────────────────────────────────────────────────┤
│ pending → assigned      ✓ acceptOrder()                          │
│ pending → rejected      ✓ rejectOrder()                          │
│ assigned → delivering   ✓ updateOrderStatusByCaptain()           │
│ delivering → delivered  ✓ completeOrder()                        │
└─────────────────────────────────────────────────────────────────┘
```

### Rejected Transitions (Prevented by Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│        INVALID TRANSITIONS (Blocked with errors)                 │
├──────────────────┬───────────────┬──────────────────────────────┤
│ From        │ To          │ Error Message                      │
├──────────────────┼───────────────┼──────────────────────────────┤
│ assigned    │ pending     │ (Frontend hides - no mutation)     │
│ assigned    │ rejected    │ (Frontend hides - no mutation)     │
│ assigned    │ assigned    │ (Frontend hides - no mutation)     │
│             │             │                                    │
│ delivering  │ pending     │ (Frontend hides - no mutation)     │
│ delivering  │ assigned    │ (Frontend hides - no mutation)     │
│ delivering  │ rejected    │ (Frontend hides - no mutation)     │
│ delivering  │ delivering  │ (Frontend hides - no mutation)     │
│             │             │                                    │
│ delivered   │ pending     │ (Frontend hides - no mutation)     │
│ delivered   │ assigned    │ لا يمكن قبول طلب في حالة...         │
│ delivered   │ rejected    │ (No mutation available)            │
│ delivered   │ delivering  │ لا يمكن بدء التوصيل من حالة...     │
│ delivered   │ delivered   │ (Frontend hides - no mutation)     │
│             │             │                                    │
│ rejected    │ pending     │ (Frontend hides - no mutation)     │
│ rejected    │ assigned    │ لا يمكن قبول طلب في حالة...         │
│ rejected    │ delivering  │ لا يمكن بدء التوصيل من حالة...     │
│ rejected    │ delivered   │ (No mutation available)            │
│ rejected    │ rejected    │ (Frontend hides - no mutation)     │
│             │             │                                    │
│ cancelled   │ *           │ (All transitions blocked)          │
└──────────────────┴───────────────┴──────────────────────────────┘
```

---

## ⚠️ Error Messages & Conditions

### acceptOrder() - Errors

```
Mutation: acceptOrder(orderId)
Called from: CaptainDashboard.tsx - handleAcceptOrder()
Permission: Captain role required

Error Conditions:
┌────────────────────────────────────────────────────────────────┐
│ Condition                      │ Error Message                  │
├────────────────────────────────┼────────────────────────────────┤
│ Not authenticated              │ "يجب تسجيل الدخول"             │
│ Not a captain                  │ "غير مصرح"                    │
│ Order not found                │ "الطلب غير موجود"             │
│ Status ≠ "pending"             │ لا يمكن قبول طلب في حالة...    │
│                                │ يجب أن يكون الطلب قيد الانتظار │
└────────────────────────────────┴────────────────────────────────┘

Success: Status changes to "assigned"
```

---

### rejectOrder() - Errors

```
Mutation: rejectOrder(orderId)
Called from: CaptainDashboard.tsx - handleRejectOrder()
Permission: Captain role required

Error Conditions:
┌────────────────────────────────────────────────────────────────┐
│ Condition                      │ Error Message                  │
├────────────────────────────────┼────────────────────────────────┤
│ Not authenticated              │ "يجب تسجيل الدخول"             │
│ Not a captain                  │ "غير مصرح"                    │
│ Order not found                │ "الطلب غير موجود"             │
│ Status ≠ "pending"             │ لا يمكن رفض طلب في حالة...     │
│                                │ يجب أن يكون الطلب قيد الانتظار │
└────────────────────────────────┴────────────────────────────────┘

Success: Status changes to "rejected", captainId cleared
```

---

### updateOrderStatusByCaptain() - Errors

```
Mutation: updateOrderStatusByCaptain(orderId, status)
Called from: CaptainDashboard.tsx - handleStartDelivery()
Status allowed: "assigned" | "delivering"
Permission: Captain role required

Error Conditions:
┌──────────────────────────────────────────────────────────────────┐
│ Condition                      │ Error Message                   │
├──────────────────────────────────┼──────────────────────────────┤
│ Not authenticated               │ "يجب تسجيل الدخول"            │
│ Not a captain                   │ "غير مصرح"                   │
│ Order not found                 │ "الطلب غير موجود"            │
│ Status="delivering" but          │ لا يمكن بدء التوصيل من حالة... │
│ order.status ≠ "assigned"       │ يجب أن يكون الطلب معيناً أولاً │
└──────────────────────────────────┴──────────────────────────────┘

Success: Status changes to "delivering", pickupTime recorded
```

---

### completeOrder() - Errors

```
Mutation: completeOrder(orderId)
Called from: CaptainDashboard.tsx - handleCompleteOrder()
Permission: Captain role required + Captain must own order

Error Conditions:
┌──────────────────────────────────────────────────────────────────┐
│ Condition                      │ Error Message                   │
├──────────────────────────────────┼──────────────────────────────┤
│ Not authenticated               │ "يجب تسجيل الدخول"            │
│ Not a captain                   │ "غير مصرح"                   │
│ Order not found                 │ "الطلب غير موجود"            │
│ Status ≠ "delivering"           │ لا يمكن إكمال طلب في حالة...   │
│                                 │ يجب أن يكون الطلب قيد التوصيل │
│ Captain ≠ order.captainId       │ ليس لديك صلاحية لإكمال...      │
└──────────────────────────────────┴──────────────────────────────┘

Success: Status changes to "delivered", actualDeliveryTime recorded
```

---

## 🎯 Frontend Button Visibility Logic

### Conditional Rendering (OrderActionButtons.tsx)

```typescript
Visibility Rules:
┌──────────────────────┬─────────┬─────────┬────────────┬──────────┐
│ Order Status         │ Accept  │ Reject  │ Delivery   │ Complete │
├──────────────────────┼─────────┼─────────┼────────────┼──────────┤
│ pending              │ ✓ Show  │ ✓ Show  │ ✗ Hidden   │ ✗ Hidden │
│ assigned             │ ✗ Hidden│ ✗ Hidden│ ✓ Show     │ ✗ Hidden │
│ delivering           │ ✗ Hidden│ ✗ Hidden│ ✗ Hidden   │ ✓ Show   │
│ delivered (LOCKED)   │ ✗ Hidden│ ✗ Hidden│ ✗ Hidden   │ ✗ Hidden │
│ rejected (LOCKED)    │ ✗ Hidden│ ✗ Hidden│ ✗ Hidden   │ ✗ Hidden │
│ cancelled (LOCKED)   │ ✗ Hidden│ ✗ Hidden│ ✗ Hidden   │ ✗ Hidden │
└──────────────────────┴─────────┴─────────┴────────────┴──────────┘

Locked State Display:
┌──────────────────────┬─────────────────────────────────────┐
│ Status               │ Display Message                     │
├──────────────────────┼─────────────────────────────────────┤
│ delivered            │ ✓ تم التوصيل بنجاح - الطلب مكتمل   │
│ rejected             │ ✗ تم رفض الطلب - لا يمكن تغيير...  │
│ cancelled            │ ◯ الطلب ملغى                       │
└──────────────────────┴─────────────────────────────────────┘
```

---

## 🎨 Button Styling States

### Visual States per Button

```
ACCEPT BUTTON (استلم الطلب):
  Pending:  bg-gradient-to-r from-green-500 to-green-600 (clickable)
  Assigned: Not visible
  Locked:   Not visible

REJECT BUTTON (رفض الطلب):
  Pending:  bg-gradient-to-r from-red-500 to-red-600 (clickable)
  Assigned: Not visible
  Locked:   Not visible

START DELIVERY (بدء التوصيل):
  Pending:   Not visible
  Assigned:  bg-gradient-to-r from-blue-500 to-blue-600 (clickable)
  Locked:    Not visible

COMPLETE DELIVERY (تم التوصيل):
  Pending:    Not visible
  Assigned:   Not visible
  Delivering: bg-gradient-to-r from-orange-500 to-orange-600 (clickable)
  Locked:     Not visible

LOCKED STATE:
  All scenarios: bg-gray-50 border-gray-200 (message display)
```

---

## 📈 Transition Flow Example

### Scenario: Complete Order Delivery

```
STEP 1: Customer places order
┌─────────────────────────────────────────┐
│ Database Status: pending                │
│ Frontend: Accept & Reject buttons shown │
│ Timeline: [•] → [○] → [○] → [○]        │
└─────────────────────────────────────────┘
         ↓
STEP 2: Captain accepts order
  Call: acceptOrder(orderId)
  Backend validation: status === "pending" ✓
  Update: captainId = captain._id, status = "assigned"
┌─────────────────────────────────────────┐
│ Database Status: assigned               │
│ Frontend: Only Delivery button shown    │
│ Timeline: [✓] → [•] → [○] → [○]        │
│ Message: "تم قبول الطلب - اضغط بدء..."│
└─────────────────────────────────────────┘
         ↓
STEP 3: Captain starts delivery
  Call: updateOrderStatusByCaptain(orderId, "delivering")
  Backend validation: status === "assigned" ✓
  Update: status = "delivering", pickupTime = Date.now()
┌─────────────────────────────────────────┐
│ Database Status: delivering             │
│ Frontend: Only Complete button shown    │
│ Timeline: [✓] → [✓] → [•] → [○]        │
│ Message: "الطلب قيد التوصيل - اضغط..."│
└─────────────────────────────────────────┘
         ↓
STEP 4: Captain completes delivery
  Call: completeOrder(orderId)
  Backend validation: 
    - status === "delivering" ✓
    - captainId === profile._id ✓
  Update: status = "delivered", actualDeliveryTime = Date.now()
┌─────────────────────────────────────────┐
│ Database Status: delivered              │
│ Frontend: No buttons (locked)           │
│ Timeline: [✓] → [✓] → [✓] → [✓]        │
│ Message: "✓ تم التوصيل بنجاح"         │
└─────────────────────────────────────────┘
         ↓
STEP 5: Captain refreshes page
  Query: getCaptainOrders()
  Loads: status = "delivered" from database
┌─────────────────────────────────────────┐
│ Database Status: delivered              │
│ Frontend: Still locked (no buttons)     │
│ Timeline: Still [✓] → [✓] → [✓] → [✓] │
│ Persistence: ✓ Status persisted        │
└─────────────────────────────────────────┘
```

---

## 🔒 Authorization & Security

### Captain Authorization Checks

```
acceptOrder():
  ✓ Captain must exist
  ✓ Captain must have "captain" role
  ✗ No specific order authorization needed (first accept)

rejectOrder():
  ✓ Captain must exist
  ✓ Captain must have "captain" role
  ✗ No specific order authorization needed (first reject)

updateOrderStatusByCaptain():
  ✓ Captain must exist
  ✓ Captain must have "captain" role
  ⚠ No direct verification of captain ownership (relies on order availability)

completeOrder():
  ✓ Captain must exist
  ✓ Captain must have "captain" role
  ✓ Captain must own order (captainId === profile._id)
  → If different captain: "ليس لديك صلاحية لإكمال هذا الطلب"
```

---

## 📊 Database State Persistence

### What Gets Saved

```
On acceptOrder():
  ✓ orderId.captainId = captain._id
  ✓ orderId.status = "assigned"
  ✓ orderId.updatedAt = Date.now()

On rejectOrder():
  ✓ orderId.captainId = undefined (cleared)
  ✓ orderId.status = "rejected"
  ✓ orderId.updatedAt = Date.now()

On updateOrderStatusByCaptain("delivering"):
  ✓ orderId.captainId = captain._id
  ✓ orderId.status = "delivering"
  ✓ orderId.pickupTime = Date.now()
  ✓ orderId.updatedAt = Date.now()

On completeOrder():
  ✓ orderId.captainId = captain._id
  ✓ orderId.status = "delivered"
  ✓ orderId.actualDeliveryTime = Date.now()
  ✓ orderId.updatedAt = Date.now()
```

### Page Refresh Behavior

```
1. Captain refreshes page while order is "assigned"
   → useQuery(api.orders.getCaptainOrders) fires
   → Loads order from database with status="assigned"
   → OrderActionButtons receives status="assigned"
   → Renders only "بدء التوصيل" button
   → ✓ State persists correctly

2. Captain refreshes after rejecting order
   → useQuery(api.orders.getCaptainOrders) fires
   → Loads order from database with status="rejected"
   → OrderProgressTimeline shows red X
   → OrderActionButtons renders locked message
   → ✓ Cannot retry or re-accept
```

---

## ✅ Validation Checklist

```
Backend Validations:
  ☑ acceptOrder() checks order.status === "pending"
  ☑ rejectOrder() checks order.status === "pending"
  ☑ updateOrderStatusByCaptain() checks correct transitions
  ☑ completeOrder() checks status === "delivering"
  ☑ completeOrder() checks captain authorization
  ☑ All mutations check captain role

Frontend Validations:
  ☑ OrderActionButtons hides buttons based on status
  ☑ OrderProgressTimeline shows correct stage
  ☑ Disabled states appear visually different
  ☑ Error messages displayed in toast
  ☑ Success messages with confirmation

Database Validations:
  ☑ Status stored in Convex database
  ☑ Timestamps recorded for transitions
  ☑ Captain ID persisted correctly
  ☑ Terminal states prevent further updates
```

---

## 📋 Testing Verification

```
Test Acceptance Criteria:
  ✓ Pending order shows accept & reject buttons
  ✓ Clicking accept changes status to assigned
  ✓ Assigned order shows only delivery button
  ✓ Clicking reject changes status to rejected
  ✓ Rejected order is locked (no buttons)
  ✓ Delivery button changes status to delivering
  ✓ Delivering order shows only complete button
  ✓ Complete button changes status to delivered
  ✓ Delivered order is locked (no buttons)
  ✓ Page refresh persists all status changes
  ✓ Backend prevents invalid transitions
  ✓ Error messages display correctly
  ✓ Timeline shows proper progression
  ✓ Disabled buttons appear gray
  ✓ Active buttons appear colored
```
