import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header id="herosection" className="hero">
      <div className="overlay">
        <h1>{t("welcome")}</h1>
        <p dangerouslySetInnerHTML={{ __html: t("unleash") }} />
        <div className="hero-buttons">
          <button className="btn primary" onClick={() => navigate("/register")}>
            {t("getStarted")}
          </button>
          <button className="btn secondary" onClick={() => navigate("/Login")}>
            {t("alreadyHaveAccount")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;