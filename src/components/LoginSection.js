import React from "react";
import "./LoginSection.css";

const LoginSection = () => {
  return (
    <section className="Login-section">
      <div className="Lform-container">
        <form>
          <label>User Name</label>
          <input type="text" placeholder="Name" />

          <label>Password</label>
          <input type="password" placeholder="Password" />

          <button type="submit">Log In</button>
        </form>
      </div>
    </section>
  );
};

export default LoginSection;