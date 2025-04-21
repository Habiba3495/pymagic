import React from "react";
import "./Loading.css";
import PaxImg from "./images/PAXcharacter.svg";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-box">
        <p>Loading...</p>
        <img src={PaxImg} alt="wizard" className="wizardImage" />
      </div>
    </div>
  );
};

export default LoadingPage;
