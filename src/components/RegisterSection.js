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
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

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

  const validateForm = () => {
    const validationErrors = [];
    const age = parseInt(formData.age);

    if (!formData.name.trim()) {
      validationErrors.push(t("nameRequired"));
    }

    if (isNaN(age) || age <= 7) {
      validationErrors.push(t("register.validAgeRequired"));
    }

    if (!formData.email || !formData.email.includes("@")) {
      validationErrors.push(t("validEmailRequired"));
    }

    if (!formData.parentEmail || !formData.parentEmail.includes("@")) {
      validationErrors.push(t("validParentEmailRequired"));
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push(t("register.passwordMismatch"));
    }

    const password = formData.password;

    if (password.length < 10) {
      validationErrors.push(t("register.passwordTooShort"));
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!strongPasswordRegex.test(password)) {
      validationErrors.push(t("register.weakPassword"));
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

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
        setPopupMessage(t("register.registrationSuccess"));
        setPopupVisible(true);
        // setTimeout(() => {
        //   // navigate("/Login");
        // }, 2000);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      console.log("🔥 Error Response Data:", error.response?.data);

      // استخدام error.message مباشرة
      const errorMsg = error.message;

      console.log("Backend Error Message:", errorMsg);

      if (errorMsg === "Email already exists") {
        setErrors([t("register.emailExists")]);
      } else if (errorMsg === "Parent email already exists") {
        setErrors([t("register.parentEmailExists")]);
      } else if (!error.response || error.response.status >= 500) {
        setApiError(true);
      } else {
        setErrors([errorMsg || t("registrationFailed")]);
      }
    }
  };

  if (apiError) {
    return <RegisterFailed />;
  }

  return (
    <>
      <header className="Rheader">
        <img src={logo} alt="PyMagic Logo" className="logo" />
      </header>

      <section className="register-section">
        <h2>{t("registerTitle")}</h2>

        {errors.length > 0 && (
          <div className="error-overlay">
            <div className="Rerror-box">
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
      {popupVisible && (
        <div className="Rpopup-overlay">
          <div className="Rpopup-content">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterSection;