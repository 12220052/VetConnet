import React, { useState } from "react";
import SuperAdminSidebar from "./Sidebar";
import AdminHeader from "./Header";
import "../css/rstyle.css";
import { FaTimes } from 'react-icons/fa';
import { Box, Button, TextField } from "@mui/material"; // Make sure to import MUI components

const RefundForms = () => {
  const [refundList] = useState([
    {
      id: 1,
      appointment_id: "10905",
      vet_id: "10905006789",
      appointment_date: "10/03/2025",
      cancellation_reason: "Pet not well",
      form_submitted: "08/03/2025",
      account_details: {
        bank_type: "Bank A",
        account_number: "1234567890",
        account_holder_name: "John Doe",
        amount: "100.00",
        payment_status: "Pending",
      },
    },
    {
      id: 2,
      appointment_id: "10906",
      vet_id: "10905006790",
      appointment_date: "11/03/2025",
      cancellation_reason: "Owner unavailable",
      form_submitted: "09/03/2025",
      account_details: {
        bank_type: "Bank B",
        account_number: "9876543210",
        account_holder_name: "Jane Smith",
        amount: "150.00",
        payment_status: "Approved",
      },
    },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Add this line for the success modal
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);

  const handleRefundClick = (refund) => {
    setSelectedAccount(refund.account_details);
    setShowAccountModal(true);
  };

  const handleRefund = () => {
    // Redirect to /payment after clicking refund
    window.location.href = "/payment";
  };

  const handleRejectClick = (refund) => {
    setSelectedRefund(refund);
    setShowConfirmModal(true);
  };

  const confirmReject = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true); // Show success modal after rejecting

    // Simulate rejection logic here
    console.log("Refund rejected:", selectedRefund);
  };

  return (
    <div className="app-container flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="dashboard-container p-6">
          <h2 className="dashboard-title">Refund Form</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Appointment_ID</th>
                <th className="px-4 py-2">Vet_ID</th>
                <th className="px-4 py-2">Appointment_Date</th>
                <th className="px-4 py-2">Cancellation_Reason</th>
                <th className="px-4 py-2">Form_Submitted</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {refundList.map((refund) => (
                <tr key={refund.id} className="text-center border-t">
                  <td className="px-4 py-2">{refund.appointment_id}</td>
                  <td className="px-4 py-2">{refund.vet_id}</td>
                  <td className="px-4 py-2">{refund.appointment_date}</td>
                  <td className="px-4 py-2">{refund.cancellation_reason}</td>
                  <td className="px-4 py-2">{refund.form_submitted}</td>
                  <td className="action px-4 py-2">
                    <button className="refund" onClick={() => handleRefundClick(refund)}>
                      Refund
                    </button>
                    <button className="reject" onClick={() => handleRejectClick(refund)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Account Details Modal */}
          {showAccountModal && selectedAccount && (
            <div className="modal-overlay inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="modal-box bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full relative">
                <h3 className="font-semibold text-xl mb-4">Client Account Details</h3>
                  {/* Close Icon */}
                  <button
                  onClick={() => setShowAccountModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    position: 'absolute',
                    fontSize: '1.5rem',
                    top: '80px',
                    right: '420px',
                    color: '#333',
                    cursor: 'pointer',
                    zIndex: 1000, // Ensure it's on top
                  }}
                >
                  <FaTimes /> {/* Font Awesome cross icon from react-icons */}
                </button>
                <TextField
                  fullWidth
                  label="Bank Type"
                  value={selectedAccount.bank_type}
                  disabled
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Account Number"
                  value={selectedAccount.account_number}
                  disabled
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={selectedAccount.account_holder_name}
                  disabled
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Amount"
                  value={selectedAccount.amount}
                  disabled
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Payment Status"
                  value={selectedAccount.payment_status}
                  disabled
                  margin="dense"
                />
                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefund}
                    sx={{ width: "50%", backgroundColor: "#6DC5EE" }}
                  >
                    Refund
                  </Button>
                </Box>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full">
                <p className="text-green-600 text-lg font-bold mb-4">Refund successfully rejected!</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
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

export default RefundForms;
