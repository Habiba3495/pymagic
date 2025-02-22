import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <header id="herosection" className="hero">
      <div className="overlay">
        <h1>Welcome to PyMagic, Young Wizard!</h1>
        <p>Unleash Your Inner Wizard! Learn Python, Unlock Secrets, and Find Hidden Treasures!</p>
        <div className="hero-buttons">
        <button className="btn primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
          <button className="btn secondary" onClick={() => navigate("/Login")}>
          I already have an account
          </button>
        </div>
      </div>
    </header>

  );
};

export default HeroSection;


