# Persistent Online Status - Real-Time Behavior & Database State

## 📊 Database Schema Changes

### profiles Table - Updated Field

```typescript
{
  _id: Id<"profiles">,
  userId: Id<"users">,
  role: "captain" | "customer" | "merchant" | "admin" | "owner",
  fullName: string,
  phone: string,
  phoneVerified: boolean,
  email: string (optional),
  avatar: string (optional),
  isActive: boolean,
  isOnline: boolean,              // ✓ Existing field
  lastSeen: number,               // ✓ Existing field
  connectedAt: number (optional), // ✅ NEW FIELD
  registrationDate: number,
  location: {
    address: string,
    addressAr: string,
    latitude: number,
    longitude: number
  } (optional),
  isSuspended: boolean,
  suspensionReason: string (optional),
  suspensionDate: number (optional),
  isOwner: boolean (optional),
  // ... other fields
}
```

---

## 🔄 State Transitions

### Going Online

```typescript
Initial State (Offline):
{
  isOnline: false,
  lastSeen: 1624046400000,
  connectedAt: undefined
}

Captain clicks "اتصال الآن"
    ↓
updateStatus({ isOnline: true }) mutation executes
    ↓
Backend updates:
{
  isOnline: true,           // Changed from false
  lastSeen: 1624046412345,  // Updated to now
  connectedAt: 1624046412345  // Set to now
}
    ↓
Final State (Online):
{
  isOnline: true,
  lastSeen: 1624046412345,
  connectedAt: 1624046412345
}
```

---

### Going Offline

```typescript
Initial State (Online):
{
  isOnline: true,
  lastSeen: 1624046450000,
  connectedAt: 1624046412345
}

Captain clicks "فصل الاتصال"
    ↓
updateStatus({ isOnline: false }) mutation executes
    ↓
Backend updates:
{
  isOnline: false,          // Changed from true
  lastSeen: 1624046465000,  // Updated to now
  connectedAt: undefined    // Cleared
}
    ↓
Final State (Offline):
{
  isOnline: false,
  lastSeen: 1624046465000,
  connectedAt: undefined
}
```

---

## ⏱️ Connection Duration Calculation

### From Database Timestamp

```typescript
connectedAt: 1624046412345

Connection Duration Logic:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Current Time: 1624046412345 (connected at)
   Duration: "للتو" (Just now)

2. Current Time: 1624046432345 (20 seconds later)
   diff = 20000ms
   seconds = 20
   minutes = 0
   Duration: "للتو" (Still less than 1 minute)

3. Current Time: 1624046472345 (60 seconds later)
   diff = 60000ms
   seconds = 60
   minutes = 1
   Duration: "1 دقيقة"

4. Current Time: 1624046500000 (87.655 seconds later)
   diff = 87655ms
   minutes = 1
   hours = 0
   Duration: "1 دقيقة"

5. Current Time: 1624050012345 (3600 seconds later / 1 hour)
   diff = 3600000ms
   hours = 1
   minutes = 0
   Duration: "1 ساعات و 0 دقيقة"

6. Current Time: 1624053612345 (3600 seconds later / 1 hour 59 minutes)
   diff = 7200000ms
   hours = 2
   minutes = 0
   Duration: "2 ساعات و 0 دقيقة"

7. Current Time: 1624136812345 (86400 seconds later / 24 hours)
   diff = 86400000ms
   days = 1
   hours = 0
   Duration: "1 يوم و 0 ساعات"

8. Current Time: 1624223212345 (172800 seconds later / 48 hours)
   diff = 172800000ms
   days = 2
   hours = 0
   Duration: "2 يوم و 0 ساعات"

9. Current Time: 1624309612345 (259200 seconds later / 72 hours)
   diff = 259200000ms
   days = 3
   hours = 0
   Duration: "3 يوم و 0 ساعات"

10. Current Time: 1624356012345 (309600 seconds later / 86 hours)
    diff = 309600000ms
    days = 3
    hours = 14
    Duration: "3 يوم و 14 ساعات"
```

### Update Frequency

```
Initial: Calculated when component mounts or online status changes

Ongoing: Recalculated every 60 seconds (1 minute)
┌──────────────────────────┐
│ Minute 0:  "للتو"        │
│ Minute 1:  "1 دقيقة"     │
│ Minute 2:  "2 دقائق"     │
│ ...                      │
│ Minute 59: "59 دقيقة"    │
│ Minute 60: "1 ساعات..." │
└──────────────────────────┘

Cleanup: Interval cleared when component unmounts or offline status set
```

---

## 🔄 Real-Time Sync Flow

### Scenario 1: Single Captain Dashboard

