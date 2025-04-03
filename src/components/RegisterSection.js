import React, { useState } from "react";
import "./RegisterSection.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from '../services';

const RegisterSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add useTranslation hook
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(t("passwordMismatch"));
      return;
    }

    try {
      // Convert age to number and remove confirmPassword before sending
      const { confirmPassword, ...registrationData } = {
        ...formData,
        age: parseInt(formData.age),
      };

      const response = await apiClient.post("/api/users/register", registrationData);
      
      if (response.status === 201) {
        alert(t("registrationSuccess"));
        navigate("/Login");
      }
    } catch (error) {
      alert(error.response?.data?.error || t("registrationFailed"));
      console.error("Registration Error:", error);
    }
  };

  return (
    <section className="register-section">
      <h2>{t("registerTitle")}</h2>
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
  );
};

export default RegisterSection;