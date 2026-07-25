# 🔧 Fix Report: ReferenceError: useAuth is not defined

## ❌ Problem Identified

**File:** `src/components/CaptainAuth.tsx`  
**Error:** ReferenceError: useAuth is not defined  
**Location:** Line 22 (inside the component body)

### Error Details
```typescript
const { user, isAuthenticated } = useAuth(); // ❌ useAuth is not defined
```

### Root Cause
The `CaptainAuth.tsx` component was using the `useAuth()` hook but had not imported it from the AuthContext. This was causing a runtime error when the component tried to access the authentication context.

---

## ✅ Solution Applied

### Change #1: Added useAuth Import (Line 14)

**BEFORE (Lines 1-14):**
```typescript
import { useState, useEffect, useRef } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Truck, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  attemptPasswordSignIn,
  isMissingPasswordAccountError,
  isAccountExistsError,
  normalizeAuthEmail,
} from "../lib/adminAuth";
import { useTranslation } from "react-i18next";
```

**AFTER (Lines 1-14):**
```typescript
import { useState, useEffect, useRef } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Truck, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  attemptPasswordSignIn,
  isMissingPasswordAccountError,
  isAccountExistsError,
  normalizeAuthEmail,
} from "../lib/adminAuth";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
```

**Exact Change:**
```diff
+ import { useAuth } from "../contexts/AuthContext";
```

---

## 🔍 Authentication Implementation Analysis

### Current Auth Architecture
The project uses a hybrid authentication system:

#### 1. **Convex Auth** (Low-level provider)
- Provider: `@convex-dev/auth/react`
- Hook: `useAuthActions()` - for sign-in/sign-out operations
- Used for: Password authentication, session management

#### 2. **Custom AuthContext** (High-level wrapper)
- Location: `src/contexts/AuthContext.tsx`
- Implementation: Re-exports from `AuthContextNew.tsx`
- Hook: `useAuth()` - for user state, permissions, and role checks
- Provides:
  - `user: User | null` - Full user object with profile
  - `isAuthenticated: boolean` - Login status
  - `role: UserRole | null` - User role (customer, merchant, captain, admin)
  - Permission checking methods

### Why Two Authentication Systems?
1. **Convex Auth**: Handles low-level authentication (credentials, sessions)
2. **AuthContext**: Handles high-level state (user data, permissions, profile information)

---

## 📍 All Authentication Imports in CaptainAuth.tsx

| Import | Purpose | Used |
|--------|---------|------|
| `useAuthActions` | Sign-in/Sign-out operations | ✅ Line 20: `const { signIn } = useAuthActions()` |
| `useMutation` | Profile creation mutation | ✅ Line 21: `const createProfile = useMutation(...)` |
| `useQuery` | (Not used in CaptainAuth directly) | ⚠️ Imported but unused |
| `useAuth` | User state and auth context | ✅ Line 22: `const { user, isAuthenticated } = useAuth()` |

---

## 🎯 Verification Checklist

✅ **useAuth hook is now imported** from `../contexts/AuthContext`  
✅ **Import source is correct** - Matches pattern used in AdminAuth.tsx and CaptainApp.tsx  
✅ **No circular imports** - AuthContext properly exports useAuth hook  
✅ **No naming conflicts** - useAuth is the correct hook name  
✅ **All usages are correct** - Hook called properly in component body  
✅ **TypeScript validation passed** - No compilation errors  
✅ **Consistent with project patterns** - Matches other components' usage  

---

## 📋 Hook Usage in CaptainAuth.tsx (Line 22)

```typescript
export default function CaptainAuth() {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();                    // Convex Auth
  const createProfile = useMutation(api.profiles.createProfile);  // Convex Data
  const { user, isAuthenticated } = useAuth();           // ✅ NOW IMPORTED - AuthContext

  // Component continues...
}
```

---

## 🔐 AuthContext Export Chain

```
AuthContext.tsx (Re-exports)
  ↓
AuthContextNew.tsx (Actual implementation)
  ↓
useAuth() hook exported at line 185
  ↓
Used in CaptainAuth.tsx (line 22)
```

---

## 📊 Summary of Changes

| Aspect | Status |
|--------|--------|
| Missing import added | ✅ Fixed |
| Import source verified | ✅ Correct |
| No circular dependencies | ✅ Valid |
| Component uses auth correctly | ✅ Valid |
| TypeScript validation | ✅ Pass |
| Runtime error | ✅ Resolved |

---

## 🚀 Result

The `ReferenceError: useAuth is not defined` has been completely resolved by adding the missing import statement:

```typescript
import { useAuth } from "../contexts/AuthContext";
```

The component now has access to:
- ✅ User authentication state
- ✅ User profile information  
- ✅ Authentication status checking
- ✅ Role-based access control

**CaptainAuth.tsx is now fully functional and can properly manage captain authentication and profile creation.**
