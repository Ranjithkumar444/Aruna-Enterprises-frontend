import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CssFiles/SalaryDisplay.css"

const SalaryDisplay = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/salary/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setSalaryData(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch salary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  if (loading) return <p className="text-center">Loading salary data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="salary-container">
      <h1 className="salary-title">Employee Salary Details (Latest)</h1>
      <div className="salary-table-wrapper">
        <table className="salary-table">
          <thead className="salary-thead">
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Barcode ID</th>
              <th>Total Salary (₹)</th>
              <th>Overtime Hours</th>
              <th>Month</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((salary, index) => (
              <tr key={`${salary.employeeId}-${index}`} className="salary-row">
                <td className="text-center">{index + 1}</td>
                <td>{salary.employee.name}</td>
                <td>{salary.employee.barcodeId}</td>
                <td className="text-right">₹{salary.totalSalaryThisMonth.toLocaleString()}</td>
                <td className="text-center">{salary.totalOvertimeHours}</td>
                <td className="text-center">{salary.month}</td>
                <td className="text-center">{salary.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDisplay;
