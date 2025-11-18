// src/services/user.js
import API_ENDPOINTS from "../config/api";

/**
 * Change user password
 * @param {string} username
 * @param {string} old_password
 * @param {string} new_password
 * @returns {Promise<object>} Result of password change
 */
export async function changePassword(username, old_password, new_password) {
  const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, old_password, new_password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || data.detail || "Failed to change password.");
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return data;
}

/**
 * Delete a user by username
 * @param {string} username
 * @returns {Promise<object>} Result of deletion
 */
export async function deleteUser(username) {
  const res = await fetch(`${API_ENDPOINTS.DELETE_USER}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || data.detail || "Failed to delete user.");
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return data;
}

/**
 * Fetch all users (excluding current user should be handled in UI)
 * @returns {Promise<Array>} List of users
 */
export async function fetchAllUsers() {
  const res = await fetch(API_ENDPOINTS.GET_ALL_USERS, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
