import axios from "axios";

const orderApi = axios.create({
  baseURL: "http://order.localhost/api",
});

orderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // ✅ changed from "access"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default orderApi;