import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaComments,
  FaUserCog,
  FaMoneyBillWave,
  FaFileInvoice,
  FaSignOutAlt,
} from "react-icons/fa"; // Import new icons
import logo from "../../assets/logo.png"; // Import the logo
import "../../astyles.css";

const Sidebar = () => {
  const location = useLocation(); // Get the current route location

  return (
    <div
      className="sidebar text-white w-64 h-full p-4 flex flex-col justify-between"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Logo Section with Text */}
      <div
        className="sidebar-logo mb-8 flex flex-col items-center justify-center"
        style={{ textAlign: "center" }}
      >
        <img
          src={logo}
          alt="VetConnect Logo"
          className="logo mb-2"
          style={{
            width: "130px",
            height: "auto",
            paddingTop: "40px",
            paddingBottom: "20px",
          }}
        />
      </div>

      {/* Navigation Links */}
      <div style={{ flexGrow: 1 }}>
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
          <FaUserCog className="mr-2" /> Expertise Management
        </Link>
        <Link
          to="/contentmgnt"
          className={`block py-2 px-3 rounded mb-2 flex items-center ${
            location.pathname === "/contentmgnt"
              ? "bg-white text-[#011523]" // Active link styles
              : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
          }`}
        >
          <FaClipboardList className="mr-2" /> Content Management
        </Link>
        <Link
          to="/contenmgnt"
          className={`block py-2 px-3 rounded mb-2 flex items-center ${
            location.pathname === "/report"
              ? "bg-white text-[#011523]" // Active link styles
              : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
          }`}
        >
          <FaComments className="mr-2" /> Website Feedback
        </Link>
        <Link
          to="/payout"
          className={`block py-2 px-3 rounded mb-2 flex items-center ${
            location.pathname === "/payout"
              ? "bg-white text-[#011523]" // Active link styles
              : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
          }`}
        >
          <FaMoneyBillWave className="mr-2" /> Payout
        </Link>
        <Link
          to="/refund-forms"
          className={`block py-2 px-3 rounded mb-2 flex items-center ${
            location.pathname === "/refund-forms"
              ? "bg-white text-[#011523]" // Active link styles
              : "bg-[#011523] hover:bg-[#022a3f]" // Default styles
          }`}
        >
          <FaFileInvoice className="mr-2" /> Refund Forms
        </Link>
      </div>

      {/* Logout Button at the Bottom */}
      <div
        className="logout"
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          paddingbottom: "40px",
        }}
      >
        <button
          className="w-full py-2 px-2 rounded text-center flex items-center bg-[#011523] hover:bg-[#022a3f] justify-center"
          style={{ width: "70%" }}
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
