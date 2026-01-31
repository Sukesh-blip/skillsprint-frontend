import axios from "axios";
import toast from "react-hot-toast";

// 🔐 Hard fallback to avoid Azure build/env issues
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://skillsprint-backend-app.azurewebsites.net";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Auth expired / invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    else if (status === 403) {
      toast.error("You are not authorized to perform this action");
    }
    else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    else if (!status) {
      toast.error("Network error. Backend not reachable.");
    }

    return Promise.reject(error);
  }
);

export default api;
