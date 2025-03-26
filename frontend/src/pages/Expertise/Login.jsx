// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Correct path to AuthContext
import logo from "../../assets/logo.png"; // Import the logo from the assets folder

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      login();
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      alert("Please enter a valid username and password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md flex w-[50%]">
        {/* Left Side - Login Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-xl font-semibold mb-4">LOG IN</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between text-sm mb-4">
              <button type="button" className="text-blue-500">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              LOG IN
            </button>
          </form>
        </div>

        {/* Right Side - Logo */}
        <div className="w-1/2 flex flex-col items-center justify-center border-l">
          <img src={logo} alt="VetConnect Logo" className="w-32 mb-4" />
          <h2 className="text-lg font-semibold">Welcome to VetConnect</h2>
          <p className="text-sm text-gray-600">Where Care Meets Convenience</p>
        </div>
      </div>
    </div>
  );
};

export default Login;