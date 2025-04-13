import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import logo from '../Images/logo.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be in the correct format (e.g., user@example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error for the field if the input becomes valid
    if (errors[name]) {
      let newErrors = { ...errors };
      if (name === 'email' && /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(value)) {
        delete newErrors.email;
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Forgot Password Form Submitted', formData);
      navigate('/resetpassword'); // Navigate to reset password page
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Form Section (now on left) */}
      <div className="form-section">
      <h2 className="login-title">LOG IN</h2>
      <p className="subtitle">TO CONTINUE</p>

        <h3 className="subtitlee">Forgot Password</h3>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className={`input-group ${errors.email ? 'error' : ''}`}>
            <EnvelopeIcon className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <button type="submit" className="confirm-btn">CONFIRM</button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>

      {/* Vertical Line */}
      <div className="vertical-line"></div>

      {/* Welcome Section (now on right) */}
      <div className="welcome-section">
        <img src={logo} alt="VetConnect Logo" className="logo" />
        <h2>Welcome to VetConnect</h2>
        <p>Where Care Meets Convenience!</p>
      </div>
    </div>
  );
};

export default ForgotPassword;