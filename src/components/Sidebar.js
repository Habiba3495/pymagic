import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";
import logoo from "./images/logo.svg";

// gray icons
import l from "./images/Lessons outline.svg";
import cb from "./images/Chatbot outline.svg";
import fc from "./images/Flashcard outline.svg";
import p from "./images/Profile outline.svg";
import g from "./images/Game outline.svg";

// activate icons
import lActive from "./images/Lessons.svg";
import cbActive from "./images/Chatbot.svg";
import fcActive from "./images/Flashcard.svg";
import pActive from "./images/Profile.svg";
import gActive from "./images/Game Icon.svg";

const LSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); 

  const menuItems = useMemo(() => [
    { id: "lessons", label: t("sidebarLessons"), icon: l, activeIcon: lActive, path: "/lessons" },
    { id: "flashcards", label: t("sidebarFlashCards"), icon: fc, activeIcon: fcActive, path: "/flashcards" },
    { id: "game", label: t("sidebarGame"), icon: g, activeIcon: gActive, path: "/game" },
    { id: "chatbot", label: t("sidebarChatbot"), icon: cb, activeIcon: cbActive, path: "/chatbot" },
    { id: "profile", label: t("sidebarProfile"), icon: p, activeIcon: pActive, path: "/profile" },
  ], [t]); 

  return (
    <div className="sidebar">
      <div className="Ltitle">
        <img src={logoo} className="logoo" alt="PyMagic Logo" />
      </div>
      <nav>
        <ul className="menu">
          {menuItems.map((item) => {
         
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`menu-button ${isActive ? "active" : ""}`}
                  aria-label={`Go to ${item.label}`} 
                >
                  <img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.label}
                    className="menu-icon"
                  />
                  <span className={`menu-label ${isActive ? "bold-text" : ""}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default LSidebar;