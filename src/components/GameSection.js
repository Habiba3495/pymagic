import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./GameSection.css";

const GameSection = () => {


  return (
    <div className="Gpagecontainer">
      <Lsidebar />  {/* الشريط الجانبي */}
      <div className="G">
      < h2>game</h2>
      </div>
    </div>
  );
};

export default GameSection;