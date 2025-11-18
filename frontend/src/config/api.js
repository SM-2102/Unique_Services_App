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
  MASTER_SEARCH_CODE: `${BASE_API_URL}master/code` ,
  MASTER_SEARCH_NAME: `${BASE_API_URL}master/name`,
  
};

export default API_ENDPOINTS;
