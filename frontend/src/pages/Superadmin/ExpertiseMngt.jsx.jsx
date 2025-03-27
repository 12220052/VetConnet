import React, { useState } from "react";
import { FaPlus, FaTable, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../astyles.css";

const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([
    { id: 1, cid: "10005006789", name: "Karma Dctj1", email: "karmadcjr@moul.gov.kt", contact: "17677890", employeeid: "1090500" },
    { id: 2, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891", employeeid: "1099500" },
    { id: 3, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892", employeeid: "1090509" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(null);
  const [newExpertise, setNewExpertise] = useState({
    cid: "", name: "", email: "", contact: "", employeeid: "",
  });

  const openModal = (expertise = null) => {
    setEditingExpertise(expertise);
    setNewExpertise(expertise || { cid: "", name: "", email: "", contact: "", employeeid: "" });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    if (editingExpertise) {
      // Update existing expertise
      setExpertiseList(expertiseList.map(item => (item.id === editingExpertise.id ? { ...item, ...newExpertise } : item)));
    } else {
      // Add new expertise and prepend it to the top of the list
      setExpertiseList(prevExpertiseList => [
        { id: Date.now(), ...newExpertise }, 
        ...prevExpertiseList
      ]);
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
              <th>Employee ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expertiseList.filter(expertise => expertise.name.toLowerCase().includes(searchTerm.toLowerCase())).map((expertise) => (
              <tr key={expertise.id}>
                <td>{expertise.cid}</td>
                <td>{expertise.name}</td>
                <td>{expertise.email}</td>
                <td>{expertise.contact}</td>
                <td>{expertise.employeeid}</td>
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

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingExpertise ? "Edit Expertise" : "Add Expertise"}</h3>
            <div className="modal-inputs">
              <div className="input-column">
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
              </div>
              <div className="input-column">
                <input
                  type="text"
                  placeholder="Contact"
                  value={newExpertise.contact}
                  onChange={(e) => setNewExpertise({ ...newExpertise, contact: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={newExpertise.employeeid}
                  onChange={(e) => setNewExpertise({ ...newExpertise, employeeid: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="update-btn" onClick={handleSave}>Register</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertiseMngt;
