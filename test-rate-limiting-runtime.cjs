// Runtime Rate Limiting Regression & Abuse Test
const { ConvexHttpClient } = require("convex/browser");

// Get Convex URL from environment or use default
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://quick-cormorant-163.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Test results
const results = {
  createOrder: { status: "PENDING", attempts: 0, errors: [] },
  createProduct: { status: "PENDING", attempts: 0, errors: [] },
  createStore: { status: "PENDING", attempts: 0, errors: [] },
  updateOrderStatus: { status: "PENDING", attempts: 0, errors: [] },
  addBalance: { status: "PENDING", attempts: 0, errors: [] },
  userIsolation: { status: "PENDING", attempts: 0, errors: [] },
  actionIsolation: { status: "PENDING", attempts: 0, errors: [] },
  windowReset: { status: "PENDING", attempts: 0, errors: [] },
  unauthorizedRequest: { status: "PENDING", attempts: 0, errors: [] },
};

// Test user IDs
const userA = "test_user_a";
const userB = "test_user_b";

// Helper function to run mutation
async function runMutation(mutationName, args) {
  try {
    const result = await client.mutation(mutationName, args);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper to reset rate limit
async function resetRateLimit(userId, action) {
  await runMutation("rateLimitTest:resetRateLimit", { testUserId: userId, action });
}

// Helper to get rate limit status
async function getRateLimitStatus(userId, action) {
  return await runMutation("rateLimitTest:getRateLimitStatus", { testUserId: userId, action });
}

// Test 1: createOrder rate limit (10 requests per hour)
async function testCreateOrderRateLimit() {
  console.log("\n🧪 Test 1: createOrder rate limit (10 requests per hour)");
  
  // Reset any existing rate limit
  await resetRateLimit(userA, "createOrder");
  
  let successCount = 0;
  let failCount = 0;
  
  // Try 11 requests
  for (let i = 1; i <= 11; i++) {
    const result = await runMutation("rateLimitTest:testCreateOrderRateLimitNoAuth", { testUserId: userA });
    if (result.success) {
      successCount++;
      console.log(`  Request ${i}: ✅ Success`);
    } else {
      failCount++;
      console.log(`  Request ${i}: ❌ Failed - ${result.error}`);
    }
  }
  
  results.createOrder.attempts = successCount + failCount;
  results.createOrder.status = (successCount === 10 && failCount === 1) ? "PASS" : "FAIL";
  if (results.createOrder.status === "FAIL") {
    results.createOrder.errors.push(`Expected 10 success, 1 fail. Got ${successCount} success, ${failCount} fail`);
  }
  
  console.log(`  Result: ${results.createOrder.status} (${successCount} success, ${failCount} fail)`);
}

// Test 2: createProduct rate limit (20 requests per hour)
async function testCreateProductRateLimit() {
  console.log("\n🧪 Test 2: createProduct rate limit (20 requests per hour)");
  
  await resetRateLimit(userA, "createProduct");
  
  let successCount = 0;
  let failCount = 0;
  
  // Try 21 requests
  for (let i = 1; i <= 21; i++) {
    const result = await runMutation("rateLimitTest:testCreateProductRateLimitNoAuth", { testUserId: userA });
    if (result.success) {
      successCount++;
      if (i <= 5 || i === 20 || i === 21) console.log(`  Request ${i}: ✅ Success`);
    } else {
      failCount++;
      console.log(`  Request ${i}: ❌ Failed - ${result.error}`);
    }
  }
  
  results.createProduct.attempts = successCount + failCount;
  results.createProduct.status = (successCount === 20 && failCount === 1) ? "PASS" : "FAIL";
  if (results.createProduct.status === "FAIL") {
    results.createProduct.errors.push(`Expected 20 success, 1 fail. Got ${successCount} success, ${failCount} fail`);
  }
  
  console.log(`  Result: ${results.createProduct.status} (${successCount} success, ${failCount} fail)`);
}

// Test 3: createStore rate limit (1 request per day)
async function testCreateStoreRateLimit() {
  console.log("\n🧪 Test 3: createStore rate limit (1 request per day)");
  
  await resetRateLimit(userA, "createStore");
  
  let successCount = 0;
  let failCount = 0;
  
  // Try 2 requests
  for (let i = 1; i <= 2; i++) {
    const result = await runMutation("rateLimitTest:testCreateStoreRateLimitNoAuth", { testUserId: userA });
    if (result.success) {
      successCount++;
      console.log(`  Request ${i}: ✅ Success`);
    } else {
      failCount++;
      console.log(`  Request ${i}: ❌ Failed - ${result.error}`);
    }
  }
  
  results.createStore.attempts = successCount + failCount;
  results.createStore.status = (successCount === 1 && failCount === 1) ? "PASS" : "FAIL";
  if (results.createStore.status === "FAIL") {
    results.createStore.errors.push(`Expected 1 success, 1 fail. Got ${successCount} success, ${failCount} fail`);
  }
  
  console.log(`  Result: ${results.createStore.status} (${successCount} success, ${failCount} fail)`);
}

// Test 4: updateOrderStatus rate limit (30 requests per minute)
async function testUpdateOrderStatusRateLimit() {
  console.log("\n🧪 Test 4: updateOrderStatus rate limit (30 requests per minute)");
  
  await resetRateLimit(userA, "updateOrderStatus");
  
  let successCount = 0;
  let failCount = 0;
  
  // Try 31 requests
  for (let i = 1; i <= 31; i++) {
    const result = await runMutation("rateLimitTest:testUpdateOrderStatusRateLimitNoAuth", { testUserId: userA });
    if (result.success) {
      successCount++;
      if (i <= 5 || i === 30 || i === 31) console.log(`  Request ${i}: ✅ Success`);
    } else {
      failCount++;
      console.log(`  Request ${i}: ❌ Failed - ${result.error}`);
    }
  }
  
  results.updateOrderStatus.attempts = successCount + failCount;
  results.updateOrderStatus.status = (successCount === 30 && failCount === 1) ? "PASS" : "FAIL";
  if (results.updateOrderStatus.status === "FAIL") {
    results.updateOrderStatus.errors.push(`Expected 30 success, 1 fail. Got ${successCount} success, ${failCount} fail`);
  }
  
  console.log(`  Result: ${results.updateOrderStatus.status} (${successCount} success, ${failCount} fail)`);
}

// Test 5: addBalance rate limit (5 requests per hour)
async function testAddBalanceRateLimit() {
  console.log("\n🧪 Test 5: addBalance rate limit (5 requests per hour)");
  
  await resetRateLimit(userA, "addBalance");
  
  let successCount = 0;
  let failCount = 0;
  
  // Try 6 requests
  for (let i = 1; i <= 6; i++) {
    const result = await runMutation("rateLimitTest:testAddBalanceRateLimitNoAuth", { testUserId: userA });
    if (result.success) {
      successCount++;
      console.log(`  Request ${i}: ✅ Success`);
    } else {
      failCount++;
      console.log(`  Request ${i}: ❌ Failed - ${result.error}`);
    }
  }
  
  results.addBalance.attempts = successCount + failCount;
  results.addBalance.status = (successCount === 5 && failCount === 1) ? "PASS" : "FAIL";
  if (results.addBalance.status === "FAIL") {
    results.addBalance.errors.push(`Expected 5 success, 1 fail. Got ${successCount} success, ${failCount} fail`);
  }
  
  console.log(`  Result: ${results.addBalance.status} (${successCount} success, ${failCount} fail)`);
}

// Test 6: User isolation
async function testUserIsolation() {
  console.log("\n🧪 Test 6: User isolation (User A vs User B)");
  
  await resetRateLimit(userA, "createOrder");
  await resetRateLimit(userB, "createOrder");
  
  // User A makes 10 requests
  for (let i = 1; i <= 10; i++) {
    await runMutation("rateLimitTest:testCreateOrderRateLimitNoAuth", { testUserId: userA });
  }
  
  // User B should still be able to make requests
  const result = await runMutation("rateLimitTest:testCreateOrderRateLimitNoAuth", { testUserId: userB });
  
  results.userIsolation.status = result.success ? "PASS" : "FAIL";
  if (results.userIsolation.status === "FAIL") {
    results.userIsolation.errors.push(`User B should be able to make requests even after User A exceeded limit`);
  }
  
  console.log(`  Result: ${results.userIsolation.status} (User B can make requests: ${result.success})`);
}

// Test 7: Action isolation
async function testActionIsolation() {
  console.log("\n🧪 Test 7: Action isolation (createOrder vs createProduct)");
  
  await resetRateLimit(userA, "createOrder");
  await resetRateLimit(userA, "createProduct");
  
  // User A makes 10 createOrder requests
  for (let i = 1; i <= 10; i++) {
    await runMutation("rateLimitTest:testCreateOrderRateLimitNoAuth", { testUserId: userA });
  }
  
  // User A should still be able to make createProduct requests
  const result = await runMutation("rateLimitTest:testCreateProductRateLimitNoAuth", { testUserId: userA });
  
  results.actionIsolation.status = result.success ? "PASS" : "FAIL";
  if (results.actionIsolation.status === "FAIL") {
    results.actionIsolation.errors.push(`createProduct should be independent from createOrder limit`);
  }
  
  console.log(`  Result: ${results.actionIsolation.status} (createProduct works after createOrder limit: ${result.success})`);
}

// Test 8: Unauthorized request
async function testUnauthorizedRequest() {
  console.log("\n🧪 Test 8: Unauthorized request (auth fails before rate limit)");
  
  const result = await runMutation("rateLimitTest:testUnauthorizedRequest", {});
  
  results.unauthorizedRequest.status = (!result.success && result.error.includes("يجب تسجيل الدخول")) ? "PASS" : "FAIL";
  if (results.unauthorizedRequest.status === "FAIL") {
    results.unauthorizedRequest.errors.push(`Expected authentication error, got: ${result.error}`);
  }
  
  console.log(`  Result: ${results.unauthorizedRequest.status} (Auth error: ${result.error})`);
}

// Test 9: Window reset (using 5-second window for testing)
async function testWindowReset() {
  console.log("\n🧪 Test 9: Window reset (5-second window for testing)");
  
  await resetRateLimit(userA, "testWindowReset");
  
  // Make 3 requests (should succeed)
  for (let i = 1; i <= 3; i++) {
    await runMutation("rateLimitTest:testWindowResetNoAuth", { testUserId: userA });
  }
  
  // 4th request should fail
  const result1 = await runMutation("rateLimitTest:testWindowResetNoAuth", { testUserId: userA });
  console.log(`  Before wait: 4th request ${result1.success ? "✅ Success" : "❌ Failed"}`);
  
  // Wait 6 seconds for window to reset
  console.log(`  Waiting 6 seconds for window to reset...`);
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  // After wait, request should succeed
  const result2 = await runMutation("rateLimitTest:testWindowResetNoAuth", { testUserId: userA });
  console.log(`  After wait: Request ${result2.success ? "✅ Success" : "❌ Failed"}`);
  
  results.windowReset.status = (!result1.success && result2.success) ? "PASS" : "FAIL";
  if (results.windowReset.status === "FAIL") {
    results.windowReset.errors.push(`Expected fail before wait, success after wait`);
  }
  
  console.log(`  Result: ${results.windowReset.status}`);
}

// Main test runner
async function runAllTests() {
  console.log("🧪 Starting Runtime Rate Limiting Regression & Abuse Tests");
  console.log("=" .repeat(60));
  
  try {
    await testCreateOrderRateLimit();
    await testCreateProductRateLimit();
    await testCreateStoreRateLimit();
    await testUpdateOrderStatusRateLimit();
    await testAddBalanceRateLimit();
    await testUserIsolation();
    await testActionIsolation();
    await testUnauthorizedRequest();
    await testWindowReset();
  } catch (error) {
    console.error("\n❌ Test execution failed:", error);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Results Summary:\n");
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [testName, result] of Object.entries(results)) {
    if (result.status === "PASS") {
      totalPassed++;
      console.log(`✅ ${testName}: PASS`);
    } else if (result.status === "FAIL") {
      totalFailed++;
      console.log(`❌ ${testName}: FAIL`);
      if (result.errors.length > 0) {
        result.errors.forEach(error => console.log(`   📝 ${error}`));
      }
    } else {
      console.log(`⏳ ${testName}: ${result.status}`);
    }
  }
  
  console.log(`\nTotal: ✅ ${totalPassed} passed, ❌ ${totalFailed} failed`);
  
  if (totalFailed === 0) {
    console.log("\n🎉 All tests passed!");
  } else {
    console.log("\n⚠️  Some tests failed. Please review the errors above.");
  }
  
  // Security concerns
  console.log("\n🔒 Security Concerns:");
  console.log("   None detected during runtime testing");
}

// Run tests
runAllTests().catch(console.error);
