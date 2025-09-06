// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "https://twp-server.onrender.com", // default base URL
baseURL: "https://twp-server.onrender.com",
  timeout: 15000, // optional
  headers: {
    "Content-Type": "application/json",
  },
});

// // ✅ Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // example for auth
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // example: logout if unauthorized
//       console.error("Unauthorized! Redirecting to login...");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
