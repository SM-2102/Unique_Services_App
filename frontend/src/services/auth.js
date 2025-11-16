/**
 * Create a new user (protected route)
 * @param {{username: string, password: string, role: string, phone_number: string}} userData
 * @returns {Promise<void>} Throws on error
 */
export async function createUser(userData) {
  const response = await fetch(API_ENDPOINTS.CREATE_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Return both message and resolution if available
    const error = new Error(data.message || data.detail || "Failed to create user");
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
}
import API_ENDPOINTS from "../config/api";

/**
 * Login user with credentials. Relies on backend to set HTTP-only cookie.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, message?: string }>} Result of login
 */
export async function login(username, password) {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: send/receive cookies
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json().catch(() => ({}));
      // Prefer message and resolution from backend, fallback to detail
      return {
        success: false,
        message: data.message || data.detail || "Login failed",
        resolution: data.resolution || ""
      };
    }
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
}
