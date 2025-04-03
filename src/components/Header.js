import React from "react";
import "./Header.css";
import logo from "../components/images/logo.svg";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  return (
    <header id="header" className="header">
      <img src={logo} alt="PyMagic Logo" className="logo" />
      <LanguageSwitcher />
    </header>
  );
};

export default Header;