import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apiClient from '../services';
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setError(t("verifyEmail.noToken"));
        return;
      }

      try {
        const response = await apiClient.get(`/api/users/verify-email?token=${token}`);
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.error || t("verifyEmail.error"));
      }
    };

    verifyEmail();
  }, [navigate, t]);

  return (
    <div className="verify-email-container">
      {/* <h2>{t("verifyEmail.title")}</h2> */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VerifyEmail;