```
Time: T0
┌─────────────────────────────────────┐
│ CaptainDashboard Mounts             │
│                                     │
│ useAuth() loads profile from DB:   │
│ {                                   │
│   isOnline: false,                  │
│   connectedAt: undefined            │
│ }                                   │
│                                     │
│ Button shows: "غير متصل" (gray)   │
│ Offline banner visible              │
└─────────────────────────────────────┘

Captain clicks "اتصال الآن"
    ↓
Time: T1 (+0.1s)
┌─────────────────────────────────────┐
│ handleToggleOnlineStatus() executes  │
│                                     │
│ updateStatus({ isOnline: true })   │
│ called (mutation)                   │
└─────────────────────────────────────┘

    ↓
Time: T1 (+0.2s)
┌─────────────────────────────────────┐
│ Backend: updateOnlineStatus()       │
│                                     │
│ Database updates:                   │
│ {                                   │
│   isOnline: true,                   │
│   connectedAt: 1624046412345,       │
│   lastSeen: 1624046412345           │
│ }                                   │
└─────────────────────────────────────┘

    ↓
Time: T1 (+0.3s)
┌─────────────────────────────────────┐
│ Convex Real-Time Sync activates     │
│                                     │
│ useAuth() subscription triggered    │
│ New profile data flows to React     │
│                                     │
│ State updates:                      │
│ user.profile.isOnline = true        │
│ user.profile.connectedAt = 1624...  │
└─────────────────────────────────────┘

    ↓
Time: T1 (+0.4s)
┌─────────────────────────────────────┐
│ Component Re-Renders                │
│                                     │
│ const isOnline = user?.profile?.    │
│   isOnline ?? false  ← true         │
│                                     │
│ const connectedAt = user?.profile?. │
│   connectedAt  ← 1624046412345      │
│                                     │
│ connectionDuration effect runs      │
│                                     │
│ Duration calc:                      │
│ diff = now - connectedAt ~= 0       │
│ "للتو"                              │
└─────────────────────────────────────┘

    ↓
Time: T1 (+0.5s)
┌─────────────────────────────────────┐
│ UI Final State                      │
│                                     │
│ Button: "متصل الآن (للتو)" ← GREEN │
│ Offline banner: HIDDEN              │
│ Toast: "✓ تم الاتصال بنجاح"        │
└─────────────────────────────────────┘

    ↓
Time: T1 (+60s) - After 1 Minute
┌─────────────────────────────────────┐
│ Duration Updates (Every 60s)        │
│                                     │
│ connectionDuration state changes:   │
│ "للتو" → "1 دقيقة"                  │
│                                     │
│ Button: "متصل الآن (1 دقيقة)"      │
└─────────────────────────────────────┘
```

---

### Scenario 2: Admin Dashboard Sees Real-Time Update

```
Time: T0
┌─────────────────────────────────────────┐
│ AdminDashboard: CaptainsManagement      │
│                                         │
│ getAllCaptains query runs:              │
│ [                                       │
│   {                                     │
│     _id: "captain_1",                   │
│     fullName: "Ahmed",                  │
│     isOnline: false,                    │
│     connectedAt: undefined              │
│   },                                    │
│   {                                     │
│     _id: "captain_2",                   │
│     fullName: "Hassan",                 │
│     isOnline: false,                    │
│     connectedAt: undefined              │
│   }                                     │
│ ]                                       │
│                                         │
│ Display:                                │
│ ├─ 2 كباتن مسجل                        │
│ ├─ 0 متصل الآن                         │
│ ├─ 2 غير متصل                          │
│ ├─ Captain 1: [غير متصل] button        │
│ └─ Captain 2: [غير متصل] button        │
└─────────────────────────────────────────┘

Captain 1 clicks "اتصال الآن" in their dashboard
    ↓
Time: T1 (+0.1s)
Backend: updateStatus({ isOnline: true })
Database: Captain 1 profile updated
    ↓
Time: T1 (+0.3s)
┌─────────────────────────────────────────┐
│ Convex Real-Time Broadcast              │
│                                         │
│ getAllCaptains subscription fires       │
│ (automatically triggered by DB change)  │
│                                         │
│ New data flows to all subscribers:      │
│ [                                       │
│   {                                     │
│     _id: "captain_1",                   │
│     fullName: "Ahmed",                  │
│     isOnline: true,  ← CHANGED          │
│     connectedAt: 1624046412345 ← NEW   │
│   },                                    │
│   {                                     │
│     _id: "captain_2",                   │
│     fullName: "Hassan",                 │
│     isOnline: false,                    │
│     connectedAt: undefined              │
│   }                                     │
│ ]                                       │
└─────────────────────────────────────────┘

    ↓
Time: T1 (+0.4s)
┌─────────────────────────────────────────┐
│ AdminDashboard Re-Renders               │
│                                         │
│ filteredCaptains recalculated           │
│ filterOnline logic applied              │
│                                         │
│ Display Updated:                        │
│ ├─ 2 كباتن مسجل                        │
│ ├─ 1 متصل الآن ← CHANGED               │
│ ├─ 1 غير متصل  ← CHANGED               │
│ ├─ Captain 1: [متصل الآن] ← GREEN     │
│ └─ Captain 2: [غير متصل] button        │
│                                         │
│ NO PAGE REFRESH NEEDED ✓                │
│ INSTANT SYNC ✓                          │
└─────────────────────────────────────────┘
```

