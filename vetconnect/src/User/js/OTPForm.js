import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import axios from 'axios'; 
import '../styles/otp.css'; 
import logo from '../Images/logo.png';

const OTPForm = () => { 
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]); 

  const validateForm = () => {
    let newErrors = {};

   
    const otpValue = otp.join('');

    // OTP validation
    if (!otpValue.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otpValue)) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (index, value) => {
   
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

   
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Clear the error for the field if the input becomes valid
    if (errors.otp) {
      let newErrors = { ...errors };
      if (/^\d{6}$/.test(newOtp.join(''))) {
        delete newErrors.otp;
      }
      setErrors(newErrors);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear any previous errors
  
    if (validateForm()) {
      const otpValue = otp.join(''); // Combine OTP fields into a single string
  
      try {
        // Send OTP and email to the backend for verification
        const response = await fetch('http://localhost:8080/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp: otpValue }), // Send email and OTP as JSON
        });
  
        if (response.ok) {
          // OTP verified successfully
          const data = await response.json(); // Parse the success response
          console.log('OTP Verified:', data.message);
          navigate('/login'); // Navigate to the login page after successful OTP verification
        } else {
          // Handle invalid OTP or expired OTP
          const errorData = await response.json(); // Parse the error response
          setErrors({ otp: errorData.error || 'Invalid OTP, please try again' });
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setErrors({ otp: 'Something went wrong. Please try again later.' });
      }
    }
  };
  

  return (
    <div className="otp-container">
      <div className="left-side">
        <img src={logo} alt="VetConnect Logo" className="logo" />
        <h2>Welcome to VetConnect</h2>
        <p>Where Care Meets Convenience!</p>
      </div>

      <div className="vertical-line"></div>

      <div className="right-side">
        <h2 className="signup-title">SIGN UP</h2>
        <p className="subtitle">FOR YOUR ACCOUNT</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <p className="otp-message">OTP is sent to your email</p>
          <div className="otp-input-group">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
                className={`otp-input ${errors.otp ? 'error' : ''}`}
              />
            ))}
          </div>
          {errors.otp && <span className="error-message">{errors.otp}</span>}
          <p className="resend-otp">
            <a href="#resend">Resend OTP</a>
          </p>
          <button type="submit" className="otp-btn">CONFIRM</button>
        </form>
      </div>
    </div>
  );
};

export default OTPForm;
