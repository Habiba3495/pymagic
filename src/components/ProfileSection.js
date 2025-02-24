import React from "react";
import Lsidebar from "./Lsidebar"; // استيراد الشريط الجانبي
import "./ProfileSection.css";

const ProfileSection = () => {


  return (
    <div className="Ppagecontainer">
      <Lsidebar />  {/* الشريط الجانبي */}
      <div className="p">
      < h2>profile</h2>
      </div>
    </div>
  );
};

export default ProfileSection;