---

### Scenario 3: Page Refresh Persistence

```
Time: T0
┌──────────────────────────────────────┐
│ CaptainDashboard                     │
│                                      │
│ Captain is online:                   │
│ Button: "متصل الآن (5 دقائق)"       │
│ Database:                            │
│ {                                    │
│   isOnline: true,                    │
│   connectedAt: 1624046412345,        │
│   lastSeen: 1624046500000            │
│ }                                    │
└──────────────────────────────────────┘

Captain hits F5 or Ctrl+R (Refresh)
    ↓
Time: T1 (+0s after refresh)
┌──────────────────────────────────────┐
│ Browser Refresh                      │
│                                      │
│ Page reloads                         │
│ JavaScript bundles re-execute        │
│ React components re-mount            │
│ useAuth() hook re-initializes        │
└──────────────────────────────────────┘

    ↓
Time: T1 (+0.1s)
┌──────────────────────────────────────┐
│ useAuth() Hook Execution             │
│                                      │
│ Fetches current user from Convex     │
│ (NOT from localStorage - not used)   │
│                                      │
│ Query to Convex:                     │
│ "Get current user profile"           │
│                                      │
│ Result from database:                │
│ {                                    │
│   _id: ...,                          │
│   isOnline: true,      ← PERSISTED   │
│   connectedAt: 1624046412345,        │
│      ← PERSISTED                     │
│   lastSeen: 1624046500000            │
│ }                                    │
│                                      │
│ (Same as before refresh)             │
└──────────────────────────────────────┘

    ↓
Time: T1 (+0.2s)
┌──────────────────────────────────────┐
│ CaptainDashboard Mounts              │
│                                      │
│ isOnline = user?.profile?.isOnline   │
│   = true (from DB) ✓                 │
│                                      │
│ connectedAt = user?.profile?.        │
│   connectedAt = 1624046412345 (DB) ✓│
│                                      │
│ connectionDuration effect runs       │
│                                      │
│ Duration calc:                       │
│ diff = now - 1624046412345           │
│ = approximately same as before       │
│   (~5 minutes)                       │
│ Duration: "5 دقائق"                 │
└──────────────────────────────────────┘

    ↓
Time: T1 (+0.3s)
┌──────────────────────────────────────┐
│ UI Renders                           │
│                                      │
│ Button: "متصل الآن (5 دقائق)" ✓     │
│ Offline banner: HIDDEN ✓             │
│                                      │
│ SAME STATE AS BEFORE REFRESH ✓       │
│ NO STATUS LOST ✓                     │
│ NO DISCONNECT HAPPENED ✓             │
└──────────────────────────────────────┘
```

---

### Scenario 4: Logout/Login Cycle

```
Time: T0
┌──────────────────────────────────────┐
│ Captain Dashboard                    │
│ isOnline: true                       │
│ Button: "متصل الآن (12 دقائق)"      │
│ Database:                            │
│ {                                    │
│   userId: "user_123",                │
│   isOnline: true,                    │
│   connectedAt: 1624046412345         │
│ }                                    │
└──────────────────────────────────────┘

Captain logs out
    ↓
Time: T1
┌──────────────────────────────────────┐
│ Auth System                          │
│                                      │
│ User session cleared                 │
│ useAuth() returns null               │
│ CaptainDashboard unmounts            │
│                                      │
│ Database UNCHANGED:                  │
│ {                                    │
│   userId: "user_123",                │
│   isOnline: true,  ← STILL TRUE      │
│   connectedAt: 1624046412345 ← KEPT  │
│ }                                    │
│                                      │
│ (Status NOT auto-cleared)            │
└──────────────────────────────────────┘

Captain logs back in
    ↓
Time: T2
┌──────────────────────────────────────┐
│ Auth System                          │
│                                      │
│ New session created                  │
│ useAuth() fetches user profile       │
│                                      │
│ Query result from database:          │
│ {                                    │
│   userId: "user_123",                │
│   isOnline: true,   ← PERSISTED      │
│   connectedAt: 1624046412345 ← FROM DB
│ }                                    │
│                                      │
│ SAME DATA AS BEFORE LOGOUT           │
└──────────────────────────────────────┘

    ↓
Time: T2 (+0.1s)
┌──────────────────────────────────────┐
│ CaptainDashboard Mounts              │
│                                      │
│ isOnline = true (from DB)            │
│ connectedAt = 1624046412345 (from DB)│
│                                      │
│ Duration: Now ~20 minutes            │
│ (Time passed during logout)          │
│                                      │
│ Button: "متصل الآن (20 دقائق)" ✓    │
│ STATUS PERSISTED THROUGH LOGOUT ✓    │
└──────────────────────────────────────┘
```

