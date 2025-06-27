import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeRegisterForm = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    unit: "",
    gender: "",
    phoneNumber: "",
    bloodGroup: "",
    dob: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setError(null);       
  
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Authentication token missing. Please log in.");
        setIsSubmitting(false);
        return;
      }
  
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/register-employee",
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`  
          }
        }
      );

      
      
      navigate(`/admin/dashboard/salary/register/${response.data.employeeId}`, {
        state: {
          employeeId: response.data.employeeId, 
          barcodeId: response.data.barcodeId,
          barcodeImage: response.data.barcodeImageBase64
        }
      });

      
      
      
    } catch (err) {
      if (err.response) {
        console.error("Error Response:", err.response);
        setError(err.response.data || "An error occurred while registering the employee.");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        setError("No response from server. Please check your network connection.");
      } else {
        console.error("Request Error:", err.message);
        setError("Error in request setup.");
      }
    } finally {
      setIsSubmitting(false); 
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 sm:p-10 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Register New Employee</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 text-center shadow-md" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={employee.name} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="email" name="email" placeholder="Email Address" value={employee.email} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="text" name="unit" placeholder="Assigned Unit" value={employee.unit} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="text" name="gender" placeholder="Gender (Male/Female/Other)" value={employee.gender} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={employee.phoneNumber} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="text" name="bloodGroup" placeholder="Blood Group (e.g., A+, O-)" value={employee.bloodGroup} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
          <input type="date" name="dob" placeholder="Date of Birth" value={employee.dob} onChange={handleChange} required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />

          <button type="submit" disabled={isSubmitting}
            className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                       disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            {isSubmitting ? 'Registering...' : 'Register Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegisterForm;