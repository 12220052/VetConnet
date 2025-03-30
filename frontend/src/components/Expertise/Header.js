import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCaretDown } from "react-icons/fa"; // Import icons
import "../../styles.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <header className="bg-white shadow p-6 flex items-center w-full border-b-2 border-black h-20">
      {/* VetConnect (Left Side) */}
      <div className="text-left">
        <p className="text-[#011523] text-xl font-bold underline">VetConnect</p>
      </div>

      {/* Spacer to push user icon to the right */}
      <div className="flex-grow"></div>

      {/* User Icon and Dropdown */}
      <div className="relative flex items-center">
        <FaUserCircle className="w-12 h-12 text-gray-700" /> {/* User Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center focus:outline-none ml-2 border-none outline-none"
        >
          <FaCaretDown className="w-8 h-8 text-gray-700" />{" "}
          {/* Dropdown Arrow */}
        </button>
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => alert("Change Password")}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
