import React from "react";
import LoginSection from "./LoginSection";
import "./LoginPage.css";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className={isArabic ? "Llogin-page-ar" : "Llogin-page"}>
      <LoginSection />
    </div>
  );
};

export default LoginPage;
