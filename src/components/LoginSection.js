// import React, { useState } from "react";
// import "./LoginSection.css";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';
// import logo from "../components/images/logo.svg";

// const LoginSection = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [errors, setErrors] = useState([]);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotMessage, setForgotMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors([]);
//     const tempErrors = [];

//     if (!formData.email.includes("@")) {
//       tempErrors.push(t("invalidEmail"));
//     }
//     if (formData.password.length < 6) {
//       tempErrors.push(t("shortPassword"));
//     }

//     if (tempErrors.length > 0) {
//       setErrors(tempErrors);
//       return;
//     }

//     try {
//       const response = await apiClient.post('/api/users/login', formData).catch((error) => {
//         throw error;
//       });

//       if (response.status !== 200 || !response.data?.token) {
//         throw new Error(response.data?.error || t("login.loginError"));
//       }

//       const { token, user } = response.data;
//       login(user, token);
//       navigate("/lessons", { replace: true });
//     } catch (err) {
//       const newErrors = [];
//       newErrors.push(err.message);
//       setErrors(newErrors);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleForgotPasswordSubmit = async (e) => {
//     e.preventDefault();
//     setErrors([]);
//     setForgotMessage("");

//     try {
//       const response = await apiClient.post('/api/users/forgot-password', { email: forgotEmail });

//       if (response.status !== 200 || response.data?.error) {
//         throw new Error(response.data?.error || t("forgotPassword.error"));
//       }

//       setForgotMessage(t("forgotPassword.success"));
//     } catch (err) {
//       const newErrors = [];
//       if (err.message) {
//         newErrors.push(err.message);
//       } else if (err.request) {
//         newErrors.push(t("forgotPassword.networkError"));
//       } else {
//         newErrors.push(t("forgotPassword.unexpectedError"));
//       }
//       setErrors(newErrors);
//     }
//   };

//   // دالة جديدة لإخفاء الـ error عند النقر على الـ overlay
//   const handleOverlayClick = () => {
//     setErrors([]); // إفراغ قائمة الأخطاء
//   };

//   return (
//     <>    
//       <header className="Lheader">
//         <img src={logo} alt="PyMagic Logo" className="logo" />
//       </header>
//       <section className="Login-section">
//         <div className="Lform-container">
//           {!forgotPasswordMode ? (
//             <>
//               <form onSubmit={handleSubmit} className="Lform">
//                 <label>{t("login.emailLabel")}</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder={t("login.emailLabel")}
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className={errors.some(e => e.toLowerCase().includes("email")) ? "error" : ""}
//                 />

//                 <label>{t("login.LpasswordLabel")}</label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder={t("login.LpasswordLabel")}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                   className={errors.some(e => e.toLowerCase().includes("password")) ? "error" : ""}
//                 />
//                 <div className="forget_rememberMe">
//                   <span>
//                     <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(true)}>
//                       {t("forgotPassword.link")}
//                     </a>
//                   </span>
//                   <span className="remember-me">
//                     <input
//                       type="checkbox"
//                       name="rememberMe"
//                       checked={formData.rememberMe}
//                       onChange={handleInputChange}
//                     />
//                     <label>{t("login.rememberMe")}</label>
//                   </span>
//                 </div>
//                 <button className="Lbutton" type="submit">
//                   {t("login.loginButton")}
//                 </button>
//               </form>
//             </>
//           ) : (
//             <form onSubmit={handleForgotPasswordSubmit} className="Lform">
//               <label>{t("forgotPassword.emailLabel")}</label>
//               <input
//                 type="email"
//                 value={forgotEmail}
//                 onChange={(e) => setForgotEmail(e.target.value)}
//                 placeholder={t("forgotPassword.emailLabel")}
//                 required
//               />

//               <button className="Lbutton" type="submit">
//                 {t("forgotPassword.submitButton")}
//               </button>

//               {forgotMessage && (
//                 <div className="RRsuccess-message">
//                   {forgotMessage}
//                 </div>
//               )}

//               <div className="back-to-login">
//                 <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(false)}>
//                   {t("forgotPassword.backToLogin")}
//                 </a>
//               </div>
//             </form>
//           )}

