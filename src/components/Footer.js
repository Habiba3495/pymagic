import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2>{t("aboutUs")}</h2>
          <p>{t("aboutUsDesc")}</p>
        </div>
        <div className="footer-right">
          <div className="social-links">
            <span>{t("followUs")}</span>
            <a href="#">{t("facebook")}</a>
            <a href="#">{t("twitter")}</a>
            <a href="#">{t("instagram")}</a>
            <a href="#">{t("linkedin")}</a>
          </div>
          <ul>
            <li><a href="#">{t("helpCenter")}</a></li>
            <li><a href="#">{t("contactUs")}</a></li>
            <li><a href="#">{t("termsConditions")}</a></li>
            <li><a href="#">{t("privacyPolicy")}</a></li>
          </ul>
          <p dangerouslySetInnerHTML={{ __html: t("haveQuestions") }} />
        </div>
      </div>
      <div className="footer-bottom">
        {t("footerBottom")}
      </div>
    </footer>
  );
};

export default Footer;