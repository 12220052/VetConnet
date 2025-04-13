import React, { useState } from "react";

const WebFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Kinga Lhazom", email: "kinga@gmail.com", phone: "17677890", active: true, message: "Great website!" },
    { id: 2, name: "Sonam Dorji", email: "sonam@gmail.com", phone: "17677880", active: true, message: "Very useful information." },
    { id: 3, name: "Pema Wangchuk", email: "pema@gmail.com", phone: "17677870", active: false, message: "Needs improvement." },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const toggleActive = (id) => {
    setFeedbacks(feedbacks.map(feedback =>
      feedback.id === id ? { ...feedback, active: !feedback.active } : feedback
    ));
  };

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Expertise Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Sl.no</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">Feedback</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr key={feedback.id} className="text-center">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{feedback.name}</td>
              <td className="border p-2">{feedback.email}</td>
              <td className="border p-2">{feedback.phone}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
                  onClick={() => openModal(feedback)}
                  disabled={!feedback.active}
                >
                  View
                </button>
              </td>
              <td className="border p-2 flex justify-center gap-2">
                <input 
                  type="checkbox" 
                  checked={feedback.active} 
                  onChange={() => toggleActive(feedback.id)}
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {modalVisible && selectedFeedback && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <p>{selectedFeedback.message}</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebFeedback;