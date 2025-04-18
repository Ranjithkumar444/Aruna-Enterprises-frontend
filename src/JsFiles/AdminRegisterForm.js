import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegisterForm = () => {
  const [admin, setAdmin] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    console.log("🔐 Token:", token);
    console.log("📤 Sending admin data:", admin);

    try {
      const response = await axios.post("http://localhost:8080/admin/create", admin, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      alert(`✅ Success: ${response.data.firstName} registered!`);
      navigate("/admin/dashboard"); // or wherever you want to go
    } catch (error) {
      if (error.response) {
        console.error("❌ Error Response:", error.response);
        alert(`❌ ${error.response.data.message || "Something went wrong!"}`);
      } else if (error.request) {
        console.error("❌ No response from server:", error.request);
        alert("No response from server.");
      } else {
        console.error("❌ Request Error:", error.message);
        alert("Error in request setup.");
      }
    }
  };

  return (
    <div className="register-container" style={containerStyle}>
      <h2>Register New Admin</h2>
      <form className="register-form" onSubmit={handleSubmit} style={formStyle}>
        <input type="text" name="userName" placeholder="User Name" value={admin.userName} onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="First Name" value={admin.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={admin.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={admin.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={admin.password} onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={admin.phoneNumber} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={admin.gender} onChange={handleChange} required />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
    </div>
  );
};

// Inline styles (or you can use a CSS file)
const containerStyle = {
  maxWidth: "400px",
  margin: "40px auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default AdminRegisterForm;
