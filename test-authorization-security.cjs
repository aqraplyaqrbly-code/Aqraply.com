// Test Authorization Security
const { ConvexHttpClient } = require("convex/browser");

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://quick-cormorant-163.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

console.log("=== Authorization Security Tests ===\n");

async function testGetStoresByOwnerUnauthorized() {
  console.log("Test 1: getStoresByOwner - Unauthorized Access");
  try {
    // Try to get stores by owner ID without authentication
    const result = await client.query("stores:getStoresByOwner", {
      ownerId: "test_owner_id"
    });
    console.log("❌ VULNERABLE: Query succeeded without authentication");
    console.log("Result:", result);
    return false;
  } catch (error) {
    console.log("✅ SECURE: Query requires authentication or failed");
    console.log("Error:", error.message);
    return true;
  }
}

async function testAdminFunctionsUnauthorized() {
  console.log("\nTest 2: Admin functions - Unauthorized Access");
  const adminFunctions = [
    "admin:getPlatformStats",
    "admin:getAllUsers",
    "admin:getAllStores",
    "admin:getAllProducts"
  ];

  let secureCount = 0;
  for (const func of adminFunctions) {
    try {
      await client.query(func, {});
      console.log(`❌ ${func}: Access granted without authentication`);
    } catch (error) {
      console.log(`✅ ${func}: Access denied`);
      secureCount++;
    }
  }
  return secureCount === adminFunctions.length;
}

async function testPermissionEscalation() {
  console.log("\nTest 3: Permission Escalation Attempts");
  try {
    // Try to call admin functions as regular user
    const result = await client.mutation("adminPermissions:upsertAdminPermissions", {
      userId: "test_user_id",
      manage_users: true,
      manage_orders: true
    });
    console.log("❌ VULNERABLE: Permission escalation possible");
    return false;
  } catch (error) {
    console.log("✅ SECURE: Permission escalation blocked");
    return true;
  }
}

async function testOwnerPrivilegeEscalation() {
  console.log("\nTest 4: Owner Privilege Escalation");
  try {
    const result = await client.mutation("profiles:setOwnerByEmail", {
      email: "test@example.com"
    });
    console.log("❌ VULNERABLE: Owner assignment without authorization");
    return false;
  } catch (error) {
    console.log("✅ SECURE: Owner assignment blocked");
    return true;
  }
}

async function runAllTests() {
  const results = {
    getStoresByOwner: await testGetStoresByOwnerUnauthorized(),
    adminFunctions: await testAdminFunctionsUnauthorized(),
    permissionEscalation: await testPermissionEscalation(),
    ownerEscalation: await testOwnerPrivilegeEscalation()
  };

  console.log("\n=== Test Results ===");
  console.log("getStoresByOwner:", results.getStoresByOwner ? "✅ SECURE" : "❌ VULNERABLE");
  console.log("Admin Functions:", results.adminFunctions ? "✅ SECURE" : "❌ VULNERABLE");
  console.log("Permission Escalation:", results.permissionEscalation ? "✅ SECURE" : "❌ VULNERABLE");
  console.log("Owner Escalation:", results.ownerEscalation ? "✅ SECURE" : "❌ VULNERABLE");

  const allSecure = Object.values(results).every(r => r === true);
  console.log("\nOverall:", allSecure ? "✅ ALL TESTS PASSED" : "❌ VULNERABILITIES FOUND");

  process.exit(allSecure ? 0 : 1);
}

runAllTests().catch(console.error);
