import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filters, setFilters] = useState({
    unit: "",
    gender: "",
    bloodGroup: "",
  });
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/get-employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activeEmployees = response.data.filter(emp => emp.active === true);

        console.log(activeEmployees);

        setEmployees(activeEmployees);
        setFilteredEmployees(activeEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employee data");
      }
    };

    fetchEmployees();
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    let filtered = employees;

    if (filters.unit) {
      filtered = filtered.filter((emp) => emp.unit === filters.unit);
    }
    if (filters.gender) {
      filtered = filtered.filter((emp) => emp.gender === filters.gender);
    }
    if (filters.bloodGroup) {
      filtered = filtered.filter((emp) => emp.bloodGroup === filters.bloodGroup);
    }

    setFilteredEmployees(filtered);
  };

  const handleReset = () => {
    setFilters({ unit: "", gender: "", bloodGroup: "" });
    setFilteredEmployees(employees);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-8 drop-shadow-sm">
          Active Employee List
        </h2>

        <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
          <select
            name="unit"
            value={filters.unit}
            onChange={handleFilterChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 bg-white min-w-[120px]"
          >
            <option value="">All Units</option>
            <option value="A">Unit A</option>
            <option value="B">Unit B</option>
          </select>

          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 bg-white min-w-[120px]"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <select
            name="bloodGroup"
            value={filters.bloodGroup}
            onChange={handleFilterChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 bg-white min-w-[150px]"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <button
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            onClick={handleFilter}
          >
            Apply Filters
          </button>
          <button
            className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>

        {filteredEmployees.length === 0 ? (
          <p className="text-center text-lg text-gray-600 py-8">
            No active employees found matching your criteria.
          </p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th> {/* Corrected from Joined to Birth */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition duration-150'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.barcodeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">{emp.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.joinedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.bloodGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.dob}</td>
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

export default EmployeeDetails;