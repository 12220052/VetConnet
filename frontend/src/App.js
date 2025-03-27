import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./styles.css";
import "./astyles.css";
import Header from "./components/Expertise/Header";
import AdminHeader from "./components/Superadmin/Header"; // SuperAdmin Header
import SuperAdminSidebar from "./components/Superadmin/Sidebar";
import ExpertiseSidebar from "./components/Expertise/Sidebar";
import SuperAdminDashboard from "./pages/Superadmin/SuperAdminDashboard";
import ExpertiseMngt from "./pages/Superadmin/ExpertiseMngt.jsx";
import ExpertiseDashboard from "./pages/Expertise/ExpertiseDashboard";
import ContentManagement from "./pages/Superadmin/ContentMgmt.jsx";
import VetApplication from "./pages/Expertise/VetApplication";
import VetManage from "./pages/Expertise/ManageVet";
import Report from "./pages/Expertise/Report";

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

// 🔹 Layout Component to Manage Sidebar & Header
const MainLayout = () => {
  const location = useLocation(); // Get current route

  // 🔹 Check if the route belongs to SuperAdmin
  const isSuperAdminPage =
    location.pathname.startsWith("/superdashboard") ||
    location.pathname.startsWith("/expertiseMngt") ||
    location.pathname.startsWith("/contentMgmt");

  // 🔹 Get the appropriate sidebar
  const getSidebar = () =>
    isSuperAdminPage ? <SuperAdminSidebar /> : <ExpertiseSidebar />;

  return (
    <div className="app-container flex h-screen">
      {/* Sidebar based on route */}
      {getSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Conditionally render Header */}
        {isSuperAdminPage ? <AdminHeader /> : <Header />}

        {/* Page Content */}
        <div className="content-container flex-1 p-4">
          <Routes>
            <Route path="/" element={<SuperAdminDashboard />} />
            <Route path="/superdashboard" element={<SuperAdminDashboard />} />
            <Route path="/contentMgmt" element={<ContentManagement />} />
            <Route path="/edashboard" element={<ExpertiseDashboard />} />
            <Route path="/expertiseMngt" element={<ExpertiseMngt />} />
            <Route path="/vet-application" element={<VetApplication />} />
            <Route path="/vet-manage" element={<VetManage />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
