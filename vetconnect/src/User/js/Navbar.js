import React from "react";
import "../styles/Navbar.css" // Import CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left side: Logo and Name */}
      <div className="navbar-left">
        <img src="/logo.png" alt="VetConnect Logo" className="logo" />
        <span className="brand-name">VetConnect</span>
      </div>

      {/* Right side: Navigation */}
      <div className="navbar-right">
        <div className="dropdown">
          <button className="dropbtn">Become a member ▼</button>
          <div className="dropdown-content">
            <a href="/vet">a vet</a>
            <a href="/client">a client</a>
          </div>
        </div>
        <a href="#">About Us</a>
        <button className="login-btn">Login / SignUp</button>
      </div>
    </nav>
  );
};

export default Navbar;
