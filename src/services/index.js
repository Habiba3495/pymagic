import axios from "axios";
import i18next from "../i18n";
import { setBackendError } from '../context/ErrorContextManager';

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
      throw new axios.Cancel('No internet connection');
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
      setBackendError(error.message, null);
      return Promise.reject({ isCanceled: true, message: error.message });
    }

    let errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;

    // معالجة أخطاء الشبكة
    if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
      errorMessage = 'No internet connection';
      setBackendError(errorMessage, null);
      return Promise.reject({ message: errorMessage, status: null });
    }

    // معالجة خطأ 401
    if (status === 401 && error.config.url !== '/api/users/Editprofile') {
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.dispatchEvent(new Event('unauthorized'));
    }

    // تحديث ErrorContext للأخطاء الأخرى
    if (status >= 500) {
      setBackendError(errorMessage, status);
    }

    return Promise.reject({ message: errorMessage, status });
  }
);

export default apiClient;