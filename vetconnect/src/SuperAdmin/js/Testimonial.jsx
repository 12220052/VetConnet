import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/astyles.css";
import AdminHeader from "./Header";
import SuperAdminSidebar from "./Sidebar";

const Testimonial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [TestimonialList, setTestimonialList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleStates, setToggleStates] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/getTestimonials", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTestimonialList(response.data.testimonials);

        // Initialize toggle state
        const initialToggles = {};
        response.data.testimonials.forEach((t) => {
          initialToggles[t._id] = true; // or false depending on default state
        });
        setToggleStates(initialToggles);
      } catch (error) {
        setError("Failed to fetch testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="app-container flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="dashboard-container p-6">
          <h2 className="dashboard-title text-2xl font-bold mb-6">Testimonials</h2>

          <div className="table-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : TestimonialList.length === 0 ? (
              <p>No Testimonials.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Review</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TestimonialList.filter((t) =>
                    t.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((testimony) => (
                    <tr key={testimony._id}>
                      <td>{testimony.name}</td>
                      <td>{testimony.email}</td>
                      <td>{testimony.Review}</td>
                      <td>
                      <label className="switch">
  <input
    type="checkbox"
    checked={toggleStates[testimony._id]}
    onChange={() =>
      setToggleStates((prevState) => ({
        ...prevState,
        [testimony._id]: !prevState[testimony._id],
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
