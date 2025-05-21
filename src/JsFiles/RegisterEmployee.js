import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem("adminToken");

  console.log("Token:", token);

  const handleDeactivate = async () => {
    if (!barcodeId) {
      setMessage("Please enter a barcode ID.");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/employee/deactivate/${barcodeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage(response.data || "Employee deactivated successfully");
      setIsError(false);
      setBarcodeId("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data || 
                         "Error deactivating employee";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#343a40",
        }}
      >
        Employee Management
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/admin/employee/register")}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Create Employee
        </button>

        <button
          onClick={() => navigate("/admin/employee/get-all-employees")}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          View Employees
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0", color: "#343a40" }}>Deactivate Employee</h3>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Barcode ID"
            value={barcodeId}
            onChange={(e) => setBarcodeId(e.target.value)}
            style={{
              flex: "1",
              padding: "0.7rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ced4da",
              outline: "none",
              transition: "border 0.3s ease",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }}
          />
          <button
            onClick={handleDeactivate}
            style={{
              padding: "0.7rem 1.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Deactivate
          </button>

          <button onClick={() => (navigate("/admin/dashboard/admin/employee/salary"))}>
            Salary
          </button>
        </div>
        {message && (
          <div style={{
            color: isError ? "#dc3545" : "#28a745",
            textAlign: "center",
            marginTop: "1rem",
            fontWeight: "500"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEmployee;