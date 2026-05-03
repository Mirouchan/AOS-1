import axios from "axios";

const PRODUCT_API = axios.create({
  baseURL: "http://product.localhost/api",
});

// Auto-attach token
PRODUCT_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // ✅ changed from "access" to "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default PRODUCT_API;