import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import { FaPlus, FaTable, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../css/astyles.css";
import AdminHeader from "./Header";
import SuperAdminSidebar from "./Sidebar";

const  ManageVet= () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vetList, setVetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleCounts, setRoleCounts] = useState([]);
  
  const navigate = useNavigate();
 // Retrieve user role

  // Redirect if user is not an admin or super admin
  useEffect(() => {
    const fetchVet = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve token from local storage
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:8080/vets", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });
        setVetList(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error)
        setError("Failed to fetch vet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchVet();
  }, []);
  

  return (
    <div className="app-container flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="dashboard-container">
        
          <div className="table-container">
          <h3 style={{padding:"20px"}}>Approved Vets</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : vetList.length === 0 ? (
              <p>No vets registered.</p>
            ) : (
              <table className="table">
         
                <thead>
                  <tr>
                    <th>CID Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Vet License</th>
                    <th>Specialist</th>
                    <th>Location</th>
                    <th>Certifications</th>
                    <th>Actions</th>
                 
                  </tr>
                </thead>
                <tbody>
                  {vetList.approved
                    .filter((vet) =>
                      vet.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((vet) => (
                      <tr key={vet.id}>
                        <td>{vet.CID}</td>
                        <td>{vet.name}</td>
                        <td>{vet.email}</td>
                        <td>{vet.contact_no}</td>
                        <td>{vet.vet_license}</td>
                        <td>{vet.specialist}</td>
                        <td>{vet.location}</td>
                        <td>{vet.certifications}</td>                    
                         <td className="action-buttons">
                                                
                             <button className="action-btn edit-btn">
                                 <FaEdit />
                             </button>
                                                
                              <button className="action-btn delete-btn" >
                                <FaTrash />
                             </button>
                                                  
                              </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVet;
