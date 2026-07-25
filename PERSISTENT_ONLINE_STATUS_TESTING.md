# 🧪 Testing Guide - Persistent Captain Online/Offline Status

## 🚀 Quick Start Testing

### Setup
1. Start your development server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Have two browser tabs/windows ready for some tests

---

## ✅ Test Suite 1: Basic Online/Offline Toggle

**Objective:** Verify captain can toggle online/offline status

**Steps:**

1. Navigate to Captain Dashboard
   - Should see "غير متصل" (gray) button in header

2. Click "اتصال الآن" button in offline banner
   - Button should turn green
   - Text should change to "متصل الآن"
   - Duration should appear: "(للتو)"
   - Toast should show: "✓ تم الاتصال بنجاح - أنت الآن متصل وجاهز لاستقبال الطلبات"
   - Offline banner should disappear
   - Empty state message should change

3. Click the "متصل الآن" button header
   - Button should turn gray
   - Text should change to "غير متصل"
   - Duration should disappear
   - Toast should show: "✗ تم قطع الاتصال - لن تتلقى طلبات جديدة"
   - Offline banner should reappear

**Expected Result:** ✅ Toggle works smoothly with correct UI updates

---

## ✅ Test Suite 2: Page Refresh Persistence

**Objective:** Verify status persists after page refresh

**Steps:**

1. Go online
   - Button shows "متصل الآن (للتو)"
   - Connection duration visible
   - Offline banner hidden

2. Refresh page (F5 or Ctrl+R)
   - Page reloads
   - Loading spinner appears briefly
   - Dashboard reappears

3. Check status after reload
   - Button SHOULD still show "متصل الآن" ✓
   - Duration SHOULD show (probably "1 دقيقة" or similar)
   - Offline banner SHOULD be hidden ✓
   - Captain remains online

4. Click to go offline
   - Button turns gray
   - Offline banner reappears

5. Refresh page again
   - Button SHOULD still show "غير متصل" ✓
   - Offline banner SHOULD reappear ✓

**Expected Result:** ✅ Status persists across page refreshes

---

## ✅ Test Suite 3: Connection Duration Updates

**Objective:** Verify duration calculation and updates

**Steps:**

1. Go online
   - Duration shows "للتو" (just now)
   - Wait 10 seconds
   - Duration should STILL show "للتو"

2. Wait 50+ seconds (total 60+ seconds)
   - Duration SHOULD update to "1 دقيقة" ✓
   - Updates happen every 60 seconds

3. Continue waiting
   - After 2 minutes: "2 دقائق"
   - After 5 minutes: "5 دقائق"
   - etc.

4. Go offline
   - Duration disappears ✓

**Note:** Full duration testing (hours/days) requires extended test time

**Expected Result:** ✅ Duration displays correctly and updates every minute

---

## ✅ Test Suite 4: Logout/Login Persistence

**Objective:** Verify status persists through logout/login cycle

**Steps:**

1. Go online
   - Button shows "متصل الآن (X دقائق)"

2. Click logout/profile menu → logout
   - Redirected to login page
   - Session cleared

3. Database check: Status should STILL be online in database
   - (Can verify in Convex dashboard if needed)

4. Log back in as same captain
   - Redirected to dashboard

5. Check status
   - Button SHOULD show "متصل الآن" ✓
   - Duration SHOULD be visible (shows time since original connection)
   - Status persisted through logout/login ✓

6. Logout and login as DIFFERENT user (different captain)
   - That user's status should be different
   - Verifies not using global state

**Expected Result:** ✅ Status persists across logout/login cycles

---

## ✅ Test Suite 5: Admin Dashboard Real-Time Sync

**Objective:** Verify admin sees real-time captain status updates

**Prerequisite:** Admin account must exist and have access to Captains Management

**Steps:**

1. Open first browser tab: Admin Dashboard (Captains Management page)
   - See list of captains
   - Note captain counts (online/offline)

2. Open second browser tab: Captain Dashboard
   - Logged in as a specific captain
   - Captain is currently offline

3. In Captain Dashboard (Tab 2):
   - Click "اتصال الآن"
   - Verify status changes to green "متصل الآن"
   - Toast appears

4. Switch to Admin Dashboard (Tab 1)
   - WITHOUT refreshing the page
   - Check captain status in list
   - SHOULD show captain as online ✓
   - Captain counts should update:
     - Online count: +1 ✓
     - Offline count: -1 ✓
   - NO page refresh was needed ✓

5. In Captain Dashboard (Tab 2):
   - Click "فصل الاتصال"
   - Status changes to gray

6. Switch back to Admin Dashboard (Tab 1)
   - WITHOUT refreshing
   - Captain SHOULD show offline ✓
   - Counts SHOULD update again ✓

7. Test filter in Admin:
   - Filter by "متصل" → Captain appears
   - Filter by "غير متصل" → Captain disappears
   - Filter off → Captain visible in both

**Expected Result:** ✅ Admin sees instant updates without page refresh

---

## ✅ Test Suite 6: Multiple Tabs Sync

**Objective:** Verify multiple captain tabs stay in sync

**Steps:**

1. Open Captain Dashboard in Tab 1
   - Currently offline

2. Open same dashboard in Tab 2
   - Currently offline in both

3. In Tab 1: Click "اتصال الآن"
   - Tab 1 shows green "متصل الآن" ✓

4. Switch to Tab 2
   - Tab 2 SHOULD ALSO show green "متصل الآن" ✓
   - Real-time sync working across tabs

5. Switch to Tab 1: Click disconnect
   - Tab 1 shows gray "غير متصل" ✓

6. Switch to Tab 2
   - Tab 2 SHOULD ALSO show gray "غير متصل" ✓

