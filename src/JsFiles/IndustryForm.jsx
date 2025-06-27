import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const IndustryForm = () => {
  const [industry, setIndustry] = useState({
    industryName: "",
    city: "",
    sector: "",
    state: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIndustry({ ...industry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("No token found. Please login first.");
      return;
    }

    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/register-industry",
        industry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      alert(`Success: ${response.data}`);
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data}`);
      } else if (error.request) {
        alert("No response from server.");
      } else {
        alert("Error in request setup.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 drop-shadow-sm">
          Register New Industry
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="industryName"
            placeholder="Industry Name"
            value={industry.industryName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
          />
          <input
            type="text"
            name="sector"
            placeholder="Sector"
            value={industry.sector}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={industry.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={industry.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={industry.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Register Industry
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndustryForm;