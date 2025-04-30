import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import Exit from "./images/Exit iconsvg.svg";
import "./setting.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiLogOut } from 'react-icons/fi';
import trackEvent from '../utils/trackEvent';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPopup, setShowPopup] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    trackEvent(user.id, 'pageview', {
      page: '/settings',
      category: 'Navigation',
    }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });
  }, [user, navigate]);

  const settings = [
    {
      title: t("setting.myAccount"),
      icon: "👤",
      link: "/EditProfile"
    },
    {
      title: t("setting.language"),
      icon: "🌐",
      link: "/language"
    },
    {
      title: t("setting.logout"),
      icon: <FiLogOut size={24} />,
      action: "logout"
    }
  ];

  const handleLogout = () => {
    if (!user || !user.id) {
      console.log('No user, skipping logout tracking');
      logout();
      navigate("/HomePage");
      return;
    }

    trackEvent(user.id, 'logout_initiated', {
      category: 'User',
      label: 'Logout Initiated',
    }, user).catch((error) => {
      console.error('Failed to track logout_initiated:', error);
    });
    setShowPopup(true);
  };

  const confirmLogout = () => {
    if (!user || !user.id) {
      console.log('No user, skipping logout_confirmed tracking');
      logout();
      setShowPopup(false);
      navigate("/HomePage");
      return;
    }

    trackEvent(user.id, 'logout_confirmed', {
      category: 'User',
      label: 'Logout Confirmed',
    }, user).catch((error) => {
      console.error('Failed to track logout_confirmed:', error);
    });
    logout();
    setShowPopup(false);
    navigate("/HomePage");
  };

  const cancelLogout = () => {
    if (!user || !user.id) {
      console.log('No user, skipping logout_cancelled tracking');
      setShowPopup(false);
      return;
    }

    trackEvent(user.id, 'logout_cancelled', {
      category: 'User',
      label: 'Logout Cancelled',
    }, user).catch((error) => {
      console.error('Failed to track logout_cancelled:', error);
    });
    setShowPopup(false);
  };

  const handleNavigation = (link) => {
    if (!user || !user.id) {
      console.log('No user, skipping navigation tracking');
      navigate(link);
      return;
    }

    trackEvent(user.id, 'settings_navigation', {
      category: 'Navigation',
      label: `Navigated to ${link}`,
    }, user).catch((error) => {
      console.error('Failed to track settings_navigation:', error);
    });
    navigate(link);
  };

  return (
    <div className="settings-bg">
      <button className="back-button" onClick={() => handleNavigation("/profile")}>
        <img src={Exit} alt="Back" className="back-icon" />
      </button>
      <div className="settings-container">
        <div className="settings-header">{t("setting.settings")}</div>
        <div className="settings-cards">
          {settings.map((item, index) => (
            item.title === t("setting.language") ? (
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
                    handleNavigation(item.link);
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
            <div className="popup-title">{t("setting.confirmLogout")}</div>
            <div className="popup-buttons">
              <button onClick={confirmLogout}>{t("setting.confirm")}</button>
              <button className="cancel" onClick={cancelLogout}>{t("setting.cancel")}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;