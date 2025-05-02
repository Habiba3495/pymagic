
import axios from "axios";
import i18next from "../i18n";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // إضافة timeout
  withCredentials: true,
});

// تحسين اعتراضات الطلبات
apiClient.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = i18next.language || "en";
    
    // إضافة تحقق من الاتصال بالإنترنت
    if (!navigator.onLine) {
      throw new axios.Cancel('No internet connection');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// تحسين معالجة الأخطاء
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.warn('Request canceled:', error.message);
      return Promise.reject({ isCanceled: true });
    }

    // إدارة الأخطاء العامة
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response?.status === 401 && error.config.url !== '/api/users/Editprofile') {
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.dispatchEvent(new Event('unauthorized'));
    }

    return Promise.reject({ 
      ...error,
      message: errorMessage,
      status: error.response?.status 
    });
  }
);

export default apiClient
