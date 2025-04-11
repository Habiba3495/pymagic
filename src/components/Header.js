import React, { useState } from "react";
import "./Header.css";
import logo from "../components/images/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import { FaGlobe } from "react-icons/fa";

const Header = () => {
  const [open, setOpen] = useState(false); 

  const toggleDropdown = () => {
    setOpen((prev) => !prev); 
  };

  return (
    <header id="header" className="header">
      <img src={logo} alt="PyMagic Logo" className="logo" />
      <button onClick={toggleDropdown} className="language-icon-btn">
        <FaGlobe size={22} />
      </button>

      {open && (
        <div className="languagehome">
          <LanguageSwitcher open={open} setOpen={setOpen} />
        </div>
      )}
    </header>
  );
};

export default Header;

