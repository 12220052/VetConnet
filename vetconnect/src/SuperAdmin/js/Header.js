import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import "../css/header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication-related data, such as tokens or user info, if you're using it
    localStorage.removeItem("authToken"); // Example if using localStorage for auth
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Adjust to your profile page route
  };

  return (
    <div className="header-container">
      {/* Top Row - Brand and Profile */}
      <div className="header-top-row">
        <h1 className="vetconnect-title">VetConnect</h1>

        <div className="profile-section">
          <div className="profile-dropdown" onClick={() => setIsOpen(!isOpen)}>
            <FaUserCircle className="profile-icon" />
            <FaCaretDown className={`dropdown-arrow ${isOpen ? "open" : ""}`} />
          </div>

          {isOpen && (
            <div className="dropdown-menu">
              <button onClick={handleProfileClick} className="dropdown-item">
                View Profile
              </button>
              <button
                onClick={() => alert("Change Password")}
                className="dropdown-item"
              >
                Change Password
              </button>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Black Line */}
      <div className="header-divider"></div>
    </div>
  );
};

export default Header;
