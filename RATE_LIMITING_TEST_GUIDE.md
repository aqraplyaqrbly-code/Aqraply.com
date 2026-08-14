# Rate Limiting Regression & Abuse Test Guide

## Overview
This guide provides manual testing instructions for the rate limiting implementation. Since the tests require authenticated users and valid data, they must be tested from the Convex Dashboard or Frontend.

## Test Mutations Available
The following test mutations are available in `convex/rateLimitTest.ts`:
- `testCreateOrderRateLimit`
- `testCreateProductRateLimit`
- `testCreateStoreRateLimit`
- `testUpdateOrderStatusRateLimit`
- `testAddBalanceRateLimit`
- `testUserIsolation`
- `testActionIsolation`
- `testWindowReset`
- `testUnauthorizedRequest`

## Testing Instructions

### 1. Test createOrder Rate Limit (10 requests per hour)

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testCreateOrderRateLimit`
2. Call the mutation 11 times with a valid `sessionToken`
3. Expected: First 10 calls succeed, 11th call fails with rate limit error
4. Error message: "لقد تجاوزت الحد الأقصى. الرجاء المحاولة بعد 1 ساعة"

**Expected Result:**
- ✅ First 10 requests: Success
- ❌ 11th request: Rate limit error
- ✅ After 1 hour: Counter resets, requests succeed again

---

### 2. Test createProduct Rate Limit (20 requests per hour)

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testCreateProductRateLimit`
2. Call the mutation 21 times with a valid `sessionToken`
3. Expected: First 20 calls succeed, 21st call fails with rate limit error

**Expected Result:**
- ✅ First 20 requests: Success
- ❌ 21st request: Rate limit error
- ✅ After 1 hour: Counter resets

---

### 3. Test createStore Rate Limit (1 request per day)

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testCreateStoreRateLimit`
2. Call the mutation twice with a valid `sessionToken`
3. Expected: First call succeeds, second call fails with rate limit error

**Expected Result:**
- ✅ First request: Success
- ❌ Second request: Rate limit error
- ✅ After 24 hours: Counter resets

---

### 4. Test updateOrderStatus Rate Limit (30 requests per minute)

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testUpdateOrderStatusRateLimit`
2. Call the mutation 31 times with a valid `sessionToken`
3. Expected: First 30 calls succeed, 31st call fails with rate limit error

**Expected Result:**
- ✅ First 30 requests: Success
- ❌ 31st request: Rate limit error
- ✅ After 1 minute: Counter resets

---

### 5. Test addBalance Rate Limit (5 requests per hour)

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testAddBalanceRateLimit`
2. Call the mutation 6 times with a valid admin `sessionToken`
3. Expected: First 5 calls succeed, 6th call fails with rate limit error

**Expected Result:**
- ✅ First 5 requests: Success
- ❌ 6th request: Rate limit error
- ✅ After 1 hour: Counter resets

**Important:** This mutation also checks admin authorization. Non-admin users will get authorization error before rate limit check.

---

### 6. Test User Isolation

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testUserIsolation`
2. Call the mutation with User A's `sessionToken` and User B's `testUserId`
3. Expected: User A's rate limit does not affect User B

**Expected Result:**
- ✅ User A can make 10 createOrder requests
- ✅ User B can independently make 10 createOrder requests
- ✅ Rate limits are isolated per user

---

### 7. Test Action Isolation

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testActionIsolation`
2. Call the mutation with a valid `sessionToken`
3. Expected: Different actions have independent rate limits

**Expected Result:**
- ✅ User can make 10 createOrder requests
- ✅ Same user can independently make 20 createProduct requests
- ✅ Rate limits are isolated per action

---

### 8. Test Window Reset

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testWindowReset`
2. Call the mutation 4 times with a valid `sessionToken`
3. Expected: First 3 calls succeed, 4th call fails
4. Wait 1 second
5. Call the mutation again
6. Expected: Request succeeds (counter reset)

**Expected Result:**
- ✅ First 3 requests: Success (window: 1 second, limit: 3)
- ❌ 4th request: Rate limit error
- ✅ After 1 second: Counter resets, request succeeds

---

### 9. Test Unauthorized Requests

**From Convex Dashboard:**
1. Go to Functions → `rateLimitTest.testUnauthorizedRequest`
2. Call the mutation without `sessionToken`
3. Expected: Authentication error before rate limit check

**Expected Result:**
- ❌ Request fails with "يجب تسجيل الدخول أولاً"
- ✅ Rate limit check never reached (authentication fails first)
- ✅ This confirms the correct order: Authentication → Authorization → Rate Limit

---

## Expected Test Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| createOrder (10/hour) | 10 success, 11th fail | ⏳ Pending manual test |
| createProduct (20/hour) | 20 success, 21st fail | ⏳ Pending manual test |
| createStore (1/day) | 1 success, 2nd fail | ⏳ Pending manual test |
| updateOrderStatus (30/min) | 30 success, 31st fail | ⏳ Pending manual test |
| addBalance (5/hour) | 5 success, 6th fail | ⏳ Pending manual test |
| User Isolation | Independent limits per user | ⏳ Pending manual test |
| Action Isolation | Independent limits per action | ⏳ Pending manual test |
| Window Reset | Counter resets after window | ⏳ Pending manual test |
| Unauthorized Request | Auth error before rate limit | ⏳ Pending manual test |

## Potential Failures

### 1. Race Condition Bypass
**Risk:** If check + increment are not in the same transaction
**Detection:** Multiple concurrent requests exceed limit
**Mitigation:** Implementation uses single transaction (check + increment together)

### 2. User Isolation Failure
**Risk:** If identifier is not unique per user
**Detection:** User A's limit affects User B
**Mitigation:** Implementation uses `userId.toString()` as identifier

### 3. Action Isolation Failure
**Risk:** If compound index is not working correctly
**Detection:** createOrder limit affects createProduct
**Mitigation:** Implementation uses compound index on (identifier, action)

### 4. Window Reset Failure
**Risk:** If window calculation is incorrect
**Detection:** Counter does not reset after window expires
**Mitigation:** Implementation uses `now - (now % windowMs)` for window alignment

### 5. Authorization Bypass
**Risk:** If rate limit is checked before authorization
**Detection:** Unauthorized user can consume rate limit
**Mitigation:** Implementation checks rate limit AFTER authorization

## Regression Checks

### ✅ No Breaking Changes
- authRateLimits table was unused before
- No existing functionality depends on it
- Schema change is backward compatible

### ✅ No Authorization Changes
- sessionToken validation unchanged
- Role checks unchanged
- Rate limit added AFTER authorization

### ✅ No Security Fix Changes
- Phase 1 fixes unchanged
- Phase 2A fixes unchanged
- Step 3 price validation unchanged

### ✅ Build Success
- TypeScript compilation successful
- No lint errors
- Build exit code: 0

## Conclusion

The rate limiting implementation is designed to be:
- **Safe:** No race conditions (single transaction)
- **Isolated:** Per user and per action
- **Correct:** Proper order (Auth → AuthZ → Rate Limit → Validation → Operation)
- **Non-breaking:** No impact on existing functionality

**Next Steps:**
1. Run manual tests from Convex Dashboard
2. Verify expected results
3. Report any failures
4. Proceed to next security phase if all tests pass
