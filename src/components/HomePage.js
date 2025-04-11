import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Photo from "./Photo";
import Features from "./Features";
import Footer from "./Footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Header /> 
      <HeroSection />
      <Photo />
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage;
