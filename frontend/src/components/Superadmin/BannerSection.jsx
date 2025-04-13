import React, { useState } from "react";

const BannerSection = () => {
  const [banners, setBanners] = useState([
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMsg("Please select an image to upload.");
      return;
    }

    const newBanner = {
      id: banners.length + 1,
      image: preview,
      name: `Banner ${banners.length + 1}`,
    };

    setBanners([...banners, newBanner]);
    setSelectedFile(null);
    setPreview("");
    setSuccessMsg("Banner uploaded successfully!");
    setErrorMsg("");
  };

  return (
    <div className="banner-container">
      <h3 className="section-title">Manage Banners</h3>

      {successMsg && <p className="alert alert-success">{successMsg}</p>}
      {errorMsg && <p className="alert alert-danger">{errorMsg}</p>}

      <div className="banner-list">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-item">
            <img src={banner.image} alt={banner.name} className="banner-img" />
            <p>{banner.name}</p>
          </div>
        ))}
      </div>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="preview-img" />}
        <button className="upload-btn" onClick={handleUpload}>Upload Banner</button>
      </div>
    </div>
  );
};

export default BannerSection;
