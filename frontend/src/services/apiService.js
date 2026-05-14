import axios from "axios";

// 🔹 Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 🔹 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized globally
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized - Token expired or invalid");

      // Optional: clear token & redirect
      localStorage.removeItem("token");

      // Example redirect (if using react-router)
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
