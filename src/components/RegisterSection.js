import React from "react";
import "./RegisterSection.css";
import { useNavigate } from "react-router-dom";

const RegisterSection = () => {
  const navigate = useNavigate();
  return (
    <section className="register-section">
      <h2 className="Rh2">Join us at the Academy of Mystic Code and arts</h2>
      <div className="Rform-container">
        <form>
          <label>Name</label>
          <input type="text" placeholder="Name" />

          <label>Age</label>
          <input type="number" placeholder="Age" />

          <label>User Email</label>
          <input type="email" placeholder="Email" />

          <label>Parent Email</label>
          <input type="email" placeholder="Email" />

          <label>Password</label>
          <input type="password" placeholder="Password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm Password" />

          <button className="Rbutton" type="submit" onClick={() => navigate("/Login")}>Register</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterSection;
