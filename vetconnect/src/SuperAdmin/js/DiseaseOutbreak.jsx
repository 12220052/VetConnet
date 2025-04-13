import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../css/astyles.css";
import "../css/style.css";

const DiseaseOutbreak = () => {
  const [contentData, setContentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [editSuccessModalVisible, setEditSuccessModalVisible] = useState(false);
  const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [diseaseNameError, setDiseaseNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [toggleStates, setToggleStates] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("http://localhost:8080/allContent");
        const data = await response.json();
        setContentData(data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (successModalVisible || deleteSuccessModalVisible || editSuccessModalVisible) {
      const timer = setTimeout(() => {
        setSuccessModalVisible(false);
        setDeleteSuccessModalVisible(false);
        setEditSuccessModalVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successModalVisible, deleteSuccessModalVisible, editSuccessModalVisible]);

  const validateFields = () => {
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
    if (!photo && !isEditMode) {
      setPhotoError("Photo is required.");
      hasError = true;
    }

    return !hasError;
  };

  const handleAddOrUpdateDisease = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("Disease_Name", diseaseName);
    formData.append("Description", description);
    if (photo) formData.append("photo", photo);

    const url = isEditMode
      ? `http://localhost:8080/updatecontent/${selectedItem._id}`
      : "http://localhost:8080/createcontent";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit");

      const updatedContent = await fetch("http://localhost:8080/allContent");
      const newData = await updatedContent.json();
      setContentData(newData);

      setDiseaseName("");
      setDescription("");
      setPhoto(null);
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedItem(null);
      isEditMode ? setEditSuccessModalVisible(true) : setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error submitting disease:", error);
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/deletecontent/${selectedItem._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      const updatedContent = await fetch("http://localhost:8080/allContent");
      const newData = await updatedContent.json();
      setContentData(newData);

      setIsDeleteModalOpen(false);
      setDeleteSuccessModalVisible(true);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = (item) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setSelectedItem(item);
    setDiseaseName(item.Disease_Name);
    setDescription(item.Description);
    setPhoto(null);
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
            <th>Description</th>
            <th>Photo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contentData.map((item, index) => (
            <tr key={item._id || index}>
              <td>{index + 1}</td>
              <td>{item.Disease_Name}</td>
              <td>{item.Description}</td>
              <td>
                {item.image?.length ? (
                  <img
                    src={`http://localhost:8080/uploads/${item.image[0]}`}
                    alt="Disease"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="action-buttons">
                <button className="action-btn edit-btn" onClick={() => handleEditClick(item)}>
                  <FaEdit />
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteClick(item)}>
                  <FaTrash />
                </button>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={toggleStates[item._id] || false}
                    onChange={() =>
                      setToggleStates((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditMode ? "Edit Disease Outbreak" : "Add Disease Outbreak"}</h2>

            <label>Disease Name</label>
            <input
              type="text"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
            />
            {diseaseNameError && <p className="error">{diseaseNameError}</p>}

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && <p className="error">{descriptionError}</p>}

            <label>Photo</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
            {photoError && <p className="error">{photoError}</p>}

            <div className="modal-actions">
              <button onClick={handleAddOrUpdateDisease}>
                {isEditMode ? "Update" : "Submit"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setSelectedItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Success, Delete, Edit modals can be added as alerts or toasts */}
    </div>
  );
};

export default DiseaseOutbreak;
