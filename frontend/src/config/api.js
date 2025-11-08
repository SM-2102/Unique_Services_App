// API Configuration
const BASE_API_URL = 'http://localhost:8000/';

const API_ENDPOINTS = {
  LOGIN: `${BASE_API_URL}auth/login`,
  LOGOUT: `${BASE_API_URL}auth/logout`,
  // NOTE: keep single slash concatenation to avoid accidental double-slashes
  METRICS: `${BASE_API_URL}menu/dashboard`,
};

export default API_ENDPOINTS;