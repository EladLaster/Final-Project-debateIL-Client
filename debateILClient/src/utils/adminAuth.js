// Admin Authentication Utilities
//
// ⚠️  TEMPORARY SETUP: All logged-in users can access admin features
// TODO: Implement proper admin authentication system later

// List of admin user IDs (in production, this should come from the database)
const ADMIN_USER_IDS = [
  "11111111-1111-1111-1111-111111111111", // Alex Cohen - Admin
  "22222222-2222-2222-2222-222222222222", // Sarah Levi - Admin
  // Add more admin IDs as needed
];

// Admin email domains (alternative approach)
const ADMIN_EMAIL_DOMAINS = ["@admin.debateil.com", "@debateil.com"];

// Specific admin emails
const ADMIN_EMAILS = ["liorkk7@gmail.com"];

// Check if user is admin by ID
export function isAdminByUserId(userId) {
  return ADMIN_USER_IDS.includes(userId);
}

// Check if user is admin by email domain
export function isAdminByEmail(email) {
  if (!email) return false;
  return ADMIN_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));
}

// Check if user is admin by specific email
export function isAdminBySpecificEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Check if user is admin (combines all methods)
export function isAdmin(user) {
  // TEMPORARY: Allow all logged-in users to see admin features
  // TODO: Implement proper admin authentication later
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
export function requireAdmin(user, redirectTo = "/") {
  // TEMPORARY: Allow all logged-in users to access admin routes
  // TODO: Implement proper admin route protection later
  if (!user) {
    throw new Error("Access denied: Please log in first");
  }
  return true;
}
