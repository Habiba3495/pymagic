import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import UserContext
import { apiClient } from "../services";

const LoginSection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await apiClient.post('/api/users/login', formData); /// all api 

      if (response.status !== 200 || !response.data?.token) {
        throw new Error(response.data?.error || 'Login failed');
      }

      //if (response.status !== 200) if response != ok

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      document.cookie = `token=${token}; max-age=604800; path=/`; // 7 days

      // Store user information in context
      login(user);
      // Navigate to lessons page on successful login
      navigate("/lessons", { replace: true }); // replace: true prevents going back to login
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <section className="Login-section">
      <div className="Lform-container">
        <form onSubmit={handleSubmit}>
          <label>Email</label> {/* Updated label to match input type */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <div className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label>Remember Me</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="Lbutton" type="submit">
            Log In
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginSection;