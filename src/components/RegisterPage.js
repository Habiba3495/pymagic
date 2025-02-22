import React from "react";
import RegisterHeader from "./RegisterHeader";
import RegisterSection from "./RegisterSection";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div className="home-page">
      <RegisterHeader />
      <RegisterSection />
    </div>
  );
};

export default RegisterPage;
