import API_ENDPOINTS from "../config/api";

export async function getNextMasterCode() {
  const response = await fetch(API_ENDPOINTS.MASTER_NEXT_CODE, {
    method: "GET",
    credentials: "include"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch next code");
  }
  const data = await response.json();
  return data.next_code || "";
}
