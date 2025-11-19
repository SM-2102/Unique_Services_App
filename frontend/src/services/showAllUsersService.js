import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetchService";

/**
 * Fetch all users (for ShowUsers component)
 * @returns {Promise<Array>} List of users
 */
async function fetchAllUsers() {
  const response = await authFetch(API_ENDPOINTS.GET_ALL_USERS, {
    method: "GET",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(
      data.message || data.detail || "Failed to fetch users",
    );
    throw error;
  }
  return response.json();
}

export { fetchAllUsers };