// Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCaretDown } from "react-icons/fa"; // Import icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <header className="bg-white shadow p-4 flex justify-end w-full border-b-2 border-black h-20">
      {/* User Icon and Dropdown Arrow */}
      <div className="relative flex items-center">
        {/* User Icon */}
        <FaUserCircle className="w-12 h-12 text-gray-700" />{" "}
        {/* Increased size */}
        {/* Dropdown Arrow */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center focus:outline-none ml-2 border-none outline-none"
        >
          <FaCaretDown className="w-8 h-8 text-gray-700" />{" "}
          {/* Increased size */}
        </button>
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            {/* Change Password */}
            <button
              onClick={() => alert("Change Password")} // Add your password change logic here
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>

            {/* Logout */}
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
  // Removed invalid CSS block. Move this to an external CSS file or use inline styles.
};

//inle styles
const styles = {
  header: {
    width: "100%" /* Ensures full width */,
    maxWidth: "100vw" /* Prevents overflow */,
    backgroundColor: "#3498db" /* Example color */,
    height: "60px" /* Adjust height if needed */,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
  },
};

export default Header;
