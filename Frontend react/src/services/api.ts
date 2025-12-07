import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minutes timeout for OTP and email operations
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL || ""}${config.url || ""}`,
      data: config.data,
      params: config.params,
    });

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log the response for debugging
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error("API Error:", {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      // Redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - Backend server might be down");
    } else if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error - Check if backend server is running on",
        api.defaults.baseURL
      );
    }

    return Promise.reject(error);
  }
);

export default api;
