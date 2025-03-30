import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTable, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../astyles.css";

const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(null);
  const [newExpertise, setNewExpertise] = useState({
    cid: "",
    name: "",
    email: "",
    contact: "",
  });

  // Fetch expertise list from the backend
  const fetchExpertise = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/expertise");
      console.log("Response Data:", response.data); // Log the data to check what you're getting
      setExpertiseList(response.data); // Set the fetched data to expertiseList
    } catch (error) {
      console.error("Error fetching expertise:", error.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchExpertise(); // Initial fetch
  }, []);

  const openModal = (expertise = null) => {
    setEditingExpertise(expertise);
    setNewExpertise(expertise || { cid: "", name: "", email: "", contact: "" });
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);
  const closeSuccessModal = () => setSuccessModal(false);

  const confirmAction = (action, expertise) => {
    setConfirmationModal({ action, expertise });
  };

  const executeAction = async () => {
    if (!confirmationModal) return;
    const { action, expertise } = confirmationModal;

    try {
      if (action === "add") {
        const response = await axios.post("http://localhost:8080/api/auth/add-expertise", newExpertise);
        setExpertiseList([...expertiseList, response.data]); // Add the new expertise to the list
      } else if (action === "edit") {
        await axios.put(`http://localhost:8080/api/auth/edit-expertise/${editingExpertise.id}`, newExpertise);
        setExpertiseList(
          expertiseList.map((item) =>
            item.id === editingExpertise.id ? { ...item, ...newExpertise } : item
          )
        );
      } else if (action === "delete") {
        await axios.delete(`http://localhost:8080/api/auth/delete-expertise/${expertise.id}`);
        setExpertiseList(expertiseList.filter((item) => item.id !== expertise.id)); // Remove the expertise from the list
      }

      // Re-fetch expertise list to ensure it's up-to-date after the action
      fetchExpertise();

      setSuccessModal(true);
      setTimeout(closeSuccessModal, 300); // Close success modal after 300ms
    } catch (error) {
      console.error("Error executing action:", error.response?.data?.error || "Something went wrong");
    }

    setConfirmationModal(null);
    setModalVisible(false);
    setNewExpertise({ cid: "", name: "", email: "", contact: "" }); // Reset the form
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <FaTable className="table-title-icon" /> Expertise Management
      </h2>
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
              <th>CID Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expertiseList
              .filter((expertise) =>
                expertise.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((expertise) => (
                <tr key={expertise.id}>
                  <td>{expertise.cid}</td>
                  <td>{expertise.name}</td>
                  <td>{expertise.email}</td>
                  <td>{expertise.contact}</td>
                  <td className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openModal(expertise)}
                    >
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
              ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingExpertise ? "Edit Expertise" : "Add Expertise"}</h3>
            <input
              type="text"
              placeholder="CID Number"
              value={newExpertise.cid}
              onChange={(e) => setNewExpertise({ ...newExpertise, cid: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name"
              value={newExpertise.name}
              onChange={(e) => setNewExpertise({ ...newExpertise, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newExpertise.email}
              onChange={(e) => setNewExpertise({ ...newExpertise, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact"
              value={newExpertise.contact}
              onChange={(e) => setNewExpertise({ ...newExpertise, contact: e.target.value })}
            />
            <div className="modal-buttons">
              <button
                className="update-btn"
                onClick={() => confirmAction(editingExpertise ? "edit" : "add")}
              >
                {editingExpertise ? "Update" : "Register"}
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure?</h3>
            <div className="modal-buttons centered">
              <button className="confirm-btn" onClick={executeAction}>
                Yes
              </button>
              <button className="cancel-btn" onClick={() => setConfirmationModal(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="modal-overlay">
          <div className="modal success-modal">
            <h3>Action Successful!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertiseMngt;
