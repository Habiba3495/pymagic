import React from "react";
import "./RegisterSection.css";

const RegisterSection = () => {
  return (
    <section className="register-section">
      <h2>Join us at the Academy of Mystic Code and arts</h2>
      <div className="form-container">
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

          <button type="submit">Register</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterSection;
