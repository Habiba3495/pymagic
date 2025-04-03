import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./GameSection.css";
import { useTranslation } from "react-i18next"; // Add useTranslation


const GameSection = () => {
  const { t } = useTranslation(); // Initialize translation hook

  const startGame = () => {
    console.log("Game started!"); 
  };

  return (
    <div className="Gpagecontainer">
      <Lsidebar /> {/* الشريط الجانبي */}
      <div className="game-background">
        <div className="game-door">
          <button className="start-game-btn" onClick={startGame}>
          {t("gamebutton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
