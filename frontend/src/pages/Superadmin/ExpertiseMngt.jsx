import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../astyles.css";

const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(null);
  const [newExpertise, setNewExpertise] = useState({
    cid: "",
    name: "",
    email: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    fetchExpertise();
  }, []);

  const fetchExpertise = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/getExpertise"); // Update API endpoint
      setExpertiseList(response.data); // Assuming response is an array of expertise data
    } catch (error) {
      console.error("Error fetching expertise:", error.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  };

  const openModal = (expertise = null) => {
    setEditingExpertise(expertise);
    setNewExpertise(expertise || { cid: "", name: "", email: "", contact: "" });
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrors({});
  };

  const validateForm = () => {
    let errors = {};

    if (newExpertise.cid.length !== 11) errors.cid = "Invalid CID!";
    if (!newExpertise.cid.trim()) errors.cid = "CID is required!";
    if (!newExpertise.name.trim()) errors.name = "Name is required!";
    if (!newExpertise.email.trim()) {
      errors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newExpertise.email)) {
      errors.email = "Invalid email format!";
    }
    if (newExpertise.contact.length !== 8) errors.contact = "Invalid contact number!";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));

    setNewExpertise((prevExpertise) => ({
      ...prevExpertise,
      [field]: value,
    }));
  };

  const confirmAction = (action, expertise) => {
    if (action === "add" || action === "edit") {
      if (!validateForm()) return;
    }
    setConfirmationModal({ action, expertise });
  };

  const executeAction = async () => {
    if (!confirmationModal) return;
    const { action, expertise } = confirmationModal;

    try {
      setLoading(true);

      if (action === "add") {
        const response = await axios.post("http://localhost:8080/signup", {
          name: newExpertise.name,
          email: newExpertise.email,
          contact_no: newExpertise.contact,
          CID: newExpertise.cid,
          role: "expertise",
        });

        setExpertiseList([...expertiseList, response.data]);

      } else if (action === "edit") {
        await axios.put(`http://localhost:8080/api/auth/edit-expertise/${editingExpertise.id}`, newExpertise);
        setExpertiseList(
          expertiseList.map((item) => (item.id === editingExpertise.id ? { ...item, ...newExpertise } : item))
        );
      } else if (action === "delete") {
        await axios.delete(`http://localhost:8080/api/auth/delete-expertise/${expertise.id}`);
        setExpertiseList(expertiseList.filter((item) => item.id !== expertise.id));
      }

      fetchExpertise();

      // After a successful action, show the success modal
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error executing action:", error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }

    setConfirmationModal(null);
    setModalVisible(false);
    setNewExpertise({ cid: "", name: "", email: "", contact: "" });
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);  // Close the success modal
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Expertise Management</h2>
      <button className="add-expertise-btn" onClick={() => openModal()}>
        <FaPlus /> Add Expertise
      </button>
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>CID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-text">Loading...</td>
              </tr>
            ) : (
              expertiseList
                .filter((expertise) =>
                  expertise.name && expertise.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((expertise) => (
                  <tr key={expertise._id}> {/* Use _id or unique identifier from your expertise data */}
                    <td>{expertise.CID}</td>
                    <td>{expertise.name}</td>
                    <td>{expertise.email}</td>
                    <td>{expertise.contact}</td>
                    <td className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => openModal(expertise)}>
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => confirmAction("delete", expertise)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalVisible && !confirmationModal && (
        <div className="modal-overlay fade-in">
          <div className="modal">
            <h3>{editingExpertise ? "Edit Expertise" : "Add Expertise"}</h3>
            <input
              type="text"
              placeholder="CID"
              value={newExpertise.cid}
              onChange={(e) => handleInputChange("cid", e.target.value.replace(/\D/g, "").slice(0, 11))}
            />
            {errors.cid && <p className="error-text">{errors.cid}</p>}

            <input
              type="text"
              placeholder="Name"
              value={newExpertise.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <input
              type="email"
              placeholder="Email"
              value={newExpertise.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input
              type="text"
              placeholder="Contact"
              value={newExpertise.contact}
              onChange={(e) => handleInputChange("contact", e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
            {errors.contact && <p className="error-text">{errors.contact}</p>}

            <div className="modal-buttons">
              <button className="update-btn" onClick={() => confirmAction(editingExpertise ? "edit" : "add")}>
                {editingExpertise ? "Update" : "Register"}
              </button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="modal-overlay fade-in">
          <div className="cmodal">
            <h3>Confirmation</h3>
            <p>Are you sure you want to {confirmationModal.action} this expertise?</p>
            <div className="modal-buttons">
              <button className="update-btn" onClick={executeAction}>Yes</button>
              <button className="cancel-btn" onClick={() => setConfirmationModal(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalVisible && (
        <div className="modal-overlay fade-in">
          <div className="modal success-modal">
            <h3>Success!</h3>
            <p>The expertise was successfully registered.</p>
            <button className="close-btn" onClick={closeSuccessModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertiseMngt;
