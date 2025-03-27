import React, { useState } from "react";
import { FaPlus, FaTable, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../astyles.css"; // Assuming this is your CSS file for styling

const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([
    { id: 1, cid: "10005006789", name: "Karma Dctj1", email: "karmadcjr@moul.gov.kt", contact: "17677890", expertise: "Veterinary Medicine" },
    { id: 2, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891", expertise: "Animal Surgery" },
    { id: 3, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892", expertise: "Pet Nutrition" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(null);
  const [newExpertise, setNewExpertise] = useState({
    cid: "", name: "", email: "", contact: "", expertise: "",
  });

  const openModal = (expertise = null) => {
    setEditingExpertise(expertise);
    setNewExpertise(expertise || { cid: "", name: "", email: "", contact: "", expertise: "" });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    if (editingExpertise) {
      setExpertiseList(expertiseList.map(item => (item.id === editingExpertise.id ? newExpertise : item)));
    } else {
      setExpertiseList([{ id: Date.now(), ...newExpertise }, ...expertiseList]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setExpertiseList(expertiseList.filter((item) => item.id !== id));
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
              <th>Contact Number</th>
              <th>Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expertiseList.map((expertise) => (
              <tr key={expertise.id}>
                <td>{expertise.cid}</td>
                <td>{expertise.name}</td>
                <td>{expertise.email}</td>
                <td>{expertise.contact}</td>
                <td>{expertise.expertise}</td>
                <td className="action-buttons">
                  <button className="action-btn edit-btn" onClick={() => openModal(expertise)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(expertise.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingExpertise ? "Edit Expertise" : "Add Expertise"}</h3>
            <input type="text" placeholder="CID Number" value={newExpertise.cid} onChange={(e) => setNewExpertise({ ...newExpertise, cid: e.target.value })} />
            <input type="text" placeholder="Name" value={newExpertise.name} onChange={(e) => setNewExpertise({ ...newExpertise, name: e.target.value })} />
            <input type="email" placeholder="Email" value={newExpertise.email} onChange={(e) => setNewExpertise({ ...newExpertise, email: e.target.value })} />
            <input type="text" placeholder="Contact" value={newExpertise.contact} onChange={(e) => setNewExpertise({ ...newExpertise, contact: e.target.value })} />
            <input type="text" placeholder="Expertise" value={newExpertise.expertise} onChange={(e) => setNewExpertise({ ...newExpertise, expertise: e.target.value })} />
            <button className="update-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertiseMngt;
