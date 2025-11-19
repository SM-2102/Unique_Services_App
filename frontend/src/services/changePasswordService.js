import API_ENDPOINTS from "../config/api.js";

/**
 * Change user password
 * @param {string} username
 * @param {string} old_password
 * @param {string} new_password
 * @returns {Promise<object>} Result of password change
 */
async function changePassword(username, old_password, new_password) {
  const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, old_password, new_password }),
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

export { changePassword };
