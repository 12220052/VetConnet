import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("Disease Outbreak");

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Content Management</h2>
      
      <div className="flex gap-4 border-b mb-4">
        {["Disease Outbreak", "Banner", "FAQ"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
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

const DiseaseOutbreak = () => {
  const data = [
    { id: 1, name: "Rabies", date: "10/2/25" },
    { id: 2, name: "Rabies", date: "10/2/25" },
  ];

  return (
    <div className="table-container">
      <button className="add-expertise-btn">Add Information</button>
      <table className="table">
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Disease Outbreak</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td className="action-buttons">
                <button className="action-btn edit-btn"><FaEdit /></button>
                <button className="action-btn delete-btn"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setFileInputState(e.target.value);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrMsg("Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      await uploadImage(reader.result);
    };
    reader.onerror = () => {
      setErrMsg("Error reading file.");
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed");

      const newBanner = { id: banners.length + 1, url: base64EncodedImage, date: new Date().toLocaleDateString() };
      setBanners([...banners, newBanner]);

      setFileInputState("");
      setPreviewSource("");
      setSuccessMsg("Image uploaded successfully!");
      setErrMsg("");
    } catch (err) {
      setErrMsg("Something went wrong! Please check the server.");
      setSuccessMsg("");
    }
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="table-container">
      <button className="add-expertise-btn" onClick={() => document.getElementById("banner-upload").click()}>
        Add Banner
      </button>
      <input
        type="file"
        id="banner-upload"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {previewSource && (
        <div className="preview-container">
          <h3>Preview:</h3>
          <img src={previewSource} alt="Banner Preview" className="preview-image" />
          <button className="btn upload-btn" onClick={handleSubmitFile}>
            Upload Banner
          </button>
        </div>
      )}

      {errMsg && <p className="alert alert-danger">{errMsg}</p>}
      {successMsg && <p className="alert alert-success">{successMsg}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Banner</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner.id}>
              <td>{index + 1}</td>
              <td>
                <img src={banner.url} alt="Banner" className="table-image" />
              </td>
              <td>{banner.date}</td>
              <td className="action-buttons">
                <button className="action-btn delete-btn" onClick={() => handleDeleteBanner(banner.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const FAQSection = () => {
  const [faqs, setFaqs] = useState([
    { id: 1, question: "How do I book an appointment?", answer: "Booking an appointment..", enabled: true },
    { id: 2, question: "What services do you offer?", answer: "We offer pet check-ups..", enabled: false },
  ]);

  const toggleFAQ = (id) => {
    setFaqs(faqs.map(faq => faq.id === id ? { ...faq, enabled: !faq.enabled } : faq));
  };

  return (
    <div className="table-container">
      <button className="add-expertise-btn">Add FAQ</button>
      <table className="table">
        <thead>
          <tr>
            <th>Q.No</th>
            <th>Questions</th>
            <th>Answers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, index) => (
            <tr key={faq.id}>
              <td>{index + 1}</td>
              <td>{faq.question}</td>
              <td>{faq.answer}</td>
              <td className="action-buttons">
                <button 
                  className={`action-btn ${faq.enabled ? "save-btn" : "delete-btn"}`}
                  onClick={() => toggleFAQ(faq.id)}
                >
                  {faq.enabled ? "Disable" : "Enable"}
                </button>
                <button className="action-btn edit-btn"><FaEdit /></button>
                <button className="action-btn delete-btn"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentManagement;