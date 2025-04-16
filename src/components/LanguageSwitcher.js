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



