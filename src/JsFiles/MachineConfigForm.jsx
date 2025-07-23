import React, { useState } from "react";
import axios from "axios";

const MachineConfigForm = () => {
  const [formData, setFormData] = useState({
    machineCode: "",
    machineName: "",
    unit: "cm",
    maxCuttingLength: "",
    minCuttingLength: "",
    maxDeckle: "",
    minDeckle: "",
    noOfSheetsPerHour: "",
    noOfBoxPerHour: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/machine/config",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("✅ " + response.data);
    } catch (error) {
      setMessage("❌ Error: " + error.response?.data || "Server error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Configure Machine</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          { label: "Machine Code", name: "machineCode" },
          { label: "Machine Name", name: "machineName" },
          { label: "Unit ", name: "unit" },
          { label: "Max Cutting Length", name: "maxCuttingLength", type: "number" },
          { label: "Min Cutting Length", name: "minCuttingLength", type: "number" },
          { label: "Max Deckle", name: "maxDeckle", type: "number" },
          { label: "Min Deckle", name: "minDeckle", type: "number" },
          { label: "Sheets Per Hour", name: "noOfSheetsPerHour", type: "number" },
          { label: "Boxes Per Hour", name: "noOfBoxPerHour", type: "number" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Submit Configuration
          </button>
        </div>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default MachineConfigForm;
