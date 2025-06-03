import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/IndustryForm.css"

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
    <div className="industry-form-container">
      <h2>Register New Industry</h2>
      <form className="industry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="industryName"
          placeholder="Industry Name"
          value={industry.industryName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sector"
          placeholder="Sector"
          value={industry.sector}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={industry.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={industry.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={industry.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default IndustryForm;