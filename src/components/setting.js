
// export default SettingsPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import Exit from "./images/Exit iconsvg.svg";
import "./setting.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiLogOut } from 'react-icons/fi';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPopup, setShowPopup] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const settings = [
    {
      title: t("myAccount"),
      icon: "👤",
      link: "/EditProfile"
    },
    {
      title: t("language"),
      icon: "🌐",
      link: "/language"
    },
    {
      title: t("logout"),
      icon: <FiLogOut size={24} />,
      action: "logout"
    }
  ];

  const handleLogout = () => {
    setShowPopup(true);
  };

  const confirmLogout = () => {
    logout();
    setShowPopup(false);
    navigate("/HomePage");
  };

  const cancelLogout = () => {
    setShowPopup(false);
  };

  return (
    <div className="settings-bg">
      <button className="back-button" onClick={() => navigate("/profile")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="settings-container">
        <div className="settings-header">{t("settings")}</div>
        <div className="settings-cards">
          {settings.map((item, index) => (
            item.title === t("language") ? (
              <div
                key={index}
                className="settings-card"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <div className="settings-icon">{item.icon}</div>
                <h2 className="settings-title">{item.title}</h2>
              </div>
            ) : (
              <div
                key={index}
                className={`settings-card ${item.action === "logout" ? "logout-card" : ""}`}
                onClick={() => {
                  if (item.action === "logout") {
                    handleLogout();
                  } else {
                    navigate(item.link);
                  }
                }}
              >
                <div className="settings-icon">{item.icon}</div>
                <h2 className="settings-title">{item.title}</h2>
              </div>
            )
          ))}
        </div>
      </div>
      {/* عرض LanguageSwitcher في صندوق منفصل عند التبديل */}
      
      {showLanguageDropdown && (
      <div className="language-switcher-box">
        
          <LanguageSwitcher open={showLanguageDropdown} setOpen={setShowLanguageDropdown} />
        </div>
      )}

{showPopup && (
  <>
    <div className="confirmation-popup-overlay" onClick={cancelLogout}></div>
    <div className="confirmation-popup">
      <div className="popup-title">{t("confirmLogout")}</div>
      <div className="popup-buttons">
        <button onClick={confirmLogout}>{t("confirm")}</button>
        <button className="cancel" onClick={cancelLogout}>{t("cancel")}</button>
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default SettingsPage;
