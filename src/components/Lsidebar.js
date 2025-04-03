
// import React from "react";
// import "./Lsidebar.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import logoo from "./images/logo.svg";

// // أيقونات عادية
// import l from "./images/Lessons outline.svg";
// import cb from "./images/Chatbot outline.svg";
// import fc from "./images/Flashcard outline.svg";
// import p from "./images/Profile outline.svg";
// import g from "./images/Game outline.svg";

// // أيقونات عند التفاعل
// import lActive from "./images/Lessons.svg";
// import cbActive from "./images/Chatbot.svg";
// import fcActive from "./images/Flashcard.svg";
// import pActive from "./images/Profile.svg";
// import gActive from "./images/Game Icon.svg";

// const LSidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // نحصل على المسار الحالي

//   const menuItems = [
//     { id: "lessons", label: "Lessons", icon: l, activeIcon: lActive, path: "/lessons" },
//     { id: "flashcards", label: "Flash Cards", icon: fc, activeIcon: fcActive, path: "/flashcards" },
//     { id: "game", label: "Game", icon: g, activeIcon: gActive, path: "/game" },
//     { id: "chatbot", label: "Chatbot", icon: cb, activeIcon: cbActive, path: "/chatbot" },
//     { id: "profile", label: "Profile", icon: p, activeIcon: pActive, path: "/profile" },
//   ];

//   return (
//     <div className="sidebar">
//       <div className="Ltitle">
//         <img src={logoo} className="logoo" alt="PyMagic Logo" />
//       </div>
//       <nav>
//         <ul className="menu">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path; // تحقق مما إذا كانت الصفحة الحالية هي النشطة

//             return (
//               <li key={item.id}>
//                 <button
//                   onClick={() => navigate(item.path)}
//                   className={`menu-button ${isActive ? "active" : ""}`}
//                 >
//                   <img
//                     src={isActive ? item.activeIcon : item.icon}
//                     alt={item.label}
//                     className="menu-icon"
//                   />
//                   <span className={`menu-label ${isActive ? "bold-text" : ""}`}>{item.label}</span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default LSidebar;


// import React, { useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Lsidebar.css";
// import logoo from "./images/logo.svg";

// // أيقونات عادية
// import l from "./images/Lessons outline.svg";
// import cb from "./images/Chatbot outline.svg";
// import fc from "./images/Flashcard outline.svg";
// import p from "./images/Profile outline.svg";
// import g from "./images/Game outline.svg";

// // أيقونات عند التفاعل
// import lActive from "./images/Lessons.svg";
// import cbActive from "./images/Chatbot.svg";
// import fcActive from "./images/Flashcard.svg";
// import pActive from "./images/Profile.svg";
// import gActive from "./images/Game Icon.svg";

// const LSidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // نحصل على المسار الحالي

//   // تخزين القائمة في useMemo لتقليل إعادة الإنشاء
//   const menuItems = useMemo(() => [
//     { id: "lessons", label: "Lessons", icon: l, activeIcon: lActive, path: "/lessons" },
//     { id: "flashcards", label: "Flash Cards", icon: fc, activeIcon: fcActive, path: "/flashcards" },
//     { id: "game", label: "Game", icon: g, activeIcon: gActive, path: "/game" },
//     { id: "chatbot", label: "Chatbot", icon: cb, activeIcon: cbActive, path: "/chatbot" },
//     { id: "profile", label: "Profile", icon: p, activeIcon: pActive, path: "/profile" },
//   ], []);

//   return (
//     <div className="sidebar">
//       <div className="Ltitle">
//         <img src={logoo} className="logoo" alt="PyMagic Logo" />
//       </div>
//       <nav>
//         <ul className="menu">
//           {menuItems.map((item) => {
//             // تحقق مما إذا كانت الصفحة الحالية تابعة لهذا المسار
//             const isActive = location.pathname.startsWith(item.path);

//             return (
//               <li key={item.id}>
//                 <button
//                   onClick={() => navigate(item.path)}
//                   className={`menu-button ${isActive ? "active" : ""}`}
//                   aria-label={`Go to ${item.label}`} // تحسين الوصولية
//                 >
//                   <img
//                     src={isActive ? item.activeIcon : item.icon}
//                     alt={item.label}
//                     className="menu-icon"
//                   />
//                   <span className={`menu-label ${isActive ? "bold-text" : ""}`}>
//                     {item.label}
//                   </span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default LSidebar;

import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Add useTranslation
import "./Lsidebar.css";
import logoo from "./images/logo.svg";

// أيقونات عادية
import l from "./images/Lessons outline.svg";
import cb from "./images/Chatbot outline.svg";
import fc from "./images/Flashcard outline.svg";
import p from "./images/Profile outline.svg";
import g from "./images/Game outline.svg";

// أيقونات عند التفاعل
import lActive from "./images/Lessons.svg";
import cbActive from "./images/Chatbot.svg";
import fcActive from "./images/Flashcard.svg";
import pActive from "./images/Profile.svg";
import gActive from "./images/Game Icon.svg";

const LSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // Add useTranslation hook

  // تخزين القائمة في useMemo لتقليل إعادة الإنشاء
  const menuItems = useMemo(() => [
    { id: "lessons", label: t("sidebarLessons"), icon: l, activeIcon: lActive, path: "/lessons" },
    { id: "flashcards", label: t("sidebarFlashCards"), icon: fc, activeIcon: fcActive, path: "/flashcards" },
    { id: "game", label: t("sidebarGame"), icon: g, activeIcon: gActive, path: "/game" },
    { id: "chatbot", label: t("sidebarChatbot"), icon: cb, activeIcon: cbActive, path: "/chatbot" },
    { id: "profile", label: t("sidebarProfile"), icon: p, activeIcon: pActive, path: "/profile" },
  ], [t]); // Add t as a dependency to update labels when language changes

  return (
    <div className="sidebar">
      <div className="Ltitle">
        <img src={logoo} className="logoo" alt="PyMagic Logo" />
      </div>
      <nav>
        <ul className="menu">
          {menuItems.map((item) => {
            // تحقق مما إذا كانت الصفحة الحالية تابعة لهذا المسار
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`menu-button ${isActive ? "active" : ""}`}
                  aria-label={`Go to ${item.label}`} // تحسين الوصولية
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