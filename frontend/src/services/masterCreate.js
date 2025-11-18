import API_ENDPOINTS from "../config/api";

/**
 * Create a new master (protected route)
 * @param {object} masterData
 * @returns {Promise<void>} Throws on error
 */
export async function createMaster(masterData) {
  const response = await fetch(API_ENDPOINTS.MASTER_CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(masterData),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || data.detail || "Failed to create master");
    if (data.resolution) error.resolution = data.resolution;
    throw error;
  }
}
