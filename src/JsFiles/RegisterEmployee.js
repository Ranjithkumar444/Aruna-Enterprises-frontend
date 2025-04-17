import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/admin/employee/register")}
        style={{
          marginTop: "2rem",
          padding: "0.6rem 1.5rem",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Create Employee
      </button>
      
      <button 
      onClick={() => navigate("/admin/employee/get-all-employees")}
      style={{
        marginTop: "2rem",
        padding: "0.6rem 1.5rem",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginLeft: "30px"
      }}
      >
        Get Employee
      </button>
    </div>
  );
};

export default RegisterEmployee;
