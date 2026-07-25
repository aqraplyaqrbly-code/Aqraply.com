# نظام تنظيف قاعدة البيانات

## 📋 نظرة عامة
تم إنشاء نظام كامل لتنظيف قاعدة البيانات من البيانات غير الضرورية لتقليل استخدام Convex وتجنب تجاوز حدود الخطة المجانية.

## 📁 الملفات المضافة/المعدلة

### 1. convex/cleanup.ts (جديد)
- **الوظيفة:** دوال لتنظيف البيانات غير الضرورية
- **الدوال:**
  - `deleteExpiredOtps`: حذف OTP tokens منتهية الصلاحية
  - `deleteExpiredPasswordResetTokens`: حذف password reset tokens منتهية
  - `deleteExpiredAuthSessions`: حذف auth sessions منتهية
  - `deleteExpiredVerificationTokens`: حذف verification tokens منتهية
  - `deleteExpiredVerificationCodes`: حذف verification codes منتهية
  - `deleteExpiredRefreshTokens`: حذف refresh tokens منتهية
  - `deleteOldSecurityLogs`: حذف security logs القديمة (30 يوم)
  - `deleteOldNotifications`: حذف notifications القديمة (7 أيام)
  - `deleteExpiredCoupons`: حذف coupons منتهية الصلاحية
  - `deleteExpiredPromotions`: حذف promotions منتهية الصلاحية
  - `deleteExpiredFeaturedProducts`: حذف featured products منتهية
  - `cleanupAll`: تنظيف شامل لكل شيء
  - `getDatabaseStats`: إحصائيات قاعدة البيانات

### 2. src/components/admin/DatabaseCleanup.tsx (جديد)
- **الوظيفة:** واجهة المستخدم لتنظيف قاعدة البيانات
- **المميزات:**
  - عرض إحصائيات قاعدة البيانات
  - أزرار منفصلة لكل نوع من التنظيف
  - زر "تنظيف شامل" لكل شيء
  - تحذير قبل التنظيف
  - عرض حالة التحميل
  - إشعارات Toast للنجاح/الفشل

### 3. src/components/AdminDataExport.tsx (معدل)
- **التعديل:** إضافة DatabaseCleanup في الصفحة
- **الاستيراد:** `import DatabaseCleanup from './admin/DatabaseCleanup';`
- **الموقع:** بعد Export History

## 🚀 كيفية الاستخدام

### للمستخدمين:
1. اذهب إلى لوحة الإدارة: `/admin/export`
2. انتقل لأسفل الصفحة إلى قسم "تنظيف قاعدة البيانات"
3. اضغط على الزر المناسب:
   - **تنظيف شامل:** لحذف كل شيء دفعة واحدة
   - **أزرار منفصلة:** لحذف نوع محدد من البيانات
4. انتظر اكتمال العملية
5. سيظهر إشعار بالنتيجة

### للمطورين:
```tsx
import DatabaseCleanup from './admin/DatabaseCleanup';

// في أي مكون
<DatabaseCleanup />
```

## 📊 البيانات التي سيتم تنظيفها

### 1. Auth Tokens (منتهية الصلاحية)
- ✅ OTP tokens
- ✅ Password reset tokens
- ✅ Auth sessions
- ✅ Verification tokens
- ✅ Verification codes
- ✅ Refresh tokens

### 2. Logs القديمة
- ✅ Security logs (أكثر من 30 يوم)
- ✅ Notifications (أكثر من 7 أيام)

### 3. العروض منتهية الصلاحية
- ✅ Coupons
- ✅ Promotions
- ✅ Featured products

## ⚠️ تحذيرات

- هذه العمليات ستحذف البيانات بشكل دائم
- تأكد من عمل نسخة احتياطية قبل التنظيف
- استخدم زر "Download Backup" أولاً
- البيانات المحذوفة لا يمكن استعادتها

## 🔧 التخصيص

### لتغيير فترة الاحتفاظ بالسجلات:
```typescript
// في cleanup.ts
export const deleteOldSecurityLogs = mutation({
  args: {
    daysOld: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysOld || 30; // غير هذا الرقم
    // ...
  },
});
```

### لإضافة نوع جديد من التنظيف:
```typescript
export const deleteCustomData = mutation({
  handler: async (ctx) => {
    // منطق التنظيف الخاص بك
    return { deleted: 0, message: "..." };
  },
});
```

## 📈 الفوائد

- ✅ تقليل استخدام Convex
- ✅ تحسين أداء قاعدة البيانات
- ✅ توفير المساحة
- ✅ تجنب تجاوز حدود الخطة المجانية
- ✅ واجهة سهلة الاستخدام
- ✅ تحكم كامل في ما يتم حذفه

## 🔄 التطويرات المستقبلية

- إضافة جدولة تلقائية للتنظيف
- إضافة خيارات مخصصة للفترات
- إضافة معاينة قبل الحذف
- إضافة استعادة البيانات المحذوفة
- إضافة تقارير عن التنظيف
