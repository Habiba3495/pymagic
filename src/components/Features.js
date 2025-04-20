import React from "react";
import "./Features.css";
import feature_2 from "../components/images/feature_2.svg";
import feature_3 from "../components/images/feature_3.svg";
import feature_4 from "../components/images/feature_4.svg";
import feature_1 from "../components/images/feature_1.svg";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const handleScrollToTop = () => {
    document.getElementById("header").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="features">
      <h2>{t("home.whyLearn")}</h2>
      <div className="features-grid">
        <div className="feature">
          <h3>{t("home.learnPython")}</h3>
          <p>{t("home.learnPythonDesc")}</p>
        </div>
        <div className="feature_1">
          <img src={feature_1} alt="feature_1" />
        </div>
        <div className="feature_2">
          <img src={feature_2} alt="feature_2" />
        </div>
        <div className="feature">
          <h3>{t("home.embarkAdventure")}</h3>
          <p>{t("home.embarkAdventureDesc")}</p>
        </div>
        <div className="feature">
          <h3>{t("home.enchantAvatar")}</h3>
          <p>{t("home.enchantAvatarDesc")}</p>
        </div>
        <div className="feature_3">
          <img src={feature_3} alt="feature_3" />
        </div>
        <div className="feature_4">
          <img src={feature_4} alt="feature_4" />
        </div>
        <div className="feature">
          <h3>{t("home.magicalChatbot")}</h3>
          <p>{t("home.magicalChatbotDesc")}</p>
        </div>
      </div>
      <div className="back-to-top-container">
        <button className="button back-to-top" onClick={handleScrollToTop}>
          {t("home.backToTop")}
        </button>
      </div>
    </section>
  );
};

export default Features;