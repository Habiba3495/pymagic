// import React, { useState } from "react";
// import "./RegisterSection.css";
// import { useNavigate } from "react-router-dom";

// const RegisterSection = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     email: "",
//     parentEmail: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert("Registration successful");
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <section className="register-section">
//       <h2>Join us at the Academy of Mystic Code and Arts</h2>
//       <div className="Rform-container">
//         <form onSubmit={handleSubmit}>
//           <label>Name</label>
//           <input type="text" name="name" placeholder="Name" onChange={handleChange} required />

//           <label>Age</label>
//           <input type="number" name="age" placeholder="Age" onChange={handleChange} required />

//           <label>User Email</label>
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

//           <label>Parent Email</label>
//           <input type="email" name="parentEmail" placeholder="Parent Email" onChange={handleChange} required />

//           <label>Password</label>
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

//           <label>Confirm Password</label>
//           <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

//           <button className="Rbutton" type="submit" onClick={() => navigate("/Login")}>Register</button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default RegisterSection;

import React, { useState } from "react";
import "./RegisterSection.css";
import { useNavigate } from "react-router-dom";
import apiClient from '../services';

const RegisterSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    parentEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Convert age to number and remove confirmPassword before sending
      const { confirmPassword, ...registrationData } = {
        ...formData,
        age: parseInt(formData.age),
      };

      const response = await apiClient.post("/api/users/register", registrationData);
      
      if (response.status === 201) {
        alert("Registration successful");
        navigate("/Login"); // Move navigation here after successful registration
      }
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
      console.error("Registration Error:", error);
    }
  };

  return (
    <section className="register-section">
      <h2>Join us at the Academy of Mystic Code and Arts</h2>
      <div className="Rform-container">
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            min="1"
            onChange={handleChange}
            required
          />

          <label>User Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <label>Parent Email</label>
          <input
            type="email"
            name="parentEmail"
            placeholder="Parent Email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <button className="Rbutton" type="submit">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterSection;