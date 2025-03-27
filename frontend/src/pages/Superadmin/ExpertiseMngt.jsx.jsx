import React, { useState } from "react";
import { FaPlus, FaTable, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../astyles.css";

const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([
    { id: 1, cid: "10005006789", name: "Karma Dctj1", email: "karmadcjr@moul.gov.kt", contact: "17677890", expertise: "Veterinary Medicine" },
    { id: 2, cid: "10005006790", name: "Pema Zangmo", email: "pema@moul.gov.kt", contact: "17677891", expertise: "Animal Surgery" },
    { id: 3, cid: "10005006791", name: "Sonam Wangchuk", email: "sonam@moul.gov.kt", contact: "17677892", expertise: "Pet Nutrition" },
  ]);

  const filteredExpertise = expertiseList.filter((expertise) =>
    expertise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setExpertiseList(expertiseList.filter((item) => item.id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <FaTable className="table-title-icon" /> Expertise Management
      </h2>

      <button className="add-expertise-btn">
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
        <h3 className="table-title">
          <FaTable className="table-title-icon" /> Expertise List
        </h3>
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
            {filteredExpertise.length > 0 ? (
              filteredExpertise.map((expertise) => (
                <tr key={expertise.id}>
                  <td>{expertise.cid}</td>
                  <td>{expertise.name}</td>
                  <td>{expertise.email}</td>
                  <td>{expertise.contact}</td>
                  <td>{expertise.expertise}</td>
                  <td className="action-buttons">
                    <button className="action-btn edit-btn">
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(expertise.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No expertise found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpertiseMngt;
