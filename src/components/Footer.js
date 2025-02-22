import React from "react";
import "./Footer.css"; // استيراد ملف CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* القسم الأيسر - معلومات حول الموقع */}
        <div className="footer-left">
          <h2>About Us</h2>
          <p>
          PyMagic is an interactive platform that makes learning Python fun for kids.Through a blend of storytelling and hands-on coding, we turn programming into an exciting adventure, fostering problem-solving skills and creativity in young learners.
          </p>
        </div>

        {/* القسم الأيمن - الروابط */}
        <div className="footer-right">
          <div className="social-links">
            <span>Follow us:</span>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
          <p>Have questions? Reach out to us at <strong>PyMagic@gmail.com</strong></p>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="footer-bottom">
        © 2024 PyMagic. All spells reserved.
      </div>
    </footer>
  );
};

export default Footer;
