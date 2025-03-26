// Dashboard.js
import React from "react";

const SuperAdminDashboard = () => {
  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Hi, Dechen</h1>

      {/* Stats Section */}
      <div className="stats-grid grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Veterinarian</h2>
          <p className="text-3xl">20</p>
        </div>
        <div className="stat-card p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Application</h2>
          <p className="text-3xl">40</p>
        </div>
        <div className="stat-card p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Report</h2>
          <p className="text-3xl">8</p>
        </div>
      </div>

      {/* Veterinarians Application Request Table */}
      <div className="vet-application-request">
        <h2 className="text-lg font-semibold mb-4">Veterinarians Application Request</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">CID Number</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Placement</th>
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">File Attached</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">10005006789</td>
              <td className="border p-2">Karma Dctj1</td>
              <td className="border p-2">karmadcjr@moul.gov.kt</td>
              <td className="border p-2">17677890</td>
              <td className="border p-2">National Veterinary Hospital</td>
              <td className="border p-2">10000768</td>
              <td className="border p-2 text-center">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">View</button>
              </td>
            </tr>
            {/* Repeat rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;