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
} from "react-icons/fa";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div
      className="sidebar text-white w-64 h-full p-4 flex flex-col justify-between"
      style={{
        width: "250px",
        padding: "7px",
        textAlign: "left",
        justifyContent: "flex-start",
        paddingTop: "40px",
        paddingBottom: "40px",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
      }}
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={logo}
          alt="VetConnect Logo"
          style={{
            width: "160px",
            height: "auto",
            marginBottom: "30px",
            paddingLeft: "50px",
            justifyContent: "center",
          }}
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col px-2 space-y-2">
        <SidebarLink
          to="/SuperAdmindashboard"
          icon={<FaHome />}
          text="Dashboard"
          location={location}
        />
        <SidebarLink
          to="/expertiseMngt"
          icon={<FaUserCog />}
          text="Expertise Management"
          location={location}
        />
        <SidebarLink
          to="/contentmgnt"
          icon={<FaClipboardList />}
          text="Content Management"
          location={location}
        />
        <SidebarLink
          to="/manageTestimonial"
          icon={<FaComments />}
          text="Website Feedback"
          location={location}
        />
        <SidebarLink
          to="/payout"
          icon={<FaMoneyBillWave />}
          text="Payout"
          location={location}
        />
        <SidebarLink
          to="/refund-forms"
          icon={<FaFileInvoice />}
          text="Refund Forms"
          location={location}
        />
      </div>

      {/* Logout Button */}
      <div
        className="px-4 mt-4"
        style={{
          marginTop: "130px",
        }}
      >
        <a href="/login" className="block w-full">
          <button className="w-full flex items-center justify-start gap-3 py-3 px-3 rounded bg-white text-[#011523] hover:bg-gray-200">
            <FaSignOutAlt className="mt-1" /> Log Out
          </button>
        </a>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, location }) => {
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded justify-start ${
        isActive ? "bg-white text-[#011523]" : "hover:bg-[#022a3f]"
      }`}
      style={{
        backgroundColor: isActive ? "#fff" : "#113047",
        color: isActive ? "#011523" : "#fff",
      }}
    >
      {icon} <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
