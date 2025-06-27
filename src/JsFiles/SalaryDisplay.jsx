import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccessDeniedMessage from './AccessDeneidMessage';

const SalaryDisplay = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterUnit, setFilterUnit] = useState('');
  const [hasAccessError, setHasAccessError] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const monthNames = [
    '',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchSalaryData = async () => {
      setLoading(true);
      setError(null);
      setHasAccessError(false);

      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/salary/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaryData(response.data);
        console.log("Salary Data Response:", response);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch salary data";
        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else if (err.response?.status === 403) {
          setHasAccessError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [token, navigate]);

  const filteredData = filterUnit
    ? salaryData.filter(item =>
        item.unit?.toLowerCase().includes(filterUnit.toLowerCase()))
    : salaryData;

  const handlePrint = () => {
    window.print();
  };

  if (hasAccessError) {
    return <AccessDeniedMessage />;
  }

  if (loading) return <p className="text-center text-lg font-medium text-gray-700 py-8">Loading salary data...</p>;
  if (error && !hasAccessError) return <p className="text-center text-lg font-medium text-red-600 py-8">{error}</p>;

  const currentMonth = salaryData.length > 0 ? monthNames[salaryData[0].month] : '';
  const currentYear = new Date().getFullYear(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-10 font-sans">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight md:text-5xl">
        Salary Details - {currentMonth} {currentYear}
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8 gap-4">
        <input
          type="text"
          placeholder="Filter by Unit"
          value={filterUnit}
          onChange={(e) => setFilterUnit(e.target.value)}
          className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm w-full md:w-auto"
        />
        <button
          onClick={handlePrint}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
        >
          Print
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Barcode ID</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total Salary (₹)</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Overtime Hours</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Month</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Base Salary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((salary, index) => (
                <tr key={`${salary.employeeId}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{salary.barcodeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-center">
                    ₹{Number(salary.totalSalaryThisMonth).toFixed(2).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {Number(salary.totalOvertimeHours).toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center'>{salary.unit}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center'>{monthNames[salary.month]}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-semibold text-center'>
                    ₹{Number(salary.monthlyBaseSalary).toFixed(2).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 text-base">
                  {loading ? 'Loading...' : 'No matching records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDisplay;