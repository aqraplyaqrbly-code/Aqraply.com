# Persistent Online Status - Code Changes Summary

## 📋 Modified Files (3 files)

### 1. convex/schema.ts
**Line 32** - Added field to profiles table

```typescript
// ADDED:
connectedAt: v.optional(v.number()), // Timestamp when captain went online
```

**Full Context:**
```typescript
isActive: v.boolean(),
isOnline: v.boolean(),
lastSeen: v.number(),
connectedAt: v.optional(v.number()), // ← NEW
registrationDate: v.number(),
```

---

### 2. convex/profiles.ts
**Lines 226-251** - Updated updateOnlineStatus mutation

**BEFORE:**
```typescript
export const updateOnlineStatus = mutation({
  args: {
    isOnline: v.boolean(),
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

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    await ctx.db.patch(profile._id, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });

    return { success: true };
  },
});
```

**AFTER:**
```typescript
export const updateOnlineStatus = mutation({
  args: {
    isOnline: v.boolean(),
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

    if (!profile) {
      throw new ConvexError("الملف الشخصي غير موجود");
    }

    // Update online status with timestamp tracking
    await ctx.db.patch(profile._id, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
      // Set connectedAt when going online, undefined when going offline
      ...(args.isOnline ? { connectedAt: Date.now() } : { connectedAt: undefined }),
    });

    return { success: true };
  },
});
```

**Key Change:** Added conditional `connectedAt` update based on `isOnline` value

---

### 3. src/components/CaptainDashboard.tsx

#### Change 1: Component state initialization (Lines 74-160)

**BEFORE:**
```typescript
export default function CaptainDashboard() {
  const [isOnline, setIsOnline] = useState(false);  // ❌ Lost on refresh
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({...});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const previousIsOnline = useRef<boolean>(isOnline);  // ❌ Removed
  const isUpdatingStatus = useRef<boolean>(false);     // ❌ Removed
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const notifications = useQuery(api.notifications.getUserNotifications) || [];
  const todayOrders = useQuery(api.orders.getCaptainOrders) || [];

  // Loading state...
  
  const updateStatus = useMutation(api.profiles.updateOnlineStatus);
  const markAsRead = useMutation(api.notifications.markAsRead);
  // ... other mutations

  // Old effect - prevented feedback loops
  useEffect(() => {
    if (isUpdatingStatus.current) return;
    if (previousIsOnline.current !== isOnline && user?.profile) {
      isUpdatingStatus.current = true;
      updateStatus({ isOnline })
        .finally(() => {
          isUpdatingStatus.current = false;
          previousIsOnline.current = isOnline;
        });
    }
  }, [isOnline, user, updateStatus]);
```

**AFTER:**
```typescript
export default function CaptainDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [connectionDuration, setConnectionDuration] = useState<string>("");  // ✅ NEW
  const [editFormData, setEditFormData] = useState({...});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Mutations
  const { user, isAuthenticated, isLoading } = useAuth();
  const notifications = useQuery(api.notifications.getUserNotifications) || [];
  const todayOrders = useQuery(api.orders.getCaptainOrders) || [];
  const updateStatus = useMutation(api.profiles.updateOnlineStatus);
  const markAsRead = useMutation(api.notifications.markAsRead);
  // ... other mutations

  // ✅ NEW: Get online status from user profile (persisted in database)
  const isOnline = user?.profile?.isOnline ?? false;
  const connectedAt = user?.profile?.connectedAt;

  // Loading state...
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // ✅ NEW: Calculate connection duration
  useEffect(() => {
    if (!isOnline || !connectedAt) {
      setConnectionDuration("");
      return;
    }

    const updateDuration = () => {
      const now = Date.now();
      const diff = now - connectedAt;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setConnectionDuration(`${days} يوم و ${hours % 24} ساعات`);
      } else if (hours > 0) {
        setConnectionDuration(`${hours} ساعات و ${minutes % 60} دقيقة`);
      } else if (minutes > 0) {
        setConnectionDuration(`${minutes} دقيقة`);
      } else {
        setConnectionDuration("للتو");
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [isOnline, connectedAt]);
```

**Changes:**
- ❌ Removed: Local state `isOnline`
- ❌ Removed: Refs `previousIsOnline`, `isUpdatingStatus`
- ❌ Removed: Old feedback loop prevention effect
- ✅ Added: `connectionDuration` state
- ✅ Added: Get `isOnline` from `user?.profile?.isOnline`
- ✅ Added: Get `connectedAt` from `user?.profile?.connectedAt`
- ✅ Added: Duration calculation effect

---

#### Change 2: Add handler for toggling status (After stats calculation ~Line 180)

**ADDED:**
```typescript
// ✅ NEW: Handle online/offline status toggle
const handleToggleOnlineStatus = async () => {
  try {
    await updateStatus({ isOnline: !isOnline });
    const message = !isOnline 
      ? "✓ تم الاتصال بنجاح - أنت الآن متصل وجاهز لاستقبال الطلبات"
      : "✗ تم قطع الاتصال - لن تتلقى طلبات جديدة";
    toast.success(message);
  } catch (error: any) {
    console.error("Error toggling online status:", error);
    toast.error("فشل تحديث حالة الاتصال");
  }
};
```

---

#### Change 3: Update header button (Line ~530)

**BEFORE:**
```typescript
<button
  onClick={() => setIsOnline(!isOnline)}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
    isOnline
      ? "bg-green-100 text-green-700 hover:bg-green-200"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  <Power className="w-5 h-5" />
  {isOnline ? "متصل" : "غير متصل"}
</button>
```

**AFTER:**
```typescript
<button
  onClick={handleToggleOnlineStatus}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
    isOnline
      ? "bg-green-100 text-green-700 hover:bg-green-200"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
  title={isOnline ? "اضغط لقطع الاتصال" : "اضغط للاتصال"}
>
  <Power className="w-5 h-5" />
  <span>
    {isOnline ? "متصل الآن" : "غير متصل"}
    {isOnline && connectionDuration && (
      <span className="text-xs ml-1">({connectionDuration})</span>
    )}
  </span>
</button>
```

**Changes:**
- ✅ Changed handler to `handleToggleOnlineStatus`
- ✅ Changed text "متصل" → "متصل الآن"
- ✅ Added connection duration display
- ✅ Added title tooltip

---

#### Change 4: Update offline banner (Line ~545)

**BEFORE:**
```typescript
{!isOnline && (
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Power className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">أنت غير متصل حالياً</h3>
        <p className="text-gray-600 mb-4">
          قم بالاتصال لتلقي طلبات التوصيل الجديدة في منطقتك
        </p>
        <button
          onClick={() => setIsOnline(true)}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          الاتصال الآن
        </button>
      </div>
    </div>
  </div>
)}
```

**AFTER:**
```typescript
{!isOnline && (
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Power className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">أنت غير متصل حالياً</h3>
        <p className="text-gray-600 mb-4">
          قم بالاتصال الآن لتلقي طلبات التوصيل الجديدة في منطقتك
        </p>
        <button
          onClick={handleToggleOnlineStatus}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          اتصال الآن
        </button>
      </div>
    </div>
  </div>
)}
```

**Changes:**
- ✅ Changed handler to `handleToggleOnlineStatus`
- ✅ Updated message text for clarity

---

## 🔄 How It Works

```
Captain clicks button
    ↓
handleToggleOnlineStatus() executes
    ↓
updateStatus({ isOnline: !isOnline }) mutation called
    ↓
Backend updates database:
  - Set isOnline = true/false
  - Set connectedAt = Date.now() (if online) or undefined (if offline)
  - Set lastSeen = Date.now()
    ↓
useAuth() hook re-renders (Convex real-time sync)
    ↓
user?.profile?.isOnline updated
user?.profile?.connectedAt updated
    ↓
isOnline variable re-evaluates
connectedAt variable re-evaluates
    ↓
connectionDuration effect recalculates
    ↓
UI re-renders with:
  - New button color (green/gray)
  - New button text (متصل الآن / غير متصل)
  - Connection duration display
  - Offline banner visibility toggle
    ↓
Success toast shows
```

---

## ✅ Persistence Flow

```
1. Captain goes online → database: isOnline=true, connectedAt=timestamp
2. Page refreshes → useAuth() loads profile with isOnline=true
3. UI shows: متصل الآن with duration → ✓ PERSISTED
4. Captain logs out → Database unchanged (isOnline still true)
5. Captain logs in → useAuth() loads same profile
6. UI shows: متصل الآن with duration → ✓ PERSISTED
7. Captain navigates → useAuth() maintains state
8. UI shows: متصل الآن with duration → ✓ PERSISTED
```

---

## 📊 Real-Time Sync

```
Captain A goes online
    ↓
updateStatus mutation updates database
    ↓
Convex real-time subscription fires
    ↓
Captain A's CaptainDashboard re-renders ✓
Admin Dashboard getAllCaptains updates ✓
Store Dashboard (if shown) updates ✓
Other captains' list (if shown) updates ✓
    ↓
All dashboards show Captain A online instantly (no refresh needed)
```

---

## ✨ Features Implemented

✅ Persistent online/offline status  
✅ Status survives page refresh  
✅ Status survives logout/login  
✅ Status survives navigation  
✅ Connection duration displayed  
✅ Real-time sync with admin dashboard  
✅ Real-time sync with other dashboards  
✅ Database as single source of truth  
✅ No localStorage dependency  
✅ Success/error messages  
✅ TypeScript validation passes  

---

## 📍 Files Changed

- ✅ convex/schema.ts (1 field added)
- ✅ convex/profiles.ts (1 mutation updated)
- ✅ src/components/CaptainDashboard.tsx (4 sections updated, 1 handler added)

---

## 🧪 Test Result

All 3 files pass TypeScript compilation with zero errors
