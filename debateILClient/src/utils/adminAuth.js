// Admin Authentication Utilities
// ⚠️ TEMPORARY: All logged-in users can access admin features

// Check if user is admin (temporary implementation)
export function isAdmin(user) {
  return !!user; // Return true if user exists (is logged in)
}

// Admin route protection
export function requireAdmin(user) {
  if (!user) {
    throw new Error("Access denied: Please log in first");
  }
  return true;
}
