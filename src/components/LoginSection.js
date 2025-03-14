import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import UserContext

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
      const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token based on rememberMe
      const { token, user } = data;
      if (formData.rememberMe) {
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; max-age=604800; path=/`; // 7 days
      } else {
        sessionStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/`; // Session cookie
      }
      // Store user information in context
      login(user, formData.rememberMe);
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