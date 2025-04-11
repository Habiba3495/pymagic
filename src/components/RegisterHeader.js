import React from "react";
import "./RegisterHeader.css";
import logo from "../components/images/logo.svg"

const RegisterHeader = () => {
  return (
    <header className="Rheader">
      <img src={logo} alt="PyMagic Logo" className="logo" />
    </header>
  );
};

export default RegisterHeader;
