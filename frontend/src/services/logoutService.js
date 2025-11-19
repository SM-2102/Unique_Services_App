import API_ENDPOINTS from "../config/api";

/**
 * Logout user by calling backend. Relies on backend to clear HTTP-only cookie.
 * @returns {Promise<{ success: boolean, message?: string }>} Result of logout
 */
async function logout() {
  try {
    const response = await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include", // Important: send cookies
    });
    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.detail || "Logout failed" };
    }
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
}

export { logout };
