import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // استيراد useAuth
import { useTranslation } from "react-i18next"; // إضافة useTranslation
import Exit from "./images/Exit iconsvg.svg"; // أيقونة الرجوع
import "./setting.css"; // إضافة التنسيق

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // إضافة الترجمة

  const [showPopup, setShowPopup] = useState(false); // حالة لعرض النافذة المنبثقة

  const settings = [
    {
      title: t("myAccount"),
      description: t("changeNameEmailPassword"),
      icon: "👤",
      link: "/EditProfile"
    },
    {
      title: t("myMagicCharacter"),
      description: t("editCharacterOutfitsEffects"),
      icon: "🧙‍♂️",
      link: "/avatar"
    },
    {
      title: t("appearance"),
      description: t("magicModeDarkModeSounds"),
      icon: "✨",
      link: "/appearance"
    },
    {
      title: t("language"),
      description: t("selectLanguage"),
      icon: "🌐",
      link: "/language"
    },
    {
      title: t("achievementsNotifications"),
      description: t("challengeSettingsAlerts"),
      icon: "🏆",
      link: "/notifications"
    },
    {
      title: t("logout"),
      description: t("logoutFromAccount"),
      icon: "🚪",
      action: "logout"
    }
  ];

  const handleLogout = () => {
    setShowPopup(true); // عرض النافذة المنبثقة
  };

  const confirmLogout = () => {
    logout(); // تنفيذ logout من context
    setShowPopup(false); // إغلاق النافذة المنبثقة
    navigate("/HomePage"); // إعادة التوجيه بعد الخروج
  };

  const cancelLogout = () => {
    setShowPopup(false); // إغلاق النافذة المنبثقة بدون تنفيذ logout
  };

  return (
    <div className="settings-bg">
      {/* زر الرجوع */}
      <button className="back-button" onClick={() => navigate("/profile")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="settings-container">
        <div className="settings-header">{t("settingsHeader")}</div>
        <div className="settings-cards">
          {settings.map((item, index) => (
            <div
              key={index}
              className={`settings-card ${item.action === "logout" ? "logout-card" : ""}`}
              onClick={() => {
                if (item.action === "logout") {
                  handleLogout(); // عرض النافذة المنبثقة
                } else {
                  navigate(item.link); // التنقل إلى الإعدادات
                }
              }}
            >
              <div className="settings-icon">{item.icon}</div>
              <h2 className="settings-title">{item.title}</h2>
              <p className="settings-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* الرسالة المنبثقة */}
      {showPopup && (
        <div className="confirmation-popup">
          <div className="popup-title">{t("confirmLogout")}</div>
          <div className="popup-buttons">
            <button onClick={confirmLogout}>{t("confirm")}</button>
            <button className="cancel" onClick={cancelLogout}>{t("cancel")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;