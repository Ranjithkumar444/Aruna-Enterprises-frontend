import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IndustryForm = () => {
  const [industry, setIndustry] = useState({
    industryName: "",
    industryImage: "",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIndustry({ ...industry, industryImage: reader.result.split(",")[1] }); // Get Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!industry.industryImage) {
      alert("Please provide an industry image.");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("No token found. Please login first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/register-industry",
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
        console.error("Error Response:", error.response);
        alert(`Error: ${error.response.data}`);
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("No response from server.");
      } else {
        console.error("Error in request setup:", error.message);
        alert("Error in request setup.");
      }
    }
  };

  return (
    <div className="register-container" style={containerStyle}>
      <h2>Register New Industry</h2>
      <form className="register-form" onSubmit={handleSubmit} style={formStyle}>
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
        <input
          type="file"
          name="industryImage"
          onChange={handleImageChange}
          required
        />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f4f4f4"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px"
};

export default IndustryForm;
