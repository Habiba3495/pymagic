import React from "react";
import "./Header.css";
import logo from "../components/images/logo.svg"

const Header = () => {
  return (
    <header id="header" className="header">
      <img src={logo} alt="PyMagic Logo" className="logo" />
    </header>
  );
};

export default Header;