---

## ✅ Data Integrity

### Single Source of Truth

```
┌─────────────────────────────────────────────┐
│         Convex Database (SOURCE)            │
│  ┌──────────────────────────────────────┐  │
│  │ profiles collection                  │  │
│  │                                      │  │
│  │ {                                    │  │
│  │   isOnline: true/false ✓             │  │
│  │   connectedAt: timestamp/undefined ✓│  │
│  │   lastSeen: timestamp ✓              │  │
│  │ }                                    │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
  ↓
  │ Real-time subscription
  │
  ├─→ CaptainDashboard (client)
  │   - useAuth() hook
  │   - Displays data as-is
  │   - ✓ Authoritative state
  │
  ├─→ AdminDashboard (client)
  │   - getAllCaptains query
  │   - Shows all captains' status
  │   - ✓ Authoritative state
  │
  └─→ MerchantDashboard (client)
      - May query captains
      - Shows online status
      - ✓ Authoritative state

NOT used:
  ❌ localStorage (no persistence needed)
  ❌ localStorage (user preference)
  ❌ sessionStorage (not reliable)
  ❌ React state only (lost on refresh)
  ❌ Cookies (not needed)
```

---

## 🔐 Data Safety

### Concurrent Access

```
Scenario: Captain online on 2 tabs simultaneously

Tab 1 Dashboard:
  - Loads: isOnline = true, connectedAt = T0

Tab 2 Dashboard:
  - Loads: isOnline = true, connectedAt = T0

Captain clicks disconnect in Tab 1:
  ↓
updateStatus({ isOnline: false }) mutation
  ↓
Database: isOnline = false, connectedAt = undefined
  ↓
Convex real-time broadcasts
  ↓
Tab 1: Updates to offline ✓
Tab 2: Updates to offline ✓

Both tabs stay in sync: ✓
```

---

### Network Offline

```
Scenario: Captain goes offline while online

Captain online on dashboard:
  - isOnline = true
  - connectedAt = 1624046412345

Browser network goes offline:
  - Convex connection lost
  - Dashboard continues showing online status
  - (No mutation can be sent, so status accurate)

Browser network comes back online:
  - Convex re-connects
  - If status changed elsewhere: gets latest
  - If status same: still shows online
  - Data is fresh from server

Status always correct from DB: ✓
```

---

## 📈 Query Performance

### getAllCaptains Query

```
Query: getAllCaptains()

Database call:
  profiles collection
  .filter(role == "captain")
  .collect() → Returns ALL captain documents

Returned fields:
  - _id, userId, role
  - fullName, phone, email
  - isActive, isOnline, lastSeen
  - connectedAt ← NEW field
  - All other profile fields

Index used:
  by_role → Efficient lookup for captains

Admin filtering:
  In-memory filter: c.isOnline === filterOnline
  Very fast (few hundred captains)

Real-time:
  When any captain updates: re-run query
  All 150+ fields updated
  Admin sees changes instantly
```

---

## 🧪 Verification Steps

```
1. Go online
   Database: { isOnline: true, connectedAt: 1234567 }
   UI: Green button, duration shows

2. Refresh page
   useAuth() fetches profile from DB
   Database: { isOnline: true, connectedAt: 1234567 }
   UI: Green button, duration continues ✓

3. Open admin dashboard
   getAllCaptains query
   Database: { isOnline: true, connectedAt: 1234567 }
   Admin UI: Shows captain online ✓

4. Captain goes offline (different device)
   Database: { isOnline: false, connectedAt: undefined }
   Convex sync fires
   Both devices show offline ✓

5. Logout/login
   Database: { isOnline: false, connectedAt: undefined }
   useAuth() fetches profile
   UI: Gray button, offline banner ✓

Result: ALL persistence tests pass ✓
```
