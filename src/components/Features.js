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
      <h2>{t("whyLearn")}</h2>
      <div className="features-grid">
        <div className="feature">
          <h3>{t("learnPython")}</h3>
          <p>{t("learnPythonDesc")}</p>
        </div>
        <div className="feature_1">
          <img src={feature_1} alt="feature_1" />
        </div>
        <div className="feature_2">
          <img src={feature_2} alt="feature_2" />
        </div>
        <div className="feature">
          <h3>{t("embarkAdventure")}</h3>
          <p>{t("embarkAdventureDesc")}</p>
        </div>
        <div className="feature">
          <h3>{t("enchantAvatar")}</h3>
          <p>{t("enchantAvatarDesc")}</p>
        </div>
        <div className="feature_3">
          <img src={feature_3} alt="feature_3" />
        </div>
        <div className="feature_4">
          <img src={feature_4} alt="feature_4" />
        </div>
        <div className="feature">
          <h3>{t("magicalChatbot")}</h3>
          <p>{t("magicalChatbotDesc")}</p>
        </div>
      </div>
      <div className="back-to-top-container">
        <button className="button back-to-top" onClick={handleScrollToTop}>
          {t("backToTop")}
        </button>
      </div>
    </section>
  );
};

export default Features;