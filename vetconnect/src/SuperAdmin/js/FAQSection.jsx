import React from 'react'
import { useState } from 'react';

import { FaEdit, FaTrash } from "react-icons/fa";
const FAQSection = () => {
    const [faqs, setFaqs] = useState([
      { id: 1, question: "How do I book an appointment?", answer: "Booking an appointment..", enabled: true },
      { id: 2, question: "What services do you offer?", answer: "We offer pet check-ups..", enabled: false },
    ]);
  
    const toggleFAQ = (id) => {
      setFaqs(faqs.map(faq => faq.id === id ? { ...faq, enabled: !faq.enabled } : faq));
    };
  
    return (
      <div className="table-container">
        <button className="add-expertise-btn">Add FAQ</button>
        <table className="table">
          <thead>
            <tr>
              <th>Q.No</th>
              <th>Questions</th>
              <th>Answers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq, index) => (
              <tr key={faq.id}>
                <td>{index + 1}</td>
                <td>{faq.question}</td>
                <td>{faq.answer}</td>
                <td className="action-buttons">
                  <button 
                    className={`action-btn ${faq.enabled ? "save-btn" : "delete-btn"}`}
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    {faq.enabled ? "Disable" : "Enable"}
                  </button>
                  <button className="action-btn edit-btn"><FaEdit /></button>
                  <button className="action-btn delete-btn"><FaTrash /></button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
export default FAQSection