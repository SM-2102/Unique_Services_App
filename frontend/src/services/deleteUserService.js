import API_ENDPOINTS from "../config/api";

/**
 * Delete a user by username
 * @param {string} username
 * @returns {Promise<object>} Result of deletion
 */
async function deleteUser(username) {
  const response = await fetch(`${API_ENDPOINTS.DELETE_USER}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.message || data.detail || "Failed to delete user.",
    );
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return data;
}

export { deleteUser };