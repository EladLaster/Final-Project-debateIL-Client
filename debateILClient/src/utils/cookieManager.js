/**
 * Cookie Management Utility
 * Handles secure cookie operations and validation
 */

class CookieManager {
  constructor() {
    this.cookieName = "auth_token";
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Set secure cookie
  setCookie(name, value, options = {}) {
    const {
      maxAge = this.maxAge,
      secure = true,
      sameSite = "strict",
      path = "/",
    } = options;

    const cookieString = [
      `${name}=${encodeURIComponent(value)}`,
      `max-age=${Math.floor(maxAge / 1000)}`,
      `path=${path}`,
      secure ? "secure" : "",
      `samesite=${sameSite}`,
    ]
      .filter(Boolean)
      .join("; ");

    document.cookie = cookieString;
  }

  // Get cookie value
  getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  // Delete cookie
  deleteCookie(name, path = "/") {
    document.cookie = `${name}=; max-age=0; path=${path}; secure; samesite=strict`;
  }

  // Check if cookie exists and is valid
  isCookieValid(name) {
    const cookie = this.getCookie(name);
    if (!cookie) return false;

    try {
      // In a real app, you'd validate the JWT token here
      // For now, we'll just check if it exists
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get all cookies
  getAllCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }

  // Clear all cookies
  clearAllCookies() {
    const cookies = this.getAllCookies();
    Object.keys(cookies).forEach((name) => {
      this.deleteCookie(name);
    });
  }

  // Set authentication cookie
  setAuthCookie(token) {
    this.setCookie(this.cookieName, token, {
      maxAge: this.maxAge,
      secure: true,
      sameSite: "strict",
    });
  }

  // Get authentication cookie
  getAuthCookie() {
    return this.getCookie(this.cookieName);
  }

  // Clear authentication cookie
  clearAuthCookie() {
    this.deleteCookie(this.cookieName);
  }

  // Check if user is authenticated via cookie
  isAuthenticated() {
    return this.isCookieValid(this.cookieName);
  }

  // Refresh authentication cookie
  refreshAuthCookie(token) {
    this.clearAuthCookie();
    this.setAuthCookie(token);
  }
}

// Create singleton instance
export const cookieManager = new CookieManager();
export default cookieManager;
