import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studyvault_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages and handle expired/invalid tokens globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    if (error.response?.status === 401) {
      localStorage.removeItem("studyvault_token");
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
