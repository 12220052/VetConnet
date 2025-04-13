import React, { useState, useEffect } from "react";

import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../css/astyles.css";
import "../css/style.css";
import AdminHeader from "./Header";
import SuperAdminSidebar from "./Sidebar";


const ExpertiseMngt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(null);
  const [newExpertise, setNewExpertise] = useState({ CID: "", name: "", email: "", contact_no: "" });
  const [errors, setErrors] = useState({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [addsuccessModalVisible, addsetSuccessModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Fetch expertise data

  const fetchExpertise = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:8080/getExpertise", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpertiseList(response.data);
    } catch (error) {
      setError("Failed to fetch expertise data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExpertise();
  }, []);

  // Delete expertise handler
  const deleteExpertise = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }
  
      await axios.delete(`http://localhost:8080/deleteExpertise/${id}`, {
        headers: { Authorization: `Bearer ${token} `},
      });
  
      setExpertiseList(expertiseList.filter((expertise) => expertise._id !== id));
      setConfirmationModal(null);
    } catch (err) {
      setError("Failed to delete expertise. Please try again.");
    }
  };
  

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setErrors({});
  };
   // Close Success Modal
  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const closeAddSuccessModal = () => {
    addsetSuccessModalVisible(false);
  };
  // Validate form
  const validateForm = () => {
    let errors = {};
    if (newExpertise.CID.length !== 11) errors.CID = "Invalid CID!";
    if (!newExpertise.CID.trim()) errors.CID = "CID is required!";
    if (!newExpertise.name.trim()) errors.name = "Name is required!";
    if (!newExpertise.email.trim()) {
      errors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newExpertise.email)) {
      errors.email = "Invalid email format!";
    }
    if (newExpertise.contact_no.length !== 8) errors.contact_no = "Invalid contact number!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    setNewExpertise((prevExpertise) => ({
      ...prevExpertise,
      [field]: value,
    }));
  };


  const addExpertise = async () => {
    if (!validateForm()) return;
    
    console.log("Sending to backend:", {
      name: newExpertise.name,
      email: newExpertise.email,
      contact_no: newExpertise.contact_no,
      CID: newExpertise.CID,
      role: "expertise",
    });
  
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/signup", {
        name: newExpertise.name,
        email: newExpertise.email,
        contact_no: newExpertise.contact_no,
        CID: newExpertise.CID, 
        role: "expertise",
      });
  
      setExpertiseList([...expertiseList, response.data]);
      addsetSuccessModalVisible(true);
      // addsuccessModalVisible
      closeModal();
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to add expertise. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const editExpertise = async () => {
    // if (!validateForm()) return;
  
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/expertise/${editingExpertise._id}`,
        newExpertise,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      // const updatedList = expertiseList.map((exp) =>
      //   exp._id === editingExpertise._id ? response.data : exp
      // );
      // setExpertiseList(updatedList);
      await fetchExpertise();
      setSuccessModalVisible(true);
      closeModal();
    } catch (error) {
      setError("Failed to update expertise. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const openAddModel = () => {
    setEditingExpertise(null);
    setNewExpertise({ CID: "", name: "", email: "", contact_no: "" });
    setErrors({});
    setModalVisible("add");
  };
  
  const openEditModel = (expertise) => {
    setEditingExpertise(expertise);
    setNewExpertise({
      CID: expertise.CID || "",
      name: expertise.name || "",
      email: expertise.email || "",
      contact_no: expertise.contact_no || "",
    });
    setErrors({});
    setModalVisible("edit");
  };


  return (
    <div className="app-container flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="dashboard-container">
          <h2 className="dashboard-title">Expertise Management</h2>
          <button className="add-expertise-btn" onClick={openAddModel}>
  <FaPlus /> Add Expertise
</button>

          <div className="search-bar">
            <div className="search-input-container">
              {/* <FaSearch className="search-icon" /> */}
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                {expertiseList
                  .filter((expertise) =>
                    expertise?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || "")
                  )
                  .map((expertise) => (
                    <tr key={expertise._id}>
                      <td>{expertise.CID}</td>
                      <td>{expertise.name}</td>
                      <td>{expertise.email}</td>
                      <td>{expertise.contact_no}</td>
                      <td className="action-buttons">
                      <button
  className="action-btn edit-btn"
  onClick={() => openEditModel(expertise)}
>
  <FaEdit />
</button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => setConfirmationModal({ action: "delete", expertise })}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {confirmationModal && confirmationModal.action === "delete" && (
  <div className="modal-overlay fade-in">
    <div className="modal" style={{ textAlign: "center", padding: "2rem", borderRadius: "12px", backgroundColor: "#00000", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <h3  style={{ color: "#113047", fontSize: "1.5rem", marginBottom: "1rem" }}>Confirmation</h3>
      <p style={{ fontSize: "1rem", color: "#374151", marginBottom: "1.5rem" }}>Are you sure you want to delete this expertise?</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button
          className="update-btn"
          onClick={() => deleteExpertise(confirmationModal.expertise._id)}
          style={{
            // padding: "0.5rem 1rem",
            backgroundColor: "#16a34a",
            color: "white",
            width:'110px',
            height:"30px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
        >
          Yes
        </button>
        <button className="cancel-btn" onClick={() => setConfirmationModal(null)} 
           style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#16a34a",
            color: "white",
            width:'110px',
            height:"30px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}>
          No
        </button>
      </div>
    </div>

         

  </div>
)}

        {/* Add Expertise Modal */}
{modalVisible === "add" && (
  <div className="modal-overlay fade-in">
    <div className="modal">
      <h3>Add Expertise</h3>
      <input
        type="text"
        placeholder="CID"
        value={newExpertise.CID}
        onChange={(e) =>
          handleInputChange("CID", e.target.value.replace(/\D/g, "").slice(0, 11))
        }
      />
      {errors.CID && <p className="error-text">{errors.CID}</p>}

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
        value={newExpertise.contact_no}
        onChange={(e) =>
          handleInputChange("contact_no", e.target.value.replace(/\D/g, "").slice(0, 8))
        }
      />
      {errors.contact_no && <p className="error-text">{errors.contact_no}</p>}

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className="update-btn" onClick={addExpertise}>
          Register
        </button>
        <button className="cancel-btn" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Edit Expertise Modal */}
{modalVisible === "edit" && (
  <div className="modal-overlay fade-in">
    <div className="modal">
      <h3>Edit Expertise</h3>
      <input
        type="text"
        placeholder="CID"
        value={newExpertise.CID}
        onChange={(e) =>
          handleInputChange("CID", e.target.value.replace(/\D/g, "").slice(0, 11))
        }
      />
      {errors.CID && <p className="error-text">{errors.CID}</p>}

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
        readOnly 
      />
      {errors.email && <p className="error-text">{errors.email}</p>}

      <input
        type="text"
        placeholder="Contact"
        value={newExpertise.contact_no}
        onChange={(e) =>
          handleInputChange("contact_no", e.target.value.replace(/\D/g, "").slice(0, 8))
        }
      />
      {errors.contact_no && <p className="error-text">{errors.contact_no}</p>}

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className="update-btn" onClick={editExpertise}>
          Update
        </button>
        <button className="cancel-btn" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


          {/* Success Modal */}
          {successModalVisible && (
           <div className="modal-overlay fade-in">
           <div className="modal success-modal" style={{ textAlign: "center", padding: "2rem", borderRadius: "12px", backgroundColor: "#00000", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
             <h3 style={{ color: "#16a34a", fontSize: "1.5rem", marginBottom: "1rem" }}>Success!</h3>
             <p style={{ fontSize: "1rem", color: "#374151", marginBottom: "1.5rem" }}>
               The expertise was successfully updated.
             </p>
             <button
               className="close-btn"
               onClick={closeSuccessModal}
               style={{
                 padding: "0.5rem 1rem",
                 backgroundColor: "#16a34a",
                 color: "white",
                 border: "none",
                 borderRadius: "6px",
                 cursor: "pointer",
                 fontWeight: "bold",
                 transition: "background-color 0.2s ease-in-out",
               }}
               onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
               onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
             >
               OK
             </button>
           </div>
         </div>
         
          )}

           {/* Success Modal */}
           {addsuccessModalVisible && (
           <div className="modal-overlay fade-in">
           <div className="modal success-modal" style={{ textAlign: "center", padding: "2rem", borderRadius: "12px", backgroundColor: "#00000", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
             <h3 style={{ color: "#16a34a", fontSize: "1.5rem", marginBottom: "1rem" }}>Success!</h3>
             <p style={{ fontSize: "1rem", color: "#374151", marginBottom: "1.5rem" }}>
               The expertise was successfully registered.
             </p>
             <button
               className="close-btn"
               onClick={closeAddSuccessModal}
               style={{
                 padding: "0.5rem 1rem",
                 backgroundColor: "#16a34a",
                 color: "white",
                 border: "none",
                 borderRadius: "6px",
                 cursor: "pointer",
                 fontWeight: "bold",
                 transition: "background-color 0.2s ease-in-out",
               }}
               onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
               onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
             >
               OK
             </button>
           </div>
         </div>
         
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertiseMngt;