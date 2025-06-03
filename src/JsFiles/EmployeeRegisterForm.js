import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeRegisterForm = () => {
  const navigate = useNavigate();
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    unit: "",
    gender: "",
    phoneNumber: "",
    bloodGroup: "",
    dob: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("adminToken");
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/register-employee`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`  
          }
        }
      );

      setBarcodeInfo({
        employeeId: response.data.employeeId,
        barcodeId: response.data.barcodeId,
        barcodeImage: response.data.barcodeImageBase64
      });
      
      navigate(`/admin/dashboard/salary/register/${response.data.employeeId}`, {
        state: {
          barcodeId: response.data.barcodeId,
          barcodeImage: response.data.barcodeImageBase64
        }
      });
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data}`);
      } else {
        alert("An error occurred while registering the employee.");
      }
    }
  };
  

  return (
    <div className="register-container">
      <h2>Register New Employee</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={employee.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} required />
        <input type="text" name="unit" placeholder="Unit" value={employee.unit} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={employee.gender} onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={employee.phoneNumber} onChange={handleChange} required />
        <input type="text" name="bloodGroup" placeholder="Blood Group" value={employee.bloodGroup} onChange={handleChange} required />
        <input type="date" name="dob" placeholder="Date of Birth" value={employee.dob} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default EmployeeRegisterForm;