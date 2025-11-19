import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetchService";

/**
 * Search master by code
 * @param {string} code
 * @returns {Promise<object>} Master data
 */
export async function searchMasterByCode(code) {
  const response = await authFetch(API_ENDPOINTS.MASTER_SEARCH_CODE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(
      data.message || data.detail || "Failed to search master by code",
    );
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return response.json();
}
