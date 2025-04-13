import React, { useState } from "react";
import FAQSection from "../../components/Superadmin/FAQSection";
import DiseaseOutbreak from "../../components/Superadmin/DiseaseOutbreak";
import BannerSection from "../../components/Superadmin/BannerSection";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("Disease Outbreak");

  return (
    <div className="dashboard-container p-6">
      <h2 className="dashboard-title text-2xl font-bold mb-6">Content Management</h2>

      <div className="flex gap-6 border-b mb-8">
        {["Disease Outbreak", "Banner", "FAQ"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-lg font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            } transition-colors duration-300`}
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
  );
};

export default ContentManagement;
