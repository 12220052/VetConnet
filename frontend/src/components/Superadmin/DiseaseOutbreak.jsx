import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DiseaseOutbreak = () => {
  const [data, setData] = useState([
    { id: 1, name: "Rabies", date: "10/2/25" },
    { id: 2, name: "Malaria", date: "10/5/25" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [diseaseName, setDiseaseName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [diseaseNameError, setDiseaseNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [photoError, setPhotoError] = useState("");

  const handleAddDisease = () => {
    let hasError = false;

    setDiseaseNameError("");
    setDescriptionError("");
    setPhotoError("");

    if (!diseaseName) {
      setDiseaseNameError("Disease name is required.");
      hasError = true;
    }
    if (!description) {
      setDescriptionError("Description is required.");
      hasError = true;
    }
    if (!photo) {
      setPhotoError("Photo is required.");
      hasError = true;
    }

    if (hasError) return;

    // Close the Add Disease modal and open the confirmation modal
    setIsModalOpen(false);
    setConfirmModalOpen(true);
  };

  const handleConfirmUpload = () => {
    const newDisease = {
      id: data.length + 1,
      name: diseaseName,
      date: new Date().toLocaleDateString(),
    };
    setData([...data, newDisease]);

    // Reset fields and close the confirmation modal
    setDiseaseName("");
    setDescription("");
    setPhoto(null);
    setConfirmModalOpen(false);

    // Show the success modal after confirmation
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 300);
  };

  return (
    <div className="table-container">
      <button className="add-expertise-btn" onClick={() => setIsModalOpen(true)}>
        Add Disease Outbreak
      </button>

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

      {/* Add Disease Modal */}
      {isModalOpen && (
        <div className="dmodal">
          <div className="dmodal-content">
            <h3>Add Disease Outbreak</h3>
            <label>
              Disease Name:
              <input
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                placeholder="Enter Disease Name"
              />
              {diseaseNameError && <p className="error-text">{diseaseNameError}</p>}
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              />
              {descriptionError && <p className="error-text">{descriptionError}</p>}
            </label>
            <label>
              Upload Photo:
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhoto(file);
                  if (file) setPhotoError(""); 
                }}
              />
              {photoError && <p className="error-text">{photoError}</p>}
            </label>
            <div className="dmodal-buttons">
              <button className="save-btn" onClick={handleAddDisease}>Upload</button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="dmodal">
          <div className="dmodal-content">
            <h3>Are you sure you want to add this disease outbreak?</h3>
            <div className="dmodal-buttons">
              <button className="save-btn" onClick={handleConfirmUpload}>Yes</button>
              <button className="cancel-btn" onClick={() => setConfirmModalOpen(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalVisible && (
        <div className="modal-overlay fade-in">
          <div className="modal success-modal">
            <h3>Success!</h3>
            <p>The disease outbreak was successfully registered.</p>
            <button className="close-btn" onClick={() => setSuccessModalVisible(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseOutbreak;
