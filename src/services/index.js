import axios from "axios";
import i18next from "../i18n"; // This import is failing
const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to set Accept-Language dynamically
apiClient.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = i18next.language || "en"; // Default to "en" if undefined
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('user');
//       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//       window.location.href = '/Login';
//     }
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url !== '/api/users/Editprofile'
    ) {
      // Only redirect for other endpoints
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;