import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import apiClient from '../services';

const LoginSection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add useTranslation hook
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    try {
      const response = await apiClient.post('/api/users/login', formData);
  
      if (response.status !== 200 || !response.data?.token) {
        throw new Error(response.data?.error || t("loginError"));
      }

      const { token, user } = response.data;
    
      // Store user information in context
      login(user, token);
      // Navigate to lessons page on successful login
      navigate("/lessons", { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || t("loginError"));
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
          />

          <label>{t("LpasswordLabel")}</label>
          <input
            type="password"
            name="password"
            placeholder={t("LpasswordLabel")}
            value={formData.password}
            onChange={handleInputChange}
            required
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

          {error && <div className="error-message">{error}</div>}

          <button className="Lbutton" type="submit">
            {t("loginButton")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginSection;