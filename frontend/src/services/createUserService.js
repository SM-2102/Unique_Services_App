import API_ENDPOINTS from "../config/api";

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
    const error = new Error(
      data.message || data.detail || "Failed to create user",
    );
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
}

