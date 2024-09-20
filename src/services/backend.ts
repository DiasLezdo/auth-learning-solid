export const API_BACKEND = import.meta.env.VITE_BACKEND_URL;

import axios from "axios";
import toast from "solid-toast";

// Create an Axios instance with custom config
const apiClient = axios.create({
  baseURL: API_BACKEND, // Backend server URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials (cookies) if needed
});

// -----------------------------Headers-----------------------------------------------

// // Request interceptor to include the access token in requests
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token refresh logic
// apiClient.interceptors.response.use(
//   (response) => {
//     const newToken = response.headers["authorization"];
//     if (newToken) {
//       const token = newToken.split(" ")[1];
//       localStorage.setItem("accessToken", token);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors, such as redirecting to login
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// ----------------------------- Cookie --------------------------------------

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("Error response data:", error.response); // Log the full error response
    } else {
      console.log("Error without response:", error); // Log if no response (network error, etc.)
    }

    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, such as redirecting to login
      toast.error(error.response.data?.message || "Unauthorized");
      window.location.href = "/";
      localStorage.removeItem("user");
    } else if (error.response && error.response.status === 500) {
      // Handle server errors
      toast.error(error.response.data?.message || "Server Error");
    } else if (error.response && error.response.status === 400) {
      // Handle bad request errors
      toast.error(error.response.data?.message || "Bad Request");
    } else if (error.response && error.response.status === 404) {
      // Handle bad request errors
      toast.error(error.response.data?.message || "Not Found");
    } else {
      // Handle other status codes
      toast.error("An unknown error occurred");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
