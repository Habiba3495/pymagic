// import React, { useState } from "react";
// import "./LoginSection.css";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';

// const LoginSection = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { t } = useTranslation(); // Add useTranslation hook
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Clear previous errors
  
//     try {
//       const response = await apiClient.post('/api/users/login', formData);
  
//       if (response.status !== 200 || !response.data?.token) {
//         throw new Error(response.data?.error || t("loginError"));
//       }

//       const { token, user } = response.data;
    
//       // Store user information in context
//       login(user, token);
//       // Navigate to lessons page on successful login
//       navigate("/lessons", { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.message || t("loginError"));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   return (
//     <section className="Login-section">


//       <div className="Lform-container">
//         <form onSubmit={handleSubmit} className="Lform">
//           <label>{t("emailLabel")}</label>
//           <input
//             type="email"
//             name="email"
//             placeholder={t("emailLabel")}
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />

//           <label>{t("LpasswordLabel")}</label>
//           <input
//             type="password"
//             name="password"
//             placeholder={t("LpasswordLabel")}
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />

//           <div className="remember-me">
//             <input
//               type="checkbox"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleInputChange}
//             />
//             <label>{t("rememberMe")}</label>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button className="Lbutton" type="submit">
//             {t("loginButton")}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default LoginSection;

import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import apiClient from '../services';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const tempErrors = [];

    // ✅ التحقق من صحة البيانات
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
      const response = await apiClient.post('/api/users/login', formData);

      if (response.status !== 200 || !response.data?.token) {
        throw new Error(response.data?.error || t("loginError"));
      }

      const { token, user } = response.data;
      login(user, token);
      navigate("/lessons", { replace: true });
    } catch (err) {
      const newErrors = [];

      if (err.response) {
        newErrors.push(err.response.data?.error || t("loginError"));
      } else if (err.request) {
        newErrors.push(t("networkError"));
      } else {
        newErrors.push(t("unexpectedError"));
      }

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

  return (
    <section className="Login-section">
      <div className="Lform-container">
        <form onSubmit={handleSubmit} className="Lform">
          <label>{t("emailLabel")}</label>
          <input
            type="email"
            name="email"
            placeholder={t("emailLabel")}
            value={formData.email}
            onChange={handleInputChange}
            required
            className={errors.some(e => e.toLowerCase().includes("email")) ? "error" : ""}
          />

          <label>{t("LpasswordLabel")}</label>
          <input
            type="password"
            name="password"
            placeholder={t("LpasswordLabel")}
            value={formData.password}
            onChange={handleInputChange}
            required
            className={errors.some(e => e.toLowerCase().includes("password")) ? "error" : ""}
          />

          <div className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label>{t("rememberMe")}</label>
          </div>

          <button className="Lbutton" type="submit">
            {t("loginButton")}
          </button>
        </form>

        {/* ✅ Overlay لعرض الأخطاء */}
        {errors.length > 0 && (
          <div className="error-overlay">
            <div className="error-box">
              {errors.map((error, index) => (
                <div key={index} className="error-message">{error}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoginSection;
