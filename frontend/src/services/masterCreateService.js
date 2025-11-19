import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetchService";

/**
 * Create a new master (protected route)
 * @param {object} masterData
 * @returns {Promise<void>} Throws on error
 */
export async function createMaster(masterData) {
  const response = await authFetch(API_ENDPOINTS.MASTER_CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(masterData),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(
      data.message || data.detail || "Failed to create master",
    );
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
}