//           {errors.length > 0 && (
//             <div className="error-overlay" onClick={handleOverlayClick}>
//               <div className="error-box">
//                 {errors.map((error, index) => (
//                   <div key={index} className="error-message">{error}</div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default LoginSection;


//last work version 
// import React, { useState } from "react";
// import "./LoginSection.css";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';
// import logo from "../components/images/logo.svg";

// const LoginSection = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [errors, setErrors] = useState([]);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotMessage, setForgotMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors([]);
//     const tempErrors = [];

//     if (!formData.email.includes("@")) {
//       tempErrors.push(t("invalidEmail"));
//     }
//     if (formData.password.length < 6) {
//       tempErrors.push(t("shortPassword"));
//     }

//     if (tempErrors.length > 0) {
//       setErrors(tempErrors);
//       return;
//     }

//     try {
//       console.log('Sending login request:', formData);
//       const response = await apiClient.post('/api/users/login', formData);
//       console.log('Login response:', response.data);
//       if (response.status !== 200 || !response.data?.token) {
//         throw new Error(response.data?.error || t("login.loginError"));
//       }

//       const { token, user } = response.data;
//       login(user, token);
//       console.log('Login successful, token stored:', token);
//       console.log('Current cookies:', document.cookie); // سجل لتأكيد تخزين التوكن
//       navigate("/lessons", { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);
//       const newErrors = [];
//       newErrors.push(err.message || t("login.loginError"));
//       setErrors(newErrors);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleForgotPasswordSubmit = async (e) => {
//     e.preventDefault();
//     setErrors([]);
//     setForgotMessage("");

//     try {
//       console.log('Sending forgot password request:', { email: forgotEmail });
//       const response = await apiClient.post('/api/users/forgot-password', { email: forgotEmail });
//       console.log('Forgot password response:', response.data);
//       if (response.status !== 200 || response.data?.error) {
//         throw new Error(response.data?.error || t("forgotPassword.error"));
//       }
//       setForgotMessage(t("forgotPassword.success"));
//     } catch (err) {
//       console.error('Forgot password error:', err);
//       const newErrors = [];
//       if (err.message) {
//         newErrors.push(err.message);
//       } else if (err.request) {
//         newErrors.push(t("forgotPassword.networkError"));
//       } else {
//         newErrors.push(t("forgotPassword.unexpectedError"));
//       }
//       setErrors(newErrors);
//     }
//   };

//   const handleOverlayClick = () => {
//     setErrors([]);
//   };

//   return (
//     <>
//       <header className="Lheader">
//         <img src={logo} alt="PyMagic Logo" className="logo" />
//       </header>
//       <section className="Login-section">
//         <div className="Lform-container">
//           {!forgotPasswordMode ? (
//             <form onSubmit={handleSubmit} className="Lform">
//               <label>{t("login.emailLabel")}</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder={t("login.emailLabel")}
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className={errors.some(e => e.toLowerCase().includes("email")) ? "error" : ""}
//               />
//               <label>{t("login.LpasswordLabel")}</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder={t("login.LpasswordLabel")}
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className={errors.some(e => e.toLowerCase().includes("password")) ? "error" : ""}
//               />
//               <div className="forget_rememberMe">
//                 <span>
//                   <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(true)}>
//                     {t("forgotPassword.link")}
//                   </a>
//                 </span>
//                 <span className="remember-me">
//                   <input
//                     type="checkbox"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                   />
//                   <label>{t("login.rememberMe")}</label>
//                 </span>
//               </div>
//               <button className="Lbutton" type="submit">
//                 {t("login.loginButton")}
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={handleForgotPasswordSubmit} className="Lform">
//               <label>{t("forgotPassword.emailLabel")}</label>
//               <input
//                 type="email"
//                 value={forgotEmail}
//                 onChange={(e) => setForgotEmail(e.target.value)}
//                 placeholder={t("forgotPassword.emailLabel")}
//                 required
//               />
//               <button className="Lbutton" type="submit">
//                 {t("forgotPassword.submitButton")}
//               </button>
//               {forgotMessage && (
//                 <div className="RRsuccess-message">
//                   {forgotMessage}
//                 </div>
//               )}
//               <div className="back-to-login">
//                 <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(false)}>
//                   {t("forgotPassword.backToLogin")}
//                 </a>
//               </div>
//             </form>
//           )}
//           {errors.length > 0 && (
//             <div className="error-overlay" onClick={handleOverlayClick}>
//               <div className="error-box">
//                 {errors.map((error, index) => (
//                   <div key={index} className="error-message">{error}</div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default LoginSection;




import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import apiClient from '../services';
import logo from "../components/images/logo.svg";

const LoginSection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const preflightRequest = async () => {
    try {
      const response = await fetch('https://pymagicnodejs-production-dc27.up.railway.app/ping', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('Preflight request status:', response.status);
    } catch (error) {
      console.error('Preflight request failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const tempErrors = [];

    if (!formData.email.includes("@")) {
      tempErrors.push(t("invalidEmail"));
    }
    if (formData.password.length < 6) {
      tempErrors.push(t("shortPassword"));
    }

    if (tempErrors.length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      // Execute preflight request to establish trust with Safari
      await preflightRequest();

      console.log('Sending login request:', formData);
      const response = await apiClient.post('/api/users/login', formData);
      console.log('Login response:', response.data);
      if (response.status !== 200 || !response.data?.token) {
        throw new Error(response.data?.error || t("login.loginError"));
      }

      const { token, user } = response.data;
      login(user, token);
      console.log('Login successful, token stored:', token);
      console.log('Current cookies:', document.cookie); // Log to confirm token storage
      navigate("/lessons", { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const newErrors = [];
      newErrors.push(err.message || t("login.loginError"));
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setForgotMessage("");

    try {
      console.log('Sending forgot password request:', { email: forgotEmail });
      const response = await apiClient.post('/api/users/forgot-password', { email: forgotEmail });
      console.log('Forgot password response:', response.data);
      if (response.status !== 200 || response.data?.error) {
        throw new Error(response.data?.error || t("forgotPassword.error"));
      }
      setForgotMessage(t("forgotPassword.success"));
    } catch (err) {
      console.error('Forgot password error:', err);
      const newErrors = [];
      if (err.message) {
        newErrors.push(err.message);
      } else if (err.request) {
        newErrors.push(t("forgotPassword.networkError"));
      } else {
        newErrors.push(t("forgotPassword.unexpectedError"));
      }
      setErrors(newErrors);
    }
  };

  const handleOverlayClick = () => {
    setErrors([]);
  };

  return (
    <>
      <header className="Lheader">
        <img src={logo} alt="PyMagic Logo" className="logo" />
      </header>
      <section className="Login-section">
        <div className="Lform-container">
          {!forgotPasswordMode ? (
            <form onSubmit={handleSubmit} className="Lform">
              <label>{t("login.emailLabel")}</label>
              <input
                type="email"
                name="email"
                placeholder={t("login.emailLabel")}
                value={formData.email}
                onChange={handleInputChange}
                required
                className={errors.some(e => e.toLowerCase().includes("email")) ? "error" : ""}
              />
              <label>{t("login.LpasswordLabel")}</label>
              <input
                type="password"
                name="password"
                placeholder={t("login.LpasswordLabel")}
                value={formData.password}
                onChange={handleInputChange}
                required
                className={errors.some(e => e.toLowerCase().includes("password")) ? "error" : ""}
              />
              <div className="forget_rememberMe">
                <span>
                  <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(true)}>
                    {t("forgotPassword.link")}
                  </a>
                </span>
                <span className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label>{t("login.rememberMe")}</label>
                </span>
              </div>
              <button className="Lbutton" type="submit">
                {t("login.loginButton")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="Lform">
              <label>{t("forgotPassword.emailLabel")}</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder={t("forgotPassword.emailLabel")}
                required
              />
              <button className="Lbutton" type="submit">
                {t("forgotPassword.submitButton")}
              </button>
              {forgotMessage && (
                <div className="RRsuccess-message">
                  {forgotMessage}
                </div>
              )}
              <div className="back-to-login">
                <a className="forgot-password-link" href="#" onClick={() => setForgotPasswordMode(false)}>
                  {t("forgotPassword.backToLogin")}
                </a>
              </div>
            </form>
          )}
          {errors.length > 0 && (
            <div className="error-overlay" onClick={handleOverlayClick}>
              <div className="error-box">
                {errors.map((error, index) => (
                  <div key={index} className="error-message">{error}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LoginSection;