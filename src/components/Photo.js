import React from "react";
import "./Photo.css";
import photo_front from "../components/images/photo_front.svg"

const ImageSection = () => {
    return (
      <section className="image-section">
        <img src={photo_front} alt="photo_front" className="photo_front" />
      </section>
    );
  };
  
  export default ImageSection;
