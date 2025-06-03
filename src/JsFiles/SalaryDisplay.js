import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CssFiles/SalaryDisplay.css";

const SalaryDisplay = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterA, setFilterA] = useState('');
  const [filterB, setFilterB] = useState('');
  const token = localStorage.getItem("adminToken");

  const monthNames = [
  '', 
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/salary/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaryData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError('Failed to fetch salary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  useEffect(() => {
    const filtered = salaryData.filter((item) => {
      const aMatch = filterA ? item.month?.toString().toLowerCase().includes(filterA.toLowerCase()) : true;
      const bMatch = filterB ? item.employee?.unit?.toLowerCase().includes(filterB.toLowerCase()) : true;
      return aMatch && bMatch;
    });
    setFilteredData(filtered);
  }, [filterA, filterB, salaryData]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-center">Loading salary data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="salary-container">
      <h1 className="salary-title">Salary Details</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by Month"
          value={filterA}
          onChange={(e) => setFilterA(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Filter by Unit"
          value={filterB}
          onChange={(e) => setFilterB(e.target.value)}
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
              <th>Month</th>
              <th>Year</th>
              <th>Unit</th>
              <th>BaseSalary</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((salary, index) => (
              <tr key={`${salary.employeeId}-${index}`} className="salary-row">
                <td className="text-center">{index + 1}</td>
                <td>{salary.employee.name}</td>
                <td>{salary.employee.barcodeId}</td>
                <td className="text-center">
                    ₹{Number(salary.totalSalaryThisMonth.toFixed(0)).toLocaleString()}
                </td>
                <td className="text-center">
                    {Number(salary.totalOvertimeHours.toFixed(0))}
                </td>
                <td className="text-center">{monthNames[salary.month]}</td>
                <td className="text-center">{salary.year}</td>
                <td className='text-center'>{salary.employee.unit}</td>
                <td className='text-center'>{salary.monthlyBaseSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDisplay;
