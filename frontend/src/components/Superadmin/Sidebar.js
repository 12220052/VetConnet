// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUserCog,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons
import logo from "../../assets/logo.png"; // Import the logo

const Sidebar = () => {
  const location = useLocation(); // Get the current route location

  return (
    <div className="sidebar bg-[#011523] text-white w-64 h-full p-4 flex flex-col justify-center items-center pt-8">
      {/* Logo Section with Text */}
      <div className="sidebar-logo mb-8 flex flex-col items-center justify-center">
        <img src={logo} alt="VetConnect Logo" className="w-32 mb-2" />
        <p className="text-white text-lg font-semibold">VetConnect</p>
      </div>

      {/* Navigation Links */}
      <Link
        to="/superdashboard"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/superdashboard"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaHome className="mr-2" /> Dashboard
      </Link>
      <Link
        to="/expertiseMngt"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/expertiseMngt"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaClipboardList className="mr-2" /> Expertise Management
      </Link>
      <Link
        to="/expertiseMngt"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/vet-manage"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaUserCog className="mr-2" /> Content Management
      </Link>
      <Link
        to="/report"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/report"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaChartLine className="mr-2" /> Website Feedback
      </Link>

      <Link
        to="/report"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/report"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaChartLine className="mr-2" /> Payout
      </Link>
      <Link
        to="/report"
        className={`block py-2 px-3 rounded mb-2 flex items-center ${
          location.pathname === "/report"
            ? "bg-white text-[#011523]" // Active link styles
            : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
        }`}
      >
        <FaChartLine className="mr-2" /> Refund Forms
      </Link>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto">
        <button className="w-full py-2 px-3 rounded text-left flex items-center bg-[#011523] hover:bg-[#022a3f]">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
