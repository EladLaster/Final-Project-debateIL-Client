// Admin Authentication Utilities
// ⚠️ TEMPORARY: All logged-in users can access admin features

// Check if user is admin (temporary implementation)
export function isAdmin(user) {
  return !!user; // Return true if user exists (is logged in)
}

// Get admin level (for future role-based permissions)
export function getAdminLevel(user) {
  if (!isAdmin(user)) return "none";

  // TEMPORARY: All logged-in users are super admins
  // TODO: Implement proper admin levels later
  return "super";
}

// Check specific permissions
export function hasAdminPermission(user, permission) {
  // TEMPORARY: All logged-in users have all permissions
  // TODO: Implement proper permission system later
  return !!user; // Return true if user exists (is logged in)
}

// Admin route protection
export function requireAdmin(user) {
  if (!user) {
    throw new Error("Access denied: Please log in first");
  }
  return true;
}
