import React from "react";
import "./LoginHeader.css";
import logo from "../components/images/logo.svg" // تأكد من وضع اللوجو الصحيح

const LoginHeader = () => {
  return (
    <header className="Lheader">
      <img src={logo} alt="PyMagic Logo" className="logo" />
    </header>
  );
};

export default LoginHeader;