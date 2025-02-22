import React from "react";
import "./Features.css";
import feature_2 from "../components/images/feature_2.svg"
import feature_3 from "../components/images/feature_3.svg"
import feature_4 from "../components/images/feature_4.svg"
import feature_1 from "../components/images/feature_1.svg"


const Features = () => {

        // دالة التمرير إلى قسم الهيرو
        const handleScrollToTop = () => {
          document.getElementById("header").scrollIntoView({ behavior: "smooth" });
        };
  return (
    <section className="features">
      <h2>why to learn with us</h2>
      <div className="features-grid">
        <div className="feature">
          <h3>Learn Python Magic Spells Through Stories!</h3>
          <p>Dive into enchanting video lessons where Pax will guide you through the secrets of Python. Each lesson is a magical tale that makes coding fun and easy to understand. Watch, learn, and start casting your own coding spells!</p>
        </div>
        <div className="feature_1">
        <img src={feature_1} alt='feature_1'></img>
      </div>
        <div className="feature_2">
        <img src={feature_2} alt='feature_2'></img>
      </div>
        <div className="feature">
          <h3>Embark on an Epic Adventure with Pax!</h3>
          <p>Join Pax at the Academy of Mystic Code! Explore magical realms, defeat dark magic, and uncover hidden treasures using Python coding spells. Every quest takes you closer to becoming a Master Wizard of Code!</p>
        </div>
        <div className="feature">
          <h3>Enchant Your Avatar with Magical Rewards!</h3>
          <p>Earn magical rewards as you complete quests and use them to customize your wizard avatar with exciting outfits and accessories. Make your wizard truly unique as you master the art of coding!</p>
        </div>
        <div className="feature_3">
        <img src={feature_3} alt='feature_3'></img>
      </div>
      <div className="feature_4">
        <img src={feature_4} alt='feature_4'></img>
      </div>
        <div className="feature">
          <h3>Your Magical Coding Chatbot Guide</h3>
          <p>Ask questions, get hints, and uncover secrets as you journey through the world of Python. Always ready to help you on your adventure!</p>
        </div>
      </div>
      <div className="back-to-top-container">
        <button className="button back-to-top" onClick={handleScrollToTop}>
          Back To Top
        </button>
      </div>

    </section>
  );
};

export default Features;
