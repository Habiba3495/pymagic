import React, { useMemo, useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); //status Sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = useMemo(
    () => [
      {
        id: "lessons",
        label: t("sidebar.sidebarLessons"),
        icon: l,
        activeIcon: lActive,
        path: "/lessons",
      },
      {
        id: "flashcards",
        label: t("sidebar.sidebarFlashCards"),
        icon: fc,
        activeIcon: fcActive,
        path: "/flashcards",
      },
      {
        id: "game",
        label: t("sidebar.sidebarGame"),
        icon: g,
        activeIcon: gActive,
        path: "/game",
      },
      {
        id: "chatbot",
        label: t("sidebar.sidebarChatbot"),
        icon: cb,
        activeIcon: cbActive,
        path: "/chatbot",
      },
      {
        id: "profile",
        label: t("sidebar.sidebarProfile"),
        icon: p,
        activeIcon: pActive,
        path: "/profile",
      },
    ],
    [t]
  );

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <span className="hamburger-icon"></span>
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`menu-button ${isActive ? "active" : ""}`}
                    aria-label={`Go to ${item.label}`}
                  >
                    <img
                      src={isActive ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="menu-icon"
                    />
                    <span
                      className={`menu-label ${isActive ? "bold-text" : ""}`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default LSidebar;