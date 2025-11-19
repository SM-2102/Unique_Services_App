import API_ENDPOINTS from "../config/api";
import { authFetch } from "./authFetchService";

/**
 * Fetch all master customer names for autocomplete
 * @returns {Promise<string[]>} List of customer names
 */
export async function fetchMasterNames() {
  const res = await authFetch(API_ENDPOINTS.MASTER_LIST_NAMES, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch master names");
  return res.json();
}
