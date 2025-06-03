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
        `${process.env.REACT_APP_API_URL}/admin/salary/add`,
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
      setShowBarcode(true);
    } catch (error) {
      const errorMessage = error.response?.data || "Error saving salary";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  const handlePrintBarcode = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register Salary for Employee ID: {employeeId}</h2>
      {!showBarcode ? (
        <form onSubmit={handleSalarySubmit} style={styles.form}>
          <input
            type="number"
            placeholder="Monthly Base Salary"
            value={monthlyBaseSalary}
            onChange={(e) => setMonthlyBaseSalary(e.target.value)}
            required
            style={styles.input}
          />
          
          <select
            value={otMultiplierFactor}
            onChange={(e) => setOtMultiplierFactor(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select OT Rate Per Hour</option>
            <option value="1">1 hour</option>
            <option value="1.5">1.5 hours</option>
          </select>

          <input
            type="number"
            placeholder="Working days"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Submit Salary</button>
          {message && (
            <div style={{ color: isError ? "red" : "green", marginTop: "10px" }}>
              {message}
            </div>
          )}
        </form>
      ) : (
        <div style={styles.barcodeContainer}>
          <h3>Employee Barcode</h3>
          {barcodeInfo && (
            <>
              <p>Barcode ID: {barcodeInfo.barcodeId}</p>
              <img 
                src={`data:image/png;base64,${barcodeInfo.barcodeImage}`} 
                alt="Employee Barcode" 
                style={styles.barcodeImage}
              />
              <div style={styles.buttonGroup}>
                <button 
                  onClick={handlePrintBarcode}
                  style={styles.printButton}
                >
                  Print Barcode
                </button>
                <button 
                  onClick={() => navigate("/admin/employee/get-all-employees")}
                  style={styles.backButton}
                >
                  Back to Employees
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "3rem auto",
    padding: "2rem",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  barcodeContainer: {
    marginTop: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
  },
  barcodeImage: {
    maxWidth: "100%",
    height: "auto",
    margin: "1rem 0",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  printButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  backButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default SalaryRegister;