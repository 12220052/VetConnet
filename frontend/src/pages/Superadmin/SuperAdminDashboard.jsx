import React, { useState } from "react";
import { FaTable, FaEdit, FaTrash } from "react-icons/fa";
import "../../astyles.css"; // Import CSS file

const SuperAdminDashboard = () => {
  const [expertiseList, setExpertiseList] = useState([
    { id: 1, cid: "10005006789", name: "Karma Dctj1", email: "karmadcjr@moul.gov.kt", contact: "17677890"},
    { id: 2, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891"},
    { id: 3, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892"},
    { id: 4, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891"},
    { id: 5, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892" },
    { id: 6, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891"},
    { id: 7, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892"},
  ]);

  const [editExpertise, setEditExpertise] = useState(null);

  const recentExpertise = expertiseList.slice(-6);

  const handleDelete = (id) => {
    setExpertiseList(expertiseList.filter((item) => item.id !== id));
  };

  const handleEdit = (expertise) => {
    setEditExpertise(expertise);
  };

  const handleSave = () => {
    setExpertiseList((prevList) =>
      prevList.map((item) => (item.id === editExpertise.id ? editExpertise : item))
    );
    setEditExpertise(null);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hi, Super Admin</h1>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stats-card">
          <h2 className="stats-title">Total Expertise</h2>
          <p className="stats-number">{expertiseList.length}</p>
        </div>
        <div className="stats-card">
          <h2 className="stats-title">Total Veterinarian</h2>
          <p className="stats-number">40</p>
        </div>
        <div className="stats-card">
          <h2 className="stats-title">Total Client</h2>
          <p className="stats-number">8</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <h2 className="table-title">
          <FaTable className="table-title-icon" /> Recent Expertise
        </h2>

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
            {recentExpertise.length > 0 ? (
              recentExpertise.map((expertise) => (
                <tr key={expertise.id}>
                  <td>
                    {editExpertise?.id === expertise.id ? (
                      <input type="text" value={editExpertise.cid} onChange={(e) => setEditExpertise({ ...editExpertise, cid: e.target.value })} className="table-input" />
                    ) : (
                      expertise.cid
                    )}
                  </td>
                  <td>
                    {editExpertise?.id === expertise.id ? (
                      <input type="text" value={editExpertise.name} onChange={(e) => setEditExpertise({ ...editExpertise, name: e.target.value })} className="table-input" />
                    ) : (
                      expertise.name
                    )}
                  </td>
                  <td>
                    {editExpertise?.id === expertise.id ? (
                      <input type="email" value={editExpertise.email} onChange={(e) => setEditExpertise({ ...editExpertise, email: e.target.value })} className="table-input" />
                    ) : (
                      expertise.email
                    )}
                  </td>
                  <td>
                    {editExpertise?.id === expertise.id ? (
                      <input type="text" value={editExpertise.contact} onChange={(e) => setEditExpertise({ ...editExpertise, contact: e.target.value })} className="table-input" />
                    ) : (
                      expertise.contact
                    )}
                  </td>
                  <td className="action-buttons">
                    {editExpertise?.id === expertise.id ? (
                      <button onClick={handleSave} className="action-btn save-btn">Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(expertise)} className="action-btn edit-btn">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(expertise.id)} className="action-btn delete-btn">
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No expertise found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
