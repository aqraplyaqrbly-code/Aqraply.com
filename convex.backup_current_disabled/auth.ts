// Custom Auth Implementation
// Using custom authentication instead of Convex Auth Provider

import { query } from "./_generated/server";

// Public query to check if user is logged in
// This requires the session token to be passed as an argument
export const loggedInUser = query({
  args: {},
  handler: async (ctx) => {
    // Since we can't access localStorage from server, 
    // return null - AuthContext will handle session from client
    return null;
  },
});

// Re-export custom auth functions for use throughout the app
export { signUp, signIn, signOut, getCurrentUser, changePassword, requestPasswordReset, resetPassword } from "./customAuth";