import axios from "axios";

// Define the base URL for your API
const API_BASE_URL = "https://alumni.cpe.kmutt.ac.th/api/v1/";

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set the Authorization header with the JWT if available
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers["Authorization"] = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the configured axios instance for use in other parts of your app
export default api;
