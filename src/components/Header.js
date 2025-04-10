// import React, { useState} from "react";
// import "./Header.css";
// import logo from "../components/images/logo.svg";
// import LanguageSwitcher from "./LanguageSwitcher";
// import { FaGlobe } from "react-icons/fa"; // أيقونة الكرة الأرضية من React Icons

//   const [open, setOpen] = useState(false);

// const toggleDropdown = () => {
//   setOpen((prev) => !prev);
// }; 

// const Header = () => {
//   return (
//     <header id="header" className="header">
//       <img src={logo} alt="PyMagic Logo" className="logo" />
//       <button onClick={toggleDropdown} className="language-icon-btn">
//         <FaGlobe size={22} />
//       </button>
//       <div className="languagehome">
        
//       <LanguageSwitcher />
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from "react";
import "./Header.css";
import logo from "../components/images/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import { FaGlobe } from "react-icons/fa"; // أيقونة الكرة الأرضية من React Icons

const Header = () => {
  const [open, setOpen] = useState(false); // تعريف الحالة داخل الـ Header

  const toggleDropdown = () => {
    setOpen((prev) => !prev); // تبديل بين فتح وإغلاق الـ dropdown
  };

  return (
    <header id="header" className="header">
      <img src={logo} alt="PyMagic Logo" className="logo" />
      <button onClick={toggleDropdown} className="language-icon-btn">
        <FaGlobe size={22} />
      </button>

      {/* إظهار أو إخفاء LanguageSwitcher بناءً على حالة open */}
      {open && (
        <div className="languagehome">
          <LanguageSwitcher open={open} setOpen={setOpen} />
        </div>
      )}
    </header>
  );
};

export default Header;

