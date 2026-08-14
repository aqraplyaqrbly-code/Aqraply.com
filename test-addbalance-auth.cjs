// addBalance Authorization Test
const { ConvexHttpClient } = require("convex/browser");

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://quick-cormorant-163.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Test users from the database
const testUsers = {
  customer: "n577qppwxznbxhdxeqbeyf6a71874ytm", // حسن علي
  merchant: "n5794ege03gzkmj4qf857efzkx87besp", // amalbadry@gmail.com
  captain: "n57fnj6jry94dmzy8ggvxx07ps88zbnh", // newcaptain@aqraply.test
  admin: "n573cgcag9rc110697e2na7mxn87fmw1", // مدير النظام
  owner: "n578nkhx44fgdpav2687h7nmsn87r2ps", // Aqraply
};

// Test results
const results = {
  customer: { status: "PENDING", expected: "REJECT", actual: null },
  merchant: { status: "PENDING", expected: "REJECT", actual: null },
  captain: { status: "PENDING", expected: "REJECT", actual: null },
  admin: { status: "PENDING", expected: "ALLOW", actual: null },
  owner: { status: "PENDING", expected: "ALLOW", actual: null },
  quotaTest: { status: "PENDING", expected: "NO_CONSUMPTION", actual: null },
};

async function testAuthorization(role, userId) {
  try {
    const result = await client.mutation("rateLimitTest:testAddBalanceAuthorization", { testUserId: userId });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testQuotaConsumption() {
  try {
    const result = await client.mutation("rateLimitTest:testUnauthorizedAddBalanceQuota", { testUserId: testUsers.customer });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🧪 addBalance Authorization Test");
  console.log("=" .repeat(60));

  // Test customer
  console.log("\n📋 Testing customer role (should be REJECTED):");
  const customerResult = await testAuthorization("customer", testUsers.customer);
  results.customer.actual = customerResult.success ? customerResult.result.authorized : "ERROR";
  results.customer.status = (results.customer.actual === false) ? "PASS" : "FAIL";
  console.log(`  Role: ${customerResult.success ? customerResult.result.role : 'ERROR'}`);
  console.log(`  Authorized: ${results.customer.actual}`);
  console.log(`  Expected: ${results.customer.expected}`);
  console.log(`  Result: ${results.customer.status}`);

  // Test merchant
  console.log("\n📋 Testing merchant role (should be REJECTED):");
  const merchantResult = await testAuthorization("merchant", testUsers.merchant);
  results.merchant.actual = merchantResult.success ? merchantResult.result.authorized : "ERROR";
  results.merchant.status = (results.merchant.actual === false) ? "PASS" : "FAIL";
  console.log(`  Role: ${merchantResult.success ? merchantResult.result.role : 'ERROR'}`);
  console.log(`  Authorized: ${results.merchant.actual}`);
  console.log(`  Expected: ${results.merchant.expected}`);
  console.log(`  Result: ${results.merchant.status}`);

  // Test captain
  console.log("\n📋 Testing captain role (should be REJECTED):");
  const captainResult = await testAuthorization("captain", testUsers.captain);
  results.captain.actual = captainResult.success ? captainResult.result.authorized : "ERROR";
  results.captain.status = (results.captain.actual === false) ? "PASS" : "FAIL";
  console.log(`  Role: ${captainResult.success ? captainResult.result.role : 'ERROR'}`);
  console.log(`  Authorized: ${results.captain.actual}`);
  console.log(`  Expected: ${results.captain.expected}`);
  console.log(`  Result: ${results.captain.status}`);

  // Test admin
  console.log("\n📋 Testing admin role (should be ALLOWED):");
  const adminResult = await testAuthorization("admin", testUsers.admin);
  results.admin.actual = adminResult.success ? adminResult.result.authorized : "ERROR";
  results.admin.status = (results.admin.actual === true) ? "PASS" : "FAIL";
  console.log(`  Role: ${adminResult.success ? adminResult.result.role : 'ERROR'}`);
  console.log(`  Authorized: ${results.admin.actual}`);
  console.log(`  Expected: ${results.admin.expected}`);
  console.log(`  Result: ${results.admin.status}`);

  // Test owner
  console.log("\n📋 Testing owner role (should be ALLOWED):");
  const ownerResult = await testAuthorization("owner", testUsers.owner);
  results.owner.actual = ownerResult.success ? ownerResult.result.authorized : "ERROR";
  results.owner.status = (results.owner.actual === true) ? "PASS" : "FAIL";
  console.log(`  Role: ${ownerResult.success ? ownerResult.result.role : 'ERROR'}`);
  console.log(`  Authorized: ${results.owner.actual}`);
  console.log(`  Expected: ${results.owner.expected}`);
  console.log(`  Result: ${results.owner.status}`);

  // Test quota consumption
  console.log("\n📋 Testing unauthorized request quota consumption (should NOT consume):");
  const quotaResult = await testQuotaConsumption();
  results.quotaTest.actual = quotaResult.success ? quotaResult.result.quotaConsumed : "ERROR";
  results.quotaTest.status = (results.quotaTest.actual === false) ? "PASS" : "FAIL";
  console.log(`  Quota Consumed: ${results.quotaTest.actual}`);
  console.log(`  Expected: ${results.quotaTest.expected}`);
  console.log(`  Message: ${quotaResult.success ? quotaResult.result.message : quotaResult.error}`);
  console.log(`  Result: ${results.quotaTest.status}`);

  // Summary
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
      console.log(`   Expected: ${result.expected}, Actual: ${result.actual}`);
    } else {
      console.log(`⏳ ${testName}: ${result.status}`);
    }
  }

  console.log(`\nTotal: ✅ ${totalPassed} passed, ❌ ${totalFailed} failed`);

  if (totalFailed === 0) {
    console.log("\n🎉 All authorization tests passed!");
  } else {
    console.log("\n⚠️  Some tests failed.");
  }
}

runTests().catch(console.error);
