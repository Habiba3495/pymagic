import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from '../services';
import logo from "../components/images/logo.svg";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(t("resetPassword.noToken"));
    }
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError(t("resetPassword.shortPassword"));
      return;
    }

    try {
      const response = await apiClient.post('/api/users/reset-password', {
        token,
        newPassword,
      });

      if (response.status !== 200) {
        throw new Error(response.data?.error || t("resetPassword.error"));
      }

      setMessage(t("resetPassword.success"));
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || t("resetPassword.error"));
      } else if (err.request) {
        setError(t("resetPassword.networkError"));
      } else {
        setError(t("resetPassword.unexpectedError"));
      }
    }
  };

  return (
    <>
      <header className="RRheader">
        <img src={logo} alt="PyMagic Logo" className="logo" />
      </header>
      <section className="RResetPassword-section">
        <div className="RRform-container">
          <form onSubmit={handleSubmit} className="Rform">
            <h2>{t("resetPassword.title")}</h2>

            <label>{t("resetPassword.newPasswordLabel")}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("resetPassword.newPasswordLabel")}
              required
            />

            <button className="RRessetbutton" type="submit">
              {t("resetPassword.submitButton")}
            </button>
          </form>

          {message && (
            <div className="RRsuccess-message">
              {message}
            </div>
          )}

          {error && (
            <div className="RRerror-message">
              {error}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ResetPassword;