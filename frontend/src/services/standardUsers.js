// src/services/standardUsers.js
import API_ENDPOINTS from "../config/api";

/**
 * Fetch standard users (for ShowStandardUsersPage)
 * @returns {Promise<Array>} List of standard users
 */
export async function fetchStandardUsers() {
  const res = await fetch(API_ENDPOINTS.GET_STANDARD_USERS, { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.message || data.detail || "Failed to fetch standard users");
    throw error;
  }
  return res.json();
}
