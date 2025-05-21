// import axios from "axios";
// import i18next from "../i18n";

// const apiClient = axios.create({
//   baseURL: "http://localhost:5000",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
//   withCredentials: true,
// });

// // اعتراضات الطلبات
// apiClient.interceptors.request.use(
//   (config) => {
//     config.headers["Accept-Language"] = i18next.language || "en";
    
//     if (!navigator.onLine) {
//       throw new axios.Cancel('Network unavailable');
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // اعتراضات الردود
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isCancel(error)) {
//       console.warn('Request canceled:', error.message);
//       return Promise.reject({ isCanceled: true, message: error.message });
//     }

//     let errorMessage = error.response?.data?.error || error.message;
//     const status = error.response?.status;

//     // معالجة أخطاء الشبكة
//     if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
//       return Promise.reject({ message: 'Network unavailable', status: null });
//     }

//     // معالجة خطأ 401
//     if (status === 401 && error.config.url !== '/api/users/Editprofile') {
//       localStorage.removeItem('user');
//       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//       window.dispatchEvent(new Event('unauthorized'));
//     }

//     return Promise.reject({ message: errorMessage, status });
//   }
// );

// export default apiClient;


// last version 

// import axios from "axios";
// import i18next from "../i18n";

// // تحديد الـ baseURL بناءً على البيئة
// // const baseURL = "http://localhost:5000";
// const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const apiClient = axios.create({
//   baseURL: baseURL,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
//   withCredentials: true,
// });

// // اعتراضات الطلبات
// apiClient.interceptors.request.use(
//   (config) => {
//     config.headers["Accept-Language"] = i18next.language || "en";
    
//     if (!navigator.onLine) {
//       throw new axios.Cancel('Network unavailable');
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // apiClient.interceptors.request.use(
// //   (config) => {
// //     config.headers["Accept-Language"] = i18next.language || "en";
// //     const token = localStorage.getItem('token'); // جلب التوكن من localStorage
// //     if (token) {
// //       config.headers["Authorization"] = `Bearer ${token}`; // أضف التوكن في الهيدر
// //     }
// //     if (!navigator.onLine) {
// //       throw new axios.Cancel('Network unavailable');
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // اعتراضات الردود
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isCancel(error)) {
//       console.warn('Request canceled:', error.message);
//       return Promise.reject({ isCanceled: true, message: error.message });
//     }

//     let errorMessage = error.response?.data?.error || error.message;
//     const status = error.response?.status;

//     // معالجة أخطاء الشبكة
//     if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
//       return Promise.reject({ message: 'Network unavailable', status: null });
//     }

//     // معالجة خطأ 401
//     if (status === 401 && error.config.url !== '/api/users/Editprofile') {
//       localStorage.removeItem('user');
//       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//       window.dispatchEvent(new Event('unauthorized'));
//     }

//     return Promise.reject({ message: errorMessage, status });
//   }
// );

// export default apiClient;




// last version

// import axios from "axios";
// import i18next from "../i18n";

//   // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",

// const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
//   withCredentials: true, // الكوكيز هتتبعت تلقائيًا
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     config.headers["Accept-Language"] = i18next.language || "en";
//     if (!navigator.onLine) {
//       throw new axios.Cancel('Network unavailable');
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isCancel(error)) {
//       console.warn('Request canceled:', error.message);
//       return Promise.reject({ isCanceled: true, message: error.message });
//     }

//     let errorMessage = error.response?.data?.error || error.message;
//     const status = error.response?.status;

//     if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
//       return Promise.reject({ message: 'Network unavailable', status: null });
//     }

//     if (status === 401 && error.config.url !== '/api/users/Editprofile') {
//       localStorage.removeItem('user');
//       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//       window.dispatchEvent(new Event('unauthorized'));
//     }

//     return Promise.reject({ message: errorMessage, status });
//   }
// );

// export default apiClient;




import axios from "axios";
import i18next from "../i18n";

const apiClient = axios.create({
  baseURL: "https://pymagicnodejs-production-dc27.up.railway.app",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('Sending request:', config.url, 'Cookies:', document.cookie);
    config.headers["Accept-Language"] = i18next.language || "en";
    if (!navigator.onLine) {
      throw new axios.Cancel('Network unavailable');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (axios.isCancel(error)) {
      console.warn('Request canceled:', error.message);
      return Promise.reject({ isCanceled: true, message: error.message });
    }

    let errorMessage = error.response?.data?.error || error.message;
    const status = error.response?.status;

    if (error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject({ message: 'Network unavailable', status: null });
    }

    if (status === 401 && error.config.url !== '/api/users/Editprofile') {
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None;';
      window.dispatchEvent(new Event('unauthorized'));
    }

    return Promise.reject({ message: errorMessage, status });
  }
);

export default apiClient;