import React from "react";
import "./Photo.css";
import photo_front_en from "../components/images/CodeEnglish.svg";  // صورة اللغة الإنجليزية
import photo_front_ar from "../components/images/CodeArabic.svg";  // صورة اللغة العربية
import { useTranslation } from "react-i18next";

const ImageSection = () => {
  const { i18n } = useTranslation(); 
  const isArabic = i18n.language === "ar";

  return (
    <section className="image-section">
      <img className="image-section"
        src={isArabic ? photo_front_ar : photo_front_en} 
        alt="photo_front"
        // className="photo_front"
      />
    </section>
  );
};

export default ImageSection;

