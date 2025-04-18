import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterAdmins = () => {
    const navigate = useNavigate();
    
      return (
        <div>
          <button
            onClick={() => navigate("/admin/admins/register")}
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
            Create Admin
          </button>
          
          <button 
          onClick={() => navigate("/admin/admins/get-all-admins")}
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
            Get Admins
          </button>
        </div>
      );
}

export default RegisterAdmins;