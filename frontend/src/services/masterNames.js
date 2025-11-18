// src/services/masterNames.js
import API_ENDPOINTS from "../config/api";

/**
 * Fetch all master customer names for autocomplete
 * @returns {Promise<string[]>} List of customer names
 */
export async function fetchMasterNames() {
  const res = await fetch(API_ENDPOINTS.MASTER_LIST_NAMES, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch master names");
  return res.json();
}
