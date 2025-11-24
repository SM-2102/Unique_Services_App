// API Configuration
const BASE_API_URL = "http://localhost:8000/";

const API_ENDPOINTS = {
  LOGIN: `${BASE_API_URL}auth/login`,
  LOGOUT: `${BASE_API_URL}auth/logout`,
  REFRESH_TOKEN: `${BASE_API_URL}auth/refresh_token`,
  AUTH_ME: `${BASE_API_URL}auth/me`,

  MENU_DASHBOARD: `${BASE_API_URL}menu/dashboard`,

  CREATE_USER: `${BASE_API_URL}user/create_user`,
  DELETE_USER: `${BASE_API_URL}user/delete_user`,
  CHANGE_PASSWORD: `${BASE_API_URL}user/reset_password`,
  GET_ALL_USERS: `${BASE_API_URL}user/users`,
  GET_STANDARD_USERS: `${BASE_API_URL}user/standard_users`,

  MASTER_CREATE: `${BASE_API_URL}master/create`,
  MASTER_NEXT_CODE: `${BASE_API_URL}master/next_code`,
  MASTER_LIST_NAMES: `${BASE_API_URL}master/list_names`,
  MASTER_UPDATE: `${BASE_API_URL}master/update/`, //append code
  MASTER_SEARCH_CODE: `${BASE_API_URL}master/by_code`,
  MASTER_SEARCH_NAME: `${BASE_API_URL}master/by_name`,
  MASTER_SEARCH_ADDRESS: `${BASE_API_URL}master/fetch_address`,

  CHALLAN_CREATE: `${BASE_API_URL}challan/create`,
  CHALLAN_NEXT_NUMBER: `${BASE_API_URL}challan/next_code_with_challan_date`,
  CHALLAN_LAST_NUMBER: `${BASE_API_URL}challan/last_challan_number`,
  CHALLAN_PRINT: `${BASE_API_URL}challan/print`,

  MARKET_NEXT_NUMBER: `${BASE_API_URL}market/next_mcode`,
  MARKET_CREATE: `${BASE_API_URL}market/create`,
  MARKET_UPDATE: `${BASE_API_URL}market/update/`, //append mcode
  MARKET_ENQUIRY: `${BASE_API_URL}market/enquiry/`, //append final_status, division, name
  MARKET_PENDING: `${BASE_API_URL}market/list_pending`,
  MARKET_SEARCH_CODE: `${BASE_API_URL}market/by_mcode`,
};

export default API_ENDPOINTS;
