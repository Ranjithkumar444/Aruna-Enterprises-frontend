import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccessDeniedMessage from './AccessDeniedMessage'; 
const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [hasAccessError, setHasAccessError] = useState(false); 

  const token = localStorage.getItem("adminToken");

  const handleCreateEmployeeClick = async () => {
    setHasAccessError(false); 
    setMessage(""); 

    try {
      await axios.get(
        "https://arunaenterprises.azurewebsites.net/admin/get-admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/admin/employee/register");
    } catch (error) {

      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else if (error.response.status === 403) {
          setHasAccessError(true);
        } else {
          setMessage(`Error checking permissions: ${error.response.data.message || error.response.statusText}`);
          setIsError(true);
        }
      } else {
        setMessage("Network error or unhandled error during permission check.");
        setIsError(true);
      }
    }
  };


  const handleDeactivate = async () => {
    if (!barcodeId) {
      setMessage("Please enter a barcode ID.");
      setIsError(true);
      return;
    }
    setHasAccessError(false); 

    try {
      const response = await axios.put(
        `https://arunaenterprises.azurewebsites.net/admin/employee/deactivate/${barcodeId}`,
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
      console.error("Deactivate error:", error);
      const errorMessage = error.response?.data?.message ||
                         error.response?.data ||
                         "Error deactivating employee";
      setMessage(errorMessage);
      setIsError(true);
      if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
      } else if (error.response?.status === 403) {
          setHasAccessError(true);
      }
    }
  };

  const handleFetchBarcode = async () => {
    if (!barcodeId) {
      setMessage("Please enter a barcode ID.");
      setIsError(true);
      return;
    }
    setHasAccessError(false); 

    try {
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/employee/barcode/${barcodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'
        }
      );


      const imageUrl = URL.createObjectURL(response.data);
      setBarcodeData({
        barcodeId,
        imageUrl
      });
      setMessage("Barcode fetched successfully");
      setIsError(false);
    } catch (error) {
      console.error("Fetch barcode error:", error);
      const errorMessage = error.response?.data?.message ||
                         "Error fetching barcode";
      setMessage(errorMessage);
      setIsError(true);
      setBarcodeData(null);
      if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
      } else if (error.response?.status === 403) {
          setHasAccessError(true);
      }
    }
  };

  const handlePrintBarcode = () => {
    if (!barcodeData) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode Print</title>
          <style>
            body { text-align: center; padding: 20px; }
            img { max-width: 100%; height: auto; }
            .barcode-id { font-size: 24px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="barcode-id">${barcodeData.barcodeId}</div>
          <img src="${barcodeData.imageUrl}" alt="Employee Barcode" />
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (hasAccessError) {
    return <AccessDeniedMessage />;
  }

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
          onClick={handleCreateEmployeeClick}
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
        <h3 style={{ margin: "0", color: "#343a40" }}>Employee Barcode Operations</h3>
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
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={handleFetchBarcode}
            style={{
              padding: "0.7rem 1.5rem",
              backgroundColor: "#007bff",
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
            Fetch Barcode
          </button>

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
        </div>

        {barcodeData && (
          <div style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>
              Barcode ID: {barcodeData.barcodeId}
            </div>
            <img
              src={barcodeData.imageUrl}
              alt="Employee Barcode"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
            />
            <button
              onClick={handlePrintBarcode}
              style={{
                marginTop: "15px",
                padding: "0.7rem 1.5rem",
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
            >
              Print Barcode
            </button>
          </div>
        )}

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