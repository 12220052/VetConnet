import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css';
import logo from '../Images/logo.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Password Reset Form Submitted', formData);
      navigate('/login'); // Navigate to login page after successful reset
    }
  };

  return (
    <div className="reset-password-container">
      {/* Form Section (left side) */}
      <div className="form-section">
        <h2 className="login-title">LOG IN</h2>
        <p className="subtitle">TO CONTINUE</p>
        
        <h3 className="reset-title">Reset Password</h3>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className={`input-group ${errors.newPassword ? 'error' : ''}`}>
            <LockClosedIcon className="icon" />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>
          <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`}>
            <LockClosedIcon className="icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="continue-btn">CONTINUE</button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>

      {/* Vertical Line */}
      <div className="vertical-line"></div>

      {/* Welcome Section (right side) */}
      <div className="welcome-section">
        <img src={logo} alt="VetConnect Logo" className="logo" />
        <h2>Welcome to VetConnect</h2>
        <p>Where Care Meets Convenience!</p>
      </div>
    </div>
  );
};

export default ResetPassword;