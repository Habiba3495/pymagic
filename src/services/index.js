import axios from "axios";
import i18next from "../i18n";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// اعتراضات الطلبات
apiClient.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = i18next.language || "en";
    
    if (!navigator.onLine) {
      throw new axios.Cancel('Network unavailable');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// اعتراضات الردود
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.warn('Request canceled:', error.message);
      return Promise.reject({ isCanceled: true, message: error.message });
    }

    let errorMessage = error.response?.data?.error || error.message;
    const status = error.response?.status;

    // معالجة أخطاء الشبكة
    if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject({ message: 'Network unavailable', status: null });
    }

    // معالجة خطأ 401
    if (status === 401 && error.config.url !== '/api/users/Editprofile') {
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.dispatchEvent(new Event('unauthorized'));
    }

    return Promise.reject({ message: errorMessage, status });
  }
);

export default apiClient;