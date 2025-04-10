// import React from "react";
// import { useTranslation } from "react-i18next";

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation(); // Get the i18n instance from useTranslation

//   // Debug: Log the i18n object to inspect it
//   console.log("i18n instance:", i18n);

//   const changeLanguage = (lng) => {
//     if (i18n && typeof i18n.changeLanguage === "function") {
//       i18n.changeLanguage(lng); // Use i18n.changeLanguage to switch languages
//     } else {
//       console.error("i18n.changeLanguage is not a function. i18n:", i18n);
//     }
//   };

//   return (
//     <div className="language-switcher">
//       <button onClick={() => changeLanguage("en")}>English</button>
//       <button onClick={() => changeLanguage("ar")}>العربية</button>
//     </div>
//   );
// };

// export default LanguageSwitcher;

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LanguageSwitcher = ({ open, setOpen }) => {
  const { i18n } = useTranslation();
  const dropdownRef = useRef();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false); // اغلق الـ dropdown بعد اختيار اللغة
  };

  // اغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false); // اغلق الـ dropdown إذا ضغطت خارج الـ dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return (
    <div className="custom-language-switcher" ref={dropdownRef}>
      {open && (
        <ul className="language-options">
          <li onClick={() => changeLanguage("en")}>English</li>
          <li onClick={() => changeLanguage("ar")}>العربية</li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;



