import React from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
  const navigate = useNavigate();

  return (
    <section className="Login-section">
      <div className="Lform-container">
        <form>
          <label>User Name</label>
          <input type="text" placeholder="Name" />

          <label>Password</label>
          <input type="password" placeholder="Password" />

          <button type="submit" onClick={() => navigate("/Lessons")}>Log In</button>
        </form>
      </div>
    </section>
  );
};

export default LoginSection;