import axios from "axios";

const NOTIFICATION_API = axios.create({
  baseURL: "http://notification.localhost/api",
});

// Auto-attach token (same as other APIs)
NOTIFICATION_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default NOTIFICATION_API;