**Expected Result:** ✅ Multiple tabs stay synchronized

---

## ✅ Test Suite 7: Navigation Persistence

**Objective:** Verify status persists when navigating between pages

**Steps:**

1. Go online
   - Captain Dashboard shows "متصل الآن"

2. Navigate to Orders page
   - Captain remains online (useAuth maintains state)

3. Navigate to Profile page
   - Captain still online

4. Navigate back to Dashboard
   - Status still shows "متصل الآن" ✓
   - Duration continues counting ✓

5. Logout from any page
   - Works as expected

6. Login again
   - Navigate to Dashboard
   - Status shows "متصل الآن" (if was online before logout)

**Expected Result:** ✅ Status persists during navigation

---

## ✅ Test Suite 8: Error Handling

**Objective:** Verify error cases are handled gracefully

**Steps:**

1. Go online successfully
   - Status shows green

2. Try to toggle status with network offline
   - (Use browser DevTools: Network tab → Offline)
   - Wait for mutation attempt
   - Toast should show: "فشل تحديث حالة الاتصال"
   - Status remains unchanged

3. Re-enable network
   - Try toggle again
   - Should work normally

**Expected Result:** ✅ Errors handled with user-friendly messages

---

## ✅ Test Suite 9: Store Dashboard Sync (if applicable)

**Objective:** Verify store sees captain online status

**Prerequisite:** Store account must exist and can view captains

**Steps:**

1. Open Store Dashboard
   - May have captain list or filter

2. Open Captain Dashboard in another tab
   - Go online

3. Refresh Store Dashboard OR wait for auto-update
   - SHOULD show captain online ✓

**Expected Result:** ✅ Store sees captain status updates

---

## ⚠️ Edge Cases to Test

### Case 1: Captain Online for 24+ Hours
```
Status: { isOnline: true, connectedAt: (24 hours ago) }
Duration should display: "1 يوم و X ساعات"
(Requires extended test - can simulate by checking code)
```

### Case 2: Rapid Toggle
```
Click online → offline → online → offline quickly
Each toggle should register correctly
No state corruption
```

### Case 3: Tab Close/Reopen
```
Tab 1: Captain goes online
Close Tab 1
Open new browser tab
Navigate to Captain Dashboard
Status should be: Online (persisted)
```

### Case 4: Browser Close/Reopen
```
Captain goes online
Close browser completely
Reopen browser
Navigate to dashboard
Log in if needed
Status should be: Online (persisted in database)
```

### Case 5: Network Offline Then Online
```
Captain goes online
Disconnect network (DevTools)
Reconnect network
Status should sync from database
Correct status displayed
```

---

## 📊 Test Results Template

Copy and fill out when testing:

```
TEST SUITE 1: Basic Toggle
[ ] Status toggled to online
[ ] Green button displayed
[ ] Success toast shown
[ ] Toggled back to offline
Result: PASS / FAIL

TEST SUITE 2: Page Refresh
[ ] Status persisted after F5 refresh
[ ] Duration still visible
[ ] Offline status persisted when offline
Result: PASS / FAIL

TEST SUITE 3: Duration Updates
[ ] Shows "للتو" initially
[ ] Updates to "X دقيقة" after 60s
[ ] Disappears when offline
Result: PASS / FAIL

TEST SUITE 4: Logout/Login
[ ] Status persisted after logout
[ ] Status visible after login
[ ] Different user has different status
Result: PASS / FAIL

TEST SUITE 5: Admin Sync
[ ] Admin saw instant update (no refresh)
[ ] Counts updated automatically
[ ] Filter reflects new status
Result: PASS / FAIL

TEST SUITE 6: Multi-Tab
[ ] Tab 2 updated when Tab 1 changed
[ ] Real-time sync working
Result: PASS / FAIL

TEST SUITE 7: Navigation
[ ] Status persisted during nav
[ ] Duration continued counting
[ ] Logout preserved online status
Result: PASS / FAIL

TEST SUITE 8: Error Handling
[ ] Error toast shown on failure
[ ] Status unchanged on error
Result: PASS / FAIL

OVERALL: PASS / FAIL
```

---

## 🔍 Debugging Tips

### If tests fail:

1. **Check browser console:**
   ```
   Open DevTools: F12
   Console tab: Look for errors
   ```

2. **Check Convex logs:**
   ```
   Visit Convex dashboard
   Check mutations execution logs
   Look for validation errors
   ```

3. **Verify database state:**
   ```
   Convex dashboard → Data
   profiles table → Search for captain
   Check: isOnline, connectedAt, lastSeen
   ```

4. **Check network requests:**
   ```
   DevTools → Network tab
   Filter: "api" or "convex"
   Watch mutations execute
   ```

5. **Check React state:**
   ```
   React DevTools → Components
   Find CaptainDashboard
   Check: isOnline, connectedAt, connectionDuration
   Verify re-renders when status changes
   ```

---

## ✅ Final Verification

When all tests pass:

```
✅ Persistence: Status survives refresh/logout
✅ Real-time sync: Admin sees updates instantly
✅ Duration: Displays and updates correctly
✅ Error handling: Graceful failure messages
✅ Multiple devices: Stay in sync
✅ UI/UX: Smooth transitions and messages
✅ Performance: No lag or delays
✅ Database: Data correctly stored
✅ Scalability: Works with multiple captains

READY FOR PRODUCTION ✓
```

---

## 📞 Support

If tests fail:
1. Check the three documentation files for detailed info
2. Review the code changes in the summary file
3. Verify database schema includes `connectedAt` field
4. Check that mutations are called correctly
5. Ensure useAuth() hook returns latest profile data

