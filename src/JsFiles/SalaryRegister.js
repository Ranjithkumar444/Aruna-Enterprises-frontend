import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SalaryRegister = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [monthlyBaseSalary, setMonthlyBaseSalary] = useState("");
  const [otMultiplierFactor, setOtMultiplierFactor] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [workingDays, setWorkingDays] = useState("");

  const token = localStorage.getItem("adminToken");

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
      console.log(response);
      setMessage(response.data);
      setIsError(false);
      setTimeout(() => navigate("/admin/employee/get-all-employees"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data || "Error saving salary";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register Salary for Employee ID: {employeeId}</h2>
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
};

export default SalaryRegister;
