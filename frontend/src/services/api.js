import axios from "axios";

const API = axios.create({
  baseURL: "http://auth.localhost", // ✅ IMPORTANT FIX
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;