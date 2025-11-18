import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetch";

/**
 * Update a master record (PATCH)
 * @param {string} code - Master code (max 5 chars, e.g., C1234)
 * @param {object} masterData - Data to update (address, city, pin, contact1, contact2, gst, remark)
 * @returns {Promise<object>} Response data
 */
export async function updateMaster(code, masterData) {
  if (!code || code.length > 5) throw new Error("Invalid master code");
  const url = `${API_ENDPOINTS.MASTER_UPDATE}${code}`;
  console.log("Updating master ", masterData);
  const response = await authFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials : "include",
    body: JSON.stringify(masterData),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || data.detail || "Failed to update master");
    error.data = data; // Attach all error data for toast
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
  return response.json();
}
