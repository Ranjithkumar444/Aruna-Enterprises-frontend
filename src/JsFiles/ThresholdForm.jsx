import React, { useState } from 'react';
import axios from 'axios';

const ThresholdForm = () => {
  const [formData, setFormData] = useState({
    deckle: '',
    gsm: '',
    minWeightThreshold: '',
    unit: 'A',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Admin token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/reel/stock/alert",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Threshold saved successfully!");
      setFormData({
        deckle: '',
        gsm: '',
        minWeightThreshold: '',
        unit: 'A',
      });
    } catch (error) {
      console.error("Error saving threshold:", error);
      if (error.response?.status === 409) {
        alert("Threshold already exists for this deckle, GSM, and unit.");
      } else {
        alert("Failed to save threshold.");
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Set Reel Stock Threshold</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Deckle</label>
          <input
            type="number"
            name="deckle"
            value={formData.deckle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">GSM</label>
          <input
            type="number"
            name="gsm"
            value={formData.gsm}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Min Weight Threshold (kg)</label>
          <input
            type="number"
            name="minWeightThreshold"
            value={formData.minWeightThreshold}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="A">Unit A</option>
            <option value="B">Unit B</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Threshold
        </button>
      </form>
    </div>
  );
};

export default ThresholdForm;
