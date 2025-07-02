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
    gender: "",
    role: "ROLE_ADMIN"
  });

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setError(null);       

    const token = localStorage.getItem("adminToken");

    if (!token) {
        setError("Authentication token missing. Please log in.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/create",
        admin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert(`Success: ${response.data.firstName} registered!`); 
      navigate("/admin/dashboard/admin/admins/get-all-admins"); 
    } catch (err) {
      if (err.response) {
        console.error("Error Response:", err.response);
        setError(err.response.data.message || "Something went wrong during registration!");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6 sm:p-10 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Register New Admin</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 text-center shadow-md" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            value={admin.userName}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={admin.firstName}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={admin.lastName}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={admin.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={admin.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={admin.phoneNumber}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={admin.gender}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />

          <select
            name="role"
            value={admin.role}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm bg-white"
          >
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_SUPER_ADMIN">Super Admin</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                       disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterForm;