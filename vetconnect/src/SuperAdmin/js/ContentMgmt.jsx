import React, { useState } from "react";
import FAQSection from "./FAQSection";
import DiseaseOutbreak from "./DiseaseOutbreak";
import BannerSection from "./BannerSection";
import SuperAdminSidebar from "./Sidebar";
import AdminHeader from "./Header";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("Disease Outbreak");

  return (
    <div className="app-container flex h-screen">
    <SuperAdminSidebar />
    <div className="flex-1 flex flex-col">
      <AdminHeader />
     <div className="dashboard-container">
  <h2 className="dashboard-title">Content Management</h2>

  <div className="tab-buttons">
    {["Disease Outbreak", "Banner", "FAQ"].map((tab) => (
      <button
        key={tab}
        className={`tab-button ${activeTab === tab ? "active" : ""}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  {activeTab === "Disease Outbreak" && <DiseaseOutbreak />}
  {activeTab === "Banner" && <BannerSection />}
  {activeTab === "FAQ" && <FAQSection />}
</div>
</div>
    </div>
  );
};

export default ContentManagement;
