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
        const response = await axios.get("http://localhost:8080/admin/get-employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
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
    <div className="employee-details-container">
      <h2>Employee List</h2>

      <div className="filters">
        <select name="unit" value={filters.unit} onChange={handleFilterChange}>
          <option value="">All Units</option>
          <option value="A">Unit A</option>
          <option value="B">Unit B</option>
        </select>

        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>

        <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}>
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

        <button className="filter-btn" onClick={handleFilter}>Filter</button>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      {filteredEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Barcode ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Joined At</th>
              <th>Blood Group</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.barcodeId}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.unit}</td>
                <td>{emp.gender}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.joinedAt}</td>
                <td>{emp.bloodGroup}</td>
                <td>{emp.dob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDetails;
