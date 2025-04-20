import React from "react";
import "./RegisterField.css"; 
import { useTranslation } from "react-i18next";


const RLoadingPage = () => {
    const { t } = useTranslation();

  return (
    <div className="Rloading-container">
      <div className="Rloading-box">
        <p> {t("Something went wrong. Please try again later.")}</p>
      </div>
    </div>
  );
};

export default RLoadingPage;