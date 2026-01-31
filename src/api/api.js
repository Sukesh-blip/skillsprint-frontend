import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("You are not authorized");
    } else if (status >= 500) {
      toast.error("A server error occurred. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
