// index.js
import React from "react";
import { createRoot } from "react-dom/client"; // For React 18
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Correct path to AuthContext

// Create a root element
const root = createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
