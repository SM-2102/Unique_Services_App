// src/services/showUsers.js
import API_ENDPOINTS from "../config/api";

/**
 * Fetch all users (for ShowUsers component)
 * @returns {Promise<Array>} List of users
 */
export async function fetchUsers(fetchUrl) {
  const res = await fetch(fetchUrl, { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.message || data.detail || "Failed to fetch users");
    throw error;
  }
  return res.json();
}
