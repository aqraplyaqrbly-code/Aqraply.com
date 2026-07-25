# Authentication System Rebuild - Complete Documentation

## Overview
This document describes the complete rebuild of the Aqraply authentication and authorization system using Convex Auth.

## Changes Made

### 1. Backend (Convex)

#### New Files Created:
- **convex/seedAdmin.ts** - Admin account seeding script
  - `seedAdmin` mutation: Creates the first admin account securely
  - `resetAdminPassword` mutation: Resets admin password (for emergency use)

- **convex/authNew.ts** - New authentication system
  - `getCurrentUser` query: Gets current authenticated user with profile
  - `hasRole` query: Checks if user has specific role
  - `createProfile` mutation: Creates user profile during registration
  - `updateProfile` mutation: Updates user profile
  - `updateCaptainStatus` mutation: Updates captain online/offline status
  - `getAllUsers` query: Gets all users (admin only)
  - `suspendUser` mutation: Suspend/unsuspend user (admin only)
  - `approveUser` mutation: Approve/reject merchant or captain (admin only)

#### Files Kept for Backward Compatibility:
- **convex/auth.ts** - Existing auth file (kept for backward compatibility with old components)
- **convex/schema.ts** - Schema already has all required tables

### 2. Frontend (React)

#### New Files Created:
- **src/components/UnifiedLogin.tsx** - Unified login page
  - Single login form for all roles
  - Uses Convex Auth password provider
  - Automatic role-based redirect after login

- **src/components/UnifiedRegister.tsx** - Unified registration page
  - Multi-step registration process
  - Role selection (Customer, Merchant, Captain)
  - Role-specific form fields
  - Profile creation after authentication

- **src/components/AuthRedirect.tsx** - Role-based redirect component
  - Automatically redirects users to their role-specific dashboard

#### Files Modified:
- **src/contexts/AuthContextNew.tsx** - Updated to use new auth system
  - Changed from `api.auth.loggedInUser` to `api.authNew.getCurrentUser`
  - Added mutations: `createProfile`, `updateProfile`, `updateCaptainStatus`
  - Removed manual session management (handled by Convex Auth)
  - Updated User interface to include profile `_id`

- **src/App.tsx** - Added new routes
  - Added `/login` route using UnifiedLogin
  - Added `/register` route using UnifiedRegister
  - Added `/register/:role` route for role-specific registration

- **src/components/ProtectedRoute.tsx** - Already compatible, no changes needed

## Features

### 1. User Roles
- **Admin**: Full system access, can manage all users, stores, orders
- **Merchant**: Store owner, can manage products and orders
- **Captain**: Delivery driver, can manage assigned orders
- **Customer**: Can place orders and manage their account

### 2. Authentication Features
- ✅ Sign Up with email/password
- ✅ Sign In with email/password
- ✅ Sign Out
- ✅ Session persistence (handled by Convex Auth)
- ✅ Email verification (ready to implement)
- ✅ Protected routes with role-based access

### 3. Security Features
- ✅ Secure password hashing via Convex Auth
- ✅ Role-based access control (RBAC)
- ✅ Account suspension system
- ✅ Admin approval for merchants and captains
- ✅ Input validation on all forms
- ✅ Protected admin routes

### 4. Admin Account Setup
The admin account is created using a secure seed script:

```bash
# Run this from the Convex dashboard or CLI
npx convex run seedAdmin --args '{"email":"admin@aqraply.com","password":"SecurePassword123!","fullName":"Admin User"}'
```

## Current Status

### Completed:
- ✅ Created seed script for admin account
- ✅ Created new auth backend (authNew.ts)
- ✅ Created unified login component
- ✅ Created unified registration component
- ✅ Updated AuthContextNew to use new auth system
- ✅ Added new routes to App.tsx
- ✅ Created AuthRedirect component

### Pending:
- ⏳ Test the new authentication system
- ⏳ Create admin account using seed script
- ⏳ Update existing components to use new auth context (optional)
- ⏳ Remove old auth components after testing (optional)
- ⏳ Implement email verification
- ⏳ Add password reset functionality

## Migration Steps

### Step 1: Create Admin Account
Run the seed script to create the first admin account:

```bash
npx convex run seedAdmin --args '{"email":"admin@aqraply.com","password":"SecurePassword123!","fullName":"Admin User"}'
```

### Step 2: Test Authentication
1. Navigate to `/login` and test login
2. Navigate to `/register` and test registration for each role
3. Verify role-based redirects work correctly
4. Test protected routes

### Step 3: Update Existing Components (Optional)
Gradually migrate existing components to use the new auth context:
- Update CustomerApp, MerchantDashboard, CaptainApp to use new auth hooks
- Update profile creation flows to use new mutations
- Update admin dashboard to use new admin mutations

### Step 4: Remove Old Auth Code (Optional)
After testing, you can remove old auth files:
- Old auth components (CustomerLogin, CustomerRegister, MerchantAuth, CaptainAuth, AdminAuth)
- Old auth mutations if no longer used

## Testing Checklist

- [ ] Admin account creation via seed script
- [ ] Customer registration and login
- [ ] Merchant registration and login
- [ ] Captain registration and login
- [ ] Role-based redirects after login
- [ ] Protected routes work correctly
- [ ] Profile creation after registration
- [ ] Admin can suspend users
- [ ] Admin can approve merchants/captains
- [ ] Captain online/offline status toggle
- [ ] Profile updates work correctly
- [ ] Session persistence works

## Next Steps

1. **Create Admin Account**: Run the seed script to create the first admin
2. **Test Authentication**: Test login and registration for all roles
3. **Migrate Components**: Update existing components to use new auth context
4. **Implement Email Verification**: Add email verification flow
5. **Add Password Reset**: Implement password reset functionality
