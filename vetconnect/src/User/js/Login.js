import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Separate CSS file for Login
import logo from '../Images/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({

    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  

  const validateForm = () => {
    let newErrors = {};

    

    // Email validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be in the correct format (e.g., user@example.com)';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
      switch (name) {
        case 'name':
          if (value.trim()) delete newErrors.name;
          break;
        case 'email':
          const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
          if (emailRegex.test(value)) delete newErrors.email;
          break;
        case 'password':
          if (value.trim()) delete newErrors.password;
          break;
        default:
          break;
      }
      setErrors(newErrors);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('login triggered');
    setApiError(''); // Clear previous API errors
  
    if (validateForm()) {
      console.log('login validation passed, sending API request...');
      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Send email and password
        });
  
        const responseData = await response.json(); // Parse JSON response
     console.log(responseData)
        if (response.ok) {
          console.log('login successful');
          // Store token in localStorage
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('userRole', responseData.userData.role_id.role_type); 
        const role = localStorage.getItem('userRole')
        console.log(role)
        switch (role) {
          case 'client':
            navigate('/');
            break;
          case 'superAdmin':
            navigate('/SuperAdmindashboard');
            break;
          case 'vet':
            navigate('/vetDashboard');
            break;
          case 'expertise':
            navigate('/adminDashboard');
            break;
          
        }
        } else {
          console.log('login failed:', responseData);
          setApiError(responseData.message || 'Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setApiError('An error occurred. Please try again later.');
      }
    }
  };
  


  return (
    <div className="login-container">
      {/* Right-side content moved to the left */}
      <div className="right-side">
        <h2 className="login-title">LOG IN</h2>
        <p className="subtitle">TO CONTINUE</p>
        {apiError && <div className="api-error-message">{apiError}</div>}
        <form onSubmit={handleSubmit} className="login-form">
    
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
          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <LockClosedIcon className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <p className="forgot-password">
            <a href="/forgotpassword">Forgot password?</a>
          </p>
          <button type="submit" className="login-btn">LOG IN</button>
        </form>
        <p className="signup-text">
          Don’t have an account? <a href="/">Signup</a>
        </p>
      </div>

      {/* Vertical Line */}
      <div className="vertical-line"></div>

      {/* Left-side content moved to the right */}
      <div className="left-side">
        <img src={logo} alt="VetConnect Logo" className="logo" />
        <h2>Welcome to VetConnect</h2>
        <p>Where Care Meets Convenience!</p>
      </div>
    </div>
  );
};

export default Login;