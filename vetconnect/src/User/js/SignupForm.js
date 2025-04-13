import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon,  LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupForm.css';
import logo from '../Images/logo.png';
import Footer from './Footer';

const SignupForm = () => {
  const navigate = useNavigate();
  const role = window.location.pathname.split('/')[1];
  // console.log(role)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    agreeToTerms: false,
    role:role
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // To hold any API errors

  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be in the correct format (e.g., user@example.com)';
    }

    

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{9,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 6 characters, contain one uppercase letter, one number, and one special character';
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = 'Passwords do not match';
    }

    // Terms and conditions validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
        case 'phone':
          const phoneRegex = /^(17|77)\d{6}$/;
          if (phoneRegex.test(value)) delete newErrors.phone;
          break;
        case 'password':
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{9,}$/;
          if (passwordRegex.test(value)) delete newErrors.password;
          break;
        case 'confirmpassword':
          if (value === formData.password) delete newErrors.confirmpassword;
          break;
        case 'agreeToTerms':
          if (checked) delete newErrors.agreeToTerms;
          break;
        default:
          break;
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission triggered');
    setApiError(''); // Clear any previous API errors
  
    if (validateForm()) {
      console.log('Form validation passed, sending API request...');
      try {
        const response = await fetch('http://localhost:8080/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Assuming formData contains email and other fields
          
        });
        
    console.log(formData.role)
        if (response.ok) {
          console.log('Signup successful');
    
          const email = formData.email;
  
          navigate('/otp', { state: { email } });
        } else {
          // Handle errors returned by the API
          const errorData = await response.json();
          console.log(errorData);
          setApiError(errorData.message || 'Signup failed');
        }
      } catch (error) {
        console.log(error)
        console.error('Error during signup:', error);
        setApiError('An error occurred. Please try again later.');
      }
    }
  };
  

  return (
    <div>
      <div className="signup-container">
        <div className="left-side">
          <img src={logo} alt="VetConnect Logo" className="logo" />
          <h2>Welcome to VetConnect</h2>
          <p>Where Care Meets Convenience!</p>
        </div>

        <div className="vertical-line"></div>

        <div className="right-side">
          <h2 className="signup-title">SIGN UP</h2>
          <p className="subtitle">FOR YOUR ACCOUNT</p>
          
          {apiError && <div className="api-error-message">{apiError}</div>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className={`input-group ${errors.name ? 'error' : ''}`}>
              <UserIcon className="icon small-icon" />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <EnvelopeIcon className="icon" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            {/* <div className={`input-group ${errors.phone ? 'error' : ''}`}>
              <PhoneIcon className="icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={8}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div> */}
            <div className={`input-group ${errors.password ? 'error' : ''}`}>
              <LockClosedIcon className="icon" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className={`input-group ${errors.confirmpassword ? 'error' : ''}`}>
              <LockClosedIcon className="icon" />
              <input type="password" name="confirmpassword" placeholder="Confirm Password" value={formData.confirmpassword} onChange={handleChange} />
              {errors.confirmpassword && <span className="error-message">{errors.confirmpassword}</span>}
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
              <label>I agree to VetConnect Terms of Service and acknowledge the Privacy Policy</label>
            </div>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            <button type="submit" className="signup-btn">SIGN UP</button>
          </form>
          <p className="login-text">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;
