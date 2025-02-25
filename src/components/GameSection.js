import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./GameSection.css";

const GameSection = () => {
  const startGame = () => {
    console.log("Game started!"); 
  };

  return (
    <div className="Gpagecontainer">
      <Lsidebar /> {/* الشريط الجانبي */}
      <div className="game-background">
        <div className="game-door">
          <button className="start-game-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
