import React from "react";

const VetApplication = () => {
  return (
    <div className="vet-application-container p-4">
      <h1 className="text-2xl font-bold">Veterinarian Applications</h1>
      <table className="w-full mt-4 border-collapse border border-gray-300">
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
            <td className="border p-2">10905006789</td>
            <td className="border p-2">Karma Dorji</td>
            <td className="border p-2">karmadorji@moaf.gov.bt</td>
            <td className="border p-2">17677890</td>
            <td className="border p-2">National Veterinary Hospital</td>
            <td className="border p-2 italic">10009768</td>
            <td className="border p-2 text-center">
              <button className="bg-blue-500 text-white px-4 py-1 rounded">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VetApplication;
