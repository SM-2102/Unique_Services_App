import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetchService";

/**
 * Search master by name
 * @param {string} name
 * @returns {Promise<object>} Master data
 */
export async function searchMasterByName(name) {
  const response = await authFetch(API_ENDPOINTS.MASTER_SEARCH_NAME, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(
      data.message || data.detail || "Failed to search master by name",
    );
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return response.json();
}
