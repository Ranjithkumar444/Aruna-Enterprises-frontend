import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SalaryRegister = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [monthlyBaseSalary, setMonthlyBaseSalary] = useState("");
  const [otMultiplierFactor, setOtMultiplierFactor] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [workingDays, setWorkingDays] = useState("");
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (location.state) {
      setBarcodeInfo({
        barcodeId: location.state.barcodeId,
        barcodeImage: location.state.barcodeImage
      });
    }
  }, [location.state]);

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/salary/add",
        {
          employeeId,
          monthlyBaseSalary: parseFloat(monthlyBaseSalary),
          otMultiplierFactor: parseFloat(otMultiplierFactor),
          workingDays: parseFloat(workingDays)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage(response.data);
      setIsError(false);
      if (response.data.includes("successfully")) { 
         setShowBarcode(true); 
         
         
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Error saving salary";
      setMessage(errorMessage);
      setIsError(true);
      setShowBarcode(false); 
    }
  };

  const handlePrintBarcode = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 text-center transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
          Register Salary for Employee ID: {employeeId}
        </h2>
        {!showBarcode ? (
          <form onSubmit={handleSalarySubmit} className="flex flex-col space-y-4">
            <input
              type="number"
              placeholder="Monthly Base Salary"
              value={monthlyBaseSalary}
              onChange={(e) => setMonthlyBaseSalary(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200 placeholder-gray-400"
            />
            
            <select
              value={otMultiplierFactor}
              onChange={(e) => setOtMultiplierFactor(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200 text-gray-700 bg-white"
            >
              <option value="">Select OT Rate Per Hour</option>
              <option value="1">1 hour (1x)</option>
              <option value="1.5">1.5 hours (1.5x)</option>
            </select>

            <input
              type="number"
              placeholder="Working days"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200 placeholder-gray-400"
            />

            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Submit Salary
            </button>
            {message && (
              <div className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-600 bg-red-50 p-2 rounded-md border border-red-200 animate-fade-in" : "text-green-600 bg-green-50 p-2 rounded-md border border-green-200 animate-fade-in"}`}>
                {message}
              </div>
            )}
          </form>
        ) : (
          <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-inner space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Employee Barcode</h3>
            {barcodeInfo ? (
              <>
                <p className="text-gray-700 text-lg">Barcode ID: <span className="font-semibold text-gray-900">{barcodeInfo.barcodeId}</span></p>
                <img 
                  src={`data:image/png;base64,${barcodeInfo.barcodeImage}`} 
                  alt="Employee Barcode" 
                  className="max-w-full h-auto mx-auto my-4 border border-gray-300 p-2 bg-white rounded-md shadow-sm"
                />
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <button 
                    onClick={handlePrintBarcode}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Print Barcode
                  </button>
                  <button 
                    onClick={() => navigate("/admin/employee/get-all-employees")}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold text-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Back to Employees
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600">Barcode information not available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryRegister;