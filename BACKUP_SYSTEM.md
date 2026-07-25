# نظام النسخ الاحتياطي لقاعدة بيانات Convex

## 📋 نظرة عامة
تم إنشاء نظام كامل لنسخ احتياطي لقاعدة بيانات Convex مع إمكانية تصدير جميع البيانات كملف JSON.

## 📁 الملفات المعدلة/المضافة

### 1. convex/export.ts (جديد)
- **الوظيفة:** تصدير جميع البيانات من قاعدة البيانات
- **الدوال:**
  - `exportAllData`: تصدير جميع الجداول مع metadata
  - `getTableNames`: إرجاع قائمة بجميع الجداول
- **الجداول المدعومة:** 30 جدول (users, profiles, stores, products, orders, reviews, phoneOtps, passwordResetTokens, otpVerifications, securityLogs, systemSettings, authAccounts, authSessions, authVerificationTokens, authRefreshTokens, authVerificationCodes, authVerifiers, authRateLimits, storeReviews, productReviews, reviewLikes, wallets, walletTransactions, coupons, notifications, subscriptionPlans, storeSubscriptions, promotions, featuredProducts, adminPermissions)

### 2. src/components/admin/BackupButton.tsx (جديد)
- **الوظيفة:** زر لتحميل النسخة الاحتياطية
- **المميزات:**
  - عرض حالة التحميل (loading state)
  - عرض حالة التصدير (exporting state)
  - معالجة الأخطاء
  - إشعار نجاح مع عدد الجداول والسجلات
  - اسم ملف مع timestamp
- **الاستخدام:** `<BackupButton />`

### 3. src/components/AdminDataExport.tsx (معدل)
- **التعديل:** إضافة BackupButton في Header
- **الاستيراد:** `import BackupButton from './admin/BackupButton';`
- **الموقع:** في قسم Header بعد العنوان

## 🚀 كيفية الاستخدام

### للمستخدمين:
1. اذهب إلى لوحة الإدارة: `/admin/export`
2. اضغط على زر "Download Backup" في أعلى الصفحة
3. سيتم تحميل ملف `aqraply-backup-{timestamp}.json`
4. الملف يحتوي على جميع البيانات مع metadata

### للمطورين:
```tsx
import BackupButton from './admin/BackupButton';

// في أي مكون
<BackupButton />
```

## 📊 هيكل ملف النسخة الاحتياطية

```json
{
  "metadata": {
    "exportedAt": "2024-06-16T20:00:00.000Z",
    "version": "1.0",
    "tables": ["users", "profiles", "stores", ...],
    "counts": {
      "users": 100,
      "profiles": 95,
      "stores": 50,
      ...
    }
  },
  "data": {
    "users": [...],
    "profiles": [...],
    "stores": [...],
    ...
  }
}
```

## ✅ المميزات

- ✅ تصدير جميع الجداول تلقائياً
- ✅ معالجة الأخطاء بشكل صحيح
- ✅ عرض حالة التحميل
- ✅ إشعارات Toast للنجاح/الفشل
- ✅ اسم ملف مع timestamp
- ✅ إحصائيات (عدد الجداول والسجلات)
- ✅ تصميم جميل مع icons
- ✅ دعم RTL

## 🔧 التخصيص

### لتصدير جداول محددة:
```typescript
const exportData = useQuery(api.export.exportAllData, {
  tables: ["users", "profiles", "stores"]
});
```

### لتغيير اسم الملف:
```typescript
const filename = `custom-backup-${timestamp}.json`;
```

## 📝 ملاحظات

- النظام يستخدم Convex queries مباشرة
- لا حاجة لـ API endpoints منفصلة
- البيانات يتم تصديرها كـ JSON formatted
- الملف يحتوي على metadata مفيد
- يمكن استخدام الملف لاستعادة البيانات (يحتاج إلى إنشاء import function)

## 🔄 التطويرات المستقبلية

- إضافة وظيفة استعادة البيانات (restore)
- إضافة جدولة تلقائية للنسخ الاحتياطي
- إضافة تصدير بصيغ أخرى (CSV, Excel)
- إضافة تشفير للملفات
- إضافة رفع النسخ الاحتياطية إلى cloud storage
