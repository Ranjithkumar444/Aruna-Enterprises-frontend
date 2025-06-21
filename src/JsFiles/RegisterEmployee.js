import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccessDeniedMessage from "./AccessDeneidMessage";



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
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        } else if (error.response.status === 403) {
          setHasAccessError(true);
        } else {
          setMessage(
            `Error checking permissions: ${
              error.response.data.message || error.response.statusText
            }`
          );
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
      setBarcodeData(null); 
    } catch (error) {
      console.error("Deactivate error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Error deactivating employee";
      setMessage(errorMessage);
      setIsError(true);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else if (error.response?.status === 403) {
        setHasAccessError(true);
      }
    }
  };

  const handleFetchBarcode = async () => {
    if (!barcodeId.trim()) {
      setMessage("Please enter a barcode ID.");
      setIsError(true);
      setBarcodeData(null);
      return;
    }
    setHasAccessError(false);
    setMessage("");
    setIsError(false);

    try {
      const barcodeResponse = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/employee/barcode/${barcodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const employeeDetailsResponse = await axios.post(
        `https://arunaenterprises.azurewebsites.net/admin/employee/getEmployeeNameAndUnit`,
        new URLSearchParams({ barcodeId: barcodeId }).toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const imageUrl = URL.createObjectURL(barcodeResponse.data);
      setBarcodeData({
        barcodeId,
        imageUrl,
        employeeName: employeeDetailsResponse.data.employeeName,
        unit: employeeDetailsResponse.data.unit,
      });
      setMessage("Barcode and employee details fetched successfully");
      setIsError(false);
    } catch (error) {
      console.error("Fetch barcode/details error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Error fetching barcode or employee details. Employee might not exist or be active.";
      setMessage(errorMessage);
      setIsError(true);
      setBarcodeData(null);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else if (error.response?.status === 403) {
        setHasAccessError(true);
      }
    }
  };

  const handlePrintBarcode = () => {
    if (!barcodeData) {
      setMessage("No barcode data to print.");
      setIsError(true);
      return;
    }

    const stickerWidthPx = 2.9 * 96;
    const stickerHeightPx = 3.9 * 96;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Barcode</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              display: flex;
              justify-content: center;
              align-items: flex-start; /* Align content to the top */
              min-height: 100vh; /* Ensure sticker div is centered if body has min-height */
            }
            .sticker {
              width: ${stickerWidthPx}px;
              height: ${stickerHeightPx}px;
              padding: 4px; /* Internal padding for content */
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: flex-start; /* Align content to the top */
              align-items: center; /* Center horizontally */
              text-align: center;
              overflow: hidden; /* Prevent content from overflowing */
              /* border: 1px dashed #ccc; */ /* For debugging layout */
            }
            .company-name {
              font-weight: bold;
              font-size: 11px; /* Slightly larger */
              margin-bottom: 2px;
              margin-top: 2px;
            }
            .barcode-id-print {
              font-size: 14px; /* Larger for barcode ID */
              font-weight: bold;
              margin-bottom: 3px;
              word-break: break-all; /* Ensure long IDs wrap */
            }
            .barcode-image-print {
              max-width: 90%; /* Adjust width to fit */
              height: auto;
              max-height: 40%; /* Allocate vertical space for image */
              object-fit: contain;
              margin-bottom: 3px;
            }
            .employee-info-print {
              font-size: 9px; /* For name and unit */
              line-height: 1.2;
              width: 100%;
              text-align: center; /* Center name and unit */
              padding: 0 5px; /* Small horizontal padding */
              box-sizing: border-box;
            }
            .employee-info-print p {
              margin: 1px 0; /* Tight spacing for lines */
            }
            .employee-info-print p strong {
                font-weight: bold;
            }
            /* Media query for print specifically */
            @page {
                size: ${2.9}in ${3.9}in; /* Set actual print size */
                margin: 0; /* Remove default margins */
            }
            @media print {
                body {
                    width: ${2.9}in;
                    height: ${3.9}in;
                    margin: 0;
                    padding: 0;
                    display: block; /* Override flex for print */
                }
                .sticker {
                    border: none; /* Remove debugging border */
                    width: 100%;
                    height: 100%;
                }
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="company-name">Aruna Enterprises</div>
            <div class="barcode-id-print">${barcodeData.barcodeId}</div>
            <img src="${barcodeData.imageUrl}" alt="Employee Barcode" class="barcode-image-print" />
            <div class="employee-info-print">
              <p><strong>Name:</strong> ${barcodeData.employeeName}</p>
              <p><strong>Unit:</strong> ${barcodeData.unit}</p>
            </div>
          </div>
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
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
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
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
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
        <h3 style={{ margin: "0", color: "#343a40" }}>
          Employee Barcode Operations
        </h3>
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
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
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
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            Deactivate
          </button>
        </div>

        {barcodeData && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>
              Barcode ID: {barcodeData.barcodeId}
            </div>
            <img
              src={barcodeData.imageUrl}
              alt="Employee Barcode"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
            />
            {barcodeData.employeeName && (
              <div style={{ marginTop: "10px", fontSize: "16px" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Name:</strong> {barcodeData.employeeName}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Unit:</strong> {barcodeData.unit}
                </p>
              </div>
            )}
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
          <div
            style={{
              color: isError ? "#dc3545" : "#28a745",
              textAlign: "center",
              marginTop: "1rem",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEmployee;