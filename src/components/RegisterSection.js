// // // import React, { useState } from "react";
// // // import "./RegisterSection.css";
// // // import { useNavigate } from "react-router-dom";
// // // import { useTranslation } from "react-i18next";
// // // import apiClient from '../services';

// // // const RegisterSection = () => {
// // //   const navigate = useNavigate();
// // //   const { t } = useTranslation();
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     age: "",
// // //     email: "",
// // //     parentEmail: "",
// // //     password: "",
// // //     confirmPassword: "",
// // //   });

// // //   const handleChange = (e) => {
// // //     setFormData({ ...formData, [e.target.name]: e.target.value });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (formData.password !== formData.confirmPassword) {
// // //       alert(t("passwordMismatch"));  //////////
// // //       return;
// // //     }

// // //     try {
// // //       const { confirmPassword, ...registrationData } = {
// // //         ...formData,
// // //         age: parseInt(formData.age),
// // //       };

// // //       const response = await apiClient.post("/api/users/register", registrationData);
      
// // //       if (response.status === 201) {
// // //         alert(t("registrationSuccess")); /////////////
// // //         navigate("/Login");
// // //       }
// // //     } catch (error) {
// // //       alert(error.response?.data?.error || t("registrationFailed")); ////////////
// // //       console.error("Registration Error:", error); 
// // //     }
// // //   };

// // //   return (
// // //     <section className="register-section">
// // //       <h2>{t("registerTitle")}</h2>
// // //       <div className="Rform-container">
// // //         <form onSubmit={handleSubmit} className="Rform">
// // //           <label>{t("nameLabel")}</label>
// // //           <input
// // //             type="text"
// // //             name="name"
// // //             placeholder={t("nameLabel")}
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <label>{t("ageLabel")}</label>
// // //           <input
// // //             type="number"
// // //             name="age"
// // //             placeholder={t("ageLabel")}
// // //             min="1"
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <label>{t("userEmailLabel")}</label>
// // //           <input
// // //             type="email"
// // //             name="email"
// // //             placeholder={t("userEmailLabel")}
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <label>{t("parentEmailLabel")}</label>
// // //           <input
// // //             type="email"
// // //             name="parentEmail"
// // //             placeholder={t("parentEmailLabel")}
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <label>{t("RpasswordLabel")}</label>
// // //           <input
// // //             type="password"
// // //             name="password"
// // //             placeholder={t("RpasswordLabel")}
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <label>{t("confirmPasswordLabel")}</label>
// // //           <input
// // //             type="password"
// // //             name="confirmPassword"
// // //             placeholder={t("confirmPasswordLabel")}
// // //             onChange={handleChange}
// // //             required
// // //           />

// // //           <button className="Rbutton" type="submit">
// // //             {t("registerButton")}
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default RegisterSection;

// // import React, { useState } from "react";
// // import "./RegisterSection.css";
// // import { useNavigate } from "react-router-dom";
// // import { useTranslation } from "react-i18next";
// // import apiClient from '../services';

// // const RegisterSection = () => {
// //   const navigate = useNavigate();
// //   const { t } = useTranslation();
// //   const [error, setError] = useState(null); // State to store error message
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     age: "",
// //     email: "",
// //     parentEmail: "",
// //     password: "",
// //     confirmPassword: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError(null); // Clear previous errors

// //     // Validate password match
// //     if (formData.password !== formData.confirmPassword) {
// //       setError(t("passwordMismatch"));
// //       return;
// //     }

// //     try {
// //       const { confirmPassword, ...registrationData } = {
// //         ...formData,
// //         age: parseInt(formData.age),
// //       };

// //       const response = await apiClient.post("/api/users/register", registrationData);
      
// //       if (response.status === 201) {
// //         alert(t("registrationSuccess"));
// //         navigate("/Login");
// //       }
// //     } catch (error) {
// //       console.error("Registration Error:", error);
// //       setError(error.response?.data?.error || t("registrationFailed")); // Display error in UI
// //     }
// //   };

// //   return (
// //     <section className="register-section">
// //       <h2>{t("registerTitle")}</h2>
// //       <div className="Rform-container">
// //         <form onSubmit={handleSubmit} className="Rform">
// //           <label>{t("nameLabel")}</label>
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder={t("nameLabel")}
// //             onChange={handleChange}
// //             required
// //           />

// //           <label>{t("ageLabel")}</label>
// //           <input
// //             type="number"
// //             name="age"
// //             placeholder={t("ageLabel")}
// //             min="1"
// //             onChange={handleChange}
// //             required
// //           />

// //           <label>{t("userEmailLabel")}</label>
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder={t("userEmailLabel")}
// //             onChange={handleChange}
// //             required
// //           />

// //           <label>{t("parentEmailLabel")}</label>
// //           <input
// //             type="email"
// //             name="parentEmail"
// //             placeholder={t("parentEmailLabel")}
// //             onChange={handleChange}
// //             required
// //           />

// //           <label>{t("RpasswordLabel")}</label>
// //           <input
// //             type="password"
// //             name="password"
// //             placeholder={t("RpasswordLabel")}
// //             onChange={handleChange}
// //             required
// //           />

// //           <label>{t("confirmPasswordLabel")}</label>
// //           <input
// //             type="password"
// //             name="confirmPassword"
// //             placeholder={t("confirmPasswordLabel")}
// //             onChange={handleChange}
// //             required
// //           />

// //           {error && <div className="error-message">{error}</div>} {/* Display error if exists */}

// //           <button className="Rbutton" type="submit">
// //             {t("registerButton")}
// //           </button>
// //         </form>
// //       </div>
// //     </section>
// //   );
// // };

// // export default RegisterSection;

// import React, { useState } from "react";
// import "./RegisterSection.css";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';

// const RegisterSection = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     email: "",
//     parentEmail: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Clear previous errors

//     if (formData.password !== formData.confirmPassword) {
//       setError(t("passwordMismatch"));
//       return;
//     }

//     try {
//       const { confirmPassword, ...registrationData } = {
//         ...formData,
//         age: parseInt(formData.age),
//       };

//       const response = await apiClient.post("/api/users/register", registrationData);
      
//       if (response.status === 201) {
//         alert(t("registrationSuccess"));
//         navigate("/Login");
//       }
//     } catch (error) {
//       setError(error.response?.data?.error || t("registrationFailed"));
//       console.error("Registration Error:", error);
//     }
//   };

//   return (
//     <section className="register-section">
//       <h2>{t("registerTitle")}</h2>
//       <div className="Rform-container">
//         <form onSubmit={handleSubmit} className="Rform">
//           <label>{t("nameLabel")}</label>
//           <input
//             type="text"
//             name="name"
//             placeholder={t("nameLabel")}
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("ageLabel")}</label>
//           <input
//             type="number"
//             name="age"
//             placeholder={t("ageLabel")}
//             value={formData.age}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("userEmailLabel")}</label>
//           <input
//             type="email"
//             name="email"
//             placeholder={t("userEmailLabel")}
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("parentEmailLabel")}</label>
//           <input
//             type="email"
//             name="parentEmail"
//             placeholder={t("parentEmailLabel")}
//             value={formData.parentEmail}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("RpasswordLabel")}</label>
//           <input
//             type="password"
//             name="password"
//             placeholder={t("RpasswordLabel")}
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("confirmPasswordLabel")}</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder={t("confirmPasswordLabel")}
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />

//           {error && <div className="error-message">{error}</div>}

//           <button className="Rbutton" type="submit">
//             {t("registerButton")}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default RegisterSection;
// import React, { useState } from "react";
// import "./RegisterSection.css";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import apiClient from '../services';

// const RegisterSection = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [errors, setErrors] = useState([]); // ⬅️ مصفوفة للأخطاء
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     email: "",
//     parentEmail: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // collect all the errors
//   const validateForm = () => {
//     const validationErrors = [];
//     const age = parseInt(formData.age);

//     if (!formData.name.trim()) {
//       validationErrors.push(t("nameRequired")); // "يرجى إدخال الاسم"
//     }

//     if (isNaN(age) || age <= 8) {
//       validationErrors.push(t("validAgeRequired")); // "يرجى إدخال عمر صحيح"
//     }

//     if (!formData.email.includes("@")) {
//       validationErrors.push(t("validEmailRequired")); // "يرجى إدخال بريد إلكتروني صحيح"
//     }

//     if (!formData.parentEmail.includes("@")) {
//       validationErrors.push(t("validParentEmailRequired")); // "يرجى إدخال بريد إلكتروني صحيح لولي الأمر"
//     }

//     if (formData.password !== formData.confirmPassword) {
//       validationErrors.push(t("passwordMismatch")); // "كلمة المرور وتأكيدها غير متطابقين"
//     }

//     return validationErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors([]); // Clear old errors

//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const { confirmPassword, ...registrationData } = {
//         ...formData,
//         age: parseInt(formData.age),
//       };

//       const response = await apiClient.post("/api/users/register", registrationData);

//       if (response.status === 201) {
//         alert(t("registrationSuccess"));
//         navigate("/Login");
//       }
//     } catch (error) {
//       console.error("Registration Error:", error);
//       setErrors([error.response?.data?.error || t("registrationFailed")]);
//     }
//   };

//   return (
//     <section className="register-section">
//       <h2>{t("registerTitle")}</h2>
//       <div className="Rform-container">
//         <form onSubmit={handleSubmit} className="Rform">
//           <label>{t("nameLabel")}</label>
//           <input
//             type="text"
//             name="name"
//             placeholder={t("nameLabel")}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("ageLabel")}</label>
//           <input
//             type="number"
//             name="age"
//             placeholder={t("ageLabel")}
//             min="1"
//             onChange={handleChange}
//             required
//           />

//           <label>{t("userEmailLabel")}</label>
//           <input
//             type="email"
//             name="email"
//             placeholder={t("userEmailLabel")}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("parentEmailLabel")}</label>
//           <input
//             type="email"
//             name="parentEmail"
//             placeholder={t("parentEmailLabel")}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("RpasswordLabel")}</label>
//           <input
//             type="password"
//             name="password"
//             placeholder={t("RpasswordLabel")}
//             onChange={handleChange}
//             required
//           />

//           <label>{t("confirmPasswordLabel")}</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder={t("confirmPasswordLabel")}
//             onChange={handleChange}
//             required
//           />

//           {/* عرض الأخطاء هنا */}
//           {errors.length > 0 && (
//             <div className="error-list">
//               {errors.map((error, index) => (
//                 <div key={index} className="error-message">{error}</div>
//               ))}
//             </div>
//           )}

//           <button className="Rbutton" type="submit">
//             {t("registerButton")}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default RegisterSection;

import React, { useState } from "react";
import "./RegisterSection.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from '../services';
import RegisterFailed from "./RegisterFailed"; 
import logo from "../components/images/logo.svg";

const RegisterSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errors, setErrors] = useState([]); // ⬅️ مصفوفة للأخطاء
  const [apiError, setApiError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    parentEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // collect all the errors
  const validateForm = () => {
    const validationErrors = [];
    const age = parseInt(formData.age);

    // if (!formData.name.trim()) {
    //   validationErrors.push(t("nameRequired"));
    // }

    if (isNaN(age) || age <= 7) {
      validationErrors.push(t("register.validAgeRequired"));
    }

    // if (!formData.email.includes("@")) {
    //   validationErrors.push(t("validEmailRequired"));
    // }

    // if (!formData.parentEmail.includes("@")) {
    //   validationErrors.push(t("validParentEmailRequired"));
    // }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push(t("register.passwordMismatch"));
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // مسح الأخطاء القديمة

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = {
        ...formData,
        age: parseInt(formData.age),
      };

      const response = await apiClient.post("/api/users/register", registrationData);

      if (response.status === 201) {
        alert(t("registrationSuccess"));
        navigate("/Login");
      }

  // } catch (error) {
  //   console.error("Registration Error:", error);
  //   console.log("🔥 Error Response Data:", error.response?.data);
  
  //   if (
  //     !error.response ||                      // السيرفر مش رد
  //     error.response.status >= 500           // أو رد بخطأ داخلي
  //   ) {
  //     setApiError(true);                      // نعرض PyMagicRunner
  //   } else {
  //     setErrors([error.response?.data?.error || t("registrationFailed")]);
  //   }
  // }

// } catch (error) {
//   console.error("Registration Error:", error);
//   console.log("🔥 Error Response Data:", error.response?.data);

//   if (!error.response || error.response.status >= 500) {
//     setApiError(true);                     
//   } else {
//     const errorMsg = error.response?.data?.error || error.response?.data?.message;

//     // // هنا نتحقق من رسالة "Email already exists"
//     // if (errorMsg === "Email already exists") {
//     //   setErrors([t("register.emailExists")]); 

//     // } else {
//     //   setErrors([errorMsg || t("registrationFailed")]);
//     // }
//     if (errorMsg === "Email already exists") {
//       setErrors([t("register.emailExists")]);
//     } else if (errorMsg === "Parent email already exists") {
//       setErrors([t("register.parentEmailExists")]);
//     } else {
//       setErrors([errorMsg || t("registrationFailed")]);
//     }
    
//   }

} catch (error) {
  console.error("Registration Error:", error);
  console.log("🔥 Error Response Data:", error.response?.data);

  const errorMsg = error.response?.data?.error || error.response?.data?.message;
  
  // تحقق من الرسالة التي تأتي من السيرفر
  console.log("Backend Error Message:", errorMsg);

  if (errorMsg === "Email already exists") {
    setErrors([t("register.emailExists")]);
  } else if (errorMsg === "Parent email already exists") {
    setErrors([t("register.parentEmailExists")]);
  } else {
    setErrors([errorMsg || t("registrationFailed")]);
  }

}

  };
  if (apiError) {
    return <RegisterFailed/>;
  }
  
  return (
    <>
    <header className="Rheader">
    <img src={logo} alt="PyMagic Logo" className="logo" />
    </header>

    <section className="register-section">
      <h2>{t("registerTitle")}</h2>

      {/* error overlay */}
      {errors.length > 0 && (
        <div className="error-overlay">
          <div className="error-box">
            {errors.map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="Rform-container">
        <form onSubmit={handleSubmit} className="Rform">
          <label>{t("nameLabel")}</label>
          <input
            type="text"
            name="name"
            placeholder={t("nameLabel")}
            onChange={handleChange}
            required
          />

          <label>{t("ageLabel")}</label>
          <input
            type="number"
            name="age"
            placeholder={t("ageLabel")}
            min="1"
            onChange={handleChange}
            required
          />

          <label>{t("userEmailLabel")}</label>
          <input
            type="email"
            name="email"
            placeholder={t("userEmailLabel")}
            onChange={handleChange}
            required
          />

          <label>{t("parentEmailLabel")}</label>
          <input
            type="email"
            name="parentEmail"
            placeholder={t("parentEmailLabel")}
            onChange={handleChange}
            required
          />

          <label>{t("RpasswordLabel")}</label>
          <input
            type="password"
            name="password"
            placeholder={t("RpasswordLabel")}
            onChange={handleChange}
            required
          />

          <label>{t("confirmPasswordLabel")}</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("confirmPasswordLabel")}
            onChange={handleChange}
            required
          />

          <button className="Rbutton" type="submit">
            {t("registerButton")}
          </button>
        </form>
      </div>
    </section>
    </>
  );
};

export default RegisterSection;

