import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CssFiles/SalaryDisplay.css";

const SalaryDisplay = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterUnit, setFilterUnit] = useState('');
  const token = localStorage.getItem("adminToken");

  const monthNames = [
    '', 
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/salary/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaryData(response.data);
        console.log(response)
      } catch (err) {
        setError('Failed to fetch salary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  const filteredData = filterUnit 
    ? salaryData.filter(item => 
        item.unit?.toLowerCase().includes(filterUnit.toLowerCase()))
    : salaryData;

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-center">Loading salary data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="salary-container">
      <h1 className="salary-title">Salary Details - {monthNames[new Date().getMonth()]} {new Date().getFullYear()}</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by Unit"
          value={filterUnit}
          onChange={(e) => setFilterUnit(e.target.value)}
          className="filter-input"
        />
        <button onClick={handlePrint} className="print-button">Print</button>
      </div>

      <div className="salary-table-wrapper">
        <table className="salary-table">
          <thead className="salary-thead">
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Barcode ID</th>
              <th>Total Salary (₹)</th>
              <th>Overtime Hours</th>
              <th>Unit</th>
              <th>Month</th>
              <th>Base Salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((salary, index) => (
              <tr key={`${salary.employeeId}-${index}`} className="salary-row">
                <td className="text-center">{index + 1}</td>
                <td>{salary.name}</td>
                <td>{salary.barcodeId}</td>
                <td className="text-center">
                  ₹{Number(salary.totalSalaryThisMonth.toFixed(0)).toLocaleString()}
                </td>
                <td className="text-center">
                  {Number(salary.totalOvertimeHours.toFixed(0))}
                </td>
                <td className='text-center'>{salary.unit}</td>
                <td className='text-center'>{monthNames[salary.month]}</td>
                <td className='text-center'>
                  ₹{Number(salary.monthlyBaseSalary.toFixed(0)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDisplay;