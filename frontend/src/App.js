import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles.css"; // Import the CSS file
import Header from "./components/Expertise/Header";
import Sidebar from "./components/Expertise/Sidebar";
import SuperAdminDashboard from "./pages/Superadmin/SuperAdminDashboard";
import ExpertiseDashboard from "./pages/Expertise/ExpertiseDashboard";
import Login from "./pages/Expertise/Login";
import VetApplication from "./pages/Expertise/VetApplication";
import VetManage from "./pages/Expertise/ManageVet";
import Report from "./pages/Expertise/Report";

const App = () => {
  return (
    <Router>
      <div className="app-container flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="content-container flex-1 p-4">
            <Routes>
              <Route path="/" element={<ExpertiseDashboard />} />
              <Route path="/edashboard" element={<ExpertiseDashboard />} />
              <Route path="/vet-application" element={<VetApplication />} />
              <Route path="/vet-manage" element={<VetManage />} />
              <Route path="/report" element={<Report />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
