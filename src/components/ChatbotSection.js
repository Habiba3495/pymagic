import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./ChatbotSection.css";

const ChatbotSection = () => {


  return (
    <div className="Cpagecontainer">
      <Lsidebar />  {/* الشريط الجانبي */}
      <div className="c">
      < h2>Chatbot</h2>
      </div>
    </div>
  );
};

export default ChatbotSection;