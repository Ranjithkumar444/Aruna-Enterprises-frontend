import React, { useEffect, useState } from 'react';
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true); 
      setError(null);   
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/get-admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(response.data);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError("Failed to fetch admin data. Please try again."); 
      } finally {
        setLoading(false); 
      }
    };

    fetchAdmins();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight md:text-5xl">
          Admin List
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-700">Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative text-center shadow-md mb-8">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 font-medium">No admins found.</p>
            <p className="text-md text-gray-500 mt-2">You can create new admins from the Admin Management section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">First Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminList;