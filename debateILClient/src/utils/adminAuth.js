// Admin Authentication Utilities

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
  if (!user) return false;

  // Check by user ID
  if (isAdminByUserId(user.id)) return true;

  // Check by specific email
  if (isAdminBySpecificEmail(user.email)) return true;

  // Check by email domain
  if (isAdminByEmail(user.email)) return true;

  // Check by username (if you want to add admin usernames)
  if (user.username && user.username.startsWith("admin_")) return true;

  return false;
}

// Get admin level (for future role-based permissions)
export function getAdminLevel(user) {
  if (!isAdmin(user)) return "none";

  // Super admin (can do everything)
  if (user.id === "11111111-1111-1111-1111-111111111111") return "super";

  // Lior is also super admin
  if (user.email === "liorkk7@gmail.com") return "super";

  // Regular admin
  return "admin";
}

// Check specific permissions
export function hasAdminPermission(user, permission) {
  const level = getAdminLevel(user);

  switch (permission) {
    case "view_users":
    case "edit_users":
    case "delete_users":
      return level === "admin" || level === "super";

    case "view_debates":
    case "edit_debates":
    case "delete_debates":
      return level === "admin" || level === "super";

    case "view_analytics":
      return level === "admin" || level === "super";

    case "system_settings":
    case "manage_admins":
      return level === "super";

    default:
      return false;
  }
}

// Admin route protection
export function requireAdmin(user, redirectTo = "/") {
  if (!isAdmin(user)) {
    // In a real app, you'd redirect here
    throw new Error("Access denied: Admin privileges required");
  }
  return true;
}
