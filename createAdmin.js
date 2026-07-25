const { ConvexHttpClient } = require("convex/browser");
const fetch = require("node-fetch");

const client = new ConvexHttpClient(process.env.CONVEX_DEPLOYMENT || "http://127.0.0.1:8000");

async function createAdmin() {
  try {
    const result = await client.mutation("seedAdmin.seedAdmin", {
      email: "admin@aqraply.com",
      password: "SecurePassword123!",
      fullName: "Admin User"
    });
    console.log("Admin created successfully:", result);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin();
