import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2>{t("home.aboutUs")}</h2>
          <p>{t("home.aboutUsDesc")}</p>
        </div>
        <div className="footer-right">
          <div className="social-links">
            <span>{t("home.followUs")}</span>
            <a href="https://www.facebook.com/profile.php?id=61575982222893">
              <i className="bi bi-facebook" style={{ fontSize: '20px', margin: '10px' }}></i>
            </a>
            <a href="#">
              <i className="bi bi-twitter" style={{ fontSize: '20px', margin: '10px' }}></i>
            </a>
            <a href="https://www.instagram.com/pymagic5?igsh=M2x3YzVpYnQyOWc4">
              <i className="bi bi-instagram" style={{ fontSize: '20px', margin: '10px' }}></i>
            </a>
            <a href="#">
              <i className="bi bi-linkedin" style={{ fontSize: '20px', margin: '10px' }}></i>
            </a>
          </div>
          <ul>
            <li><a href="#">{t("home.helpCenter")}</a></li>
            <li><a href="#">{t("home.contactUs")}</a></li>
            <li><a href="#">{t("home.termsConditions")}</a></li>
            <li><a href="#">{t("home.privacyPolicy")}</a></li>
          </ul>
          <p dangerouslySetInnerHTML={{ __html: t("home.haveQuestions") }} />
        </div>
      </div>
        <div className="footer-bottom">
        {t("home.educationalNote")}
      </div>
      <div className="footer-bottom">
        {t("home.footerBottom")}
      </div>
    </footer>
  );
};

export default Footer;
