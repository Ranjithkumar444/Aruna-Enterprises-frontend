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
  const [isLoading, setIsLoading] = useState(false); // New loading state for all operations

  const token = localStorage.getItem("adminToken");

  const handleCreateEmployeeClick = async () => {
    setHasAccessError(false);
    setMessage("");
    setIsLoading(true);

    try {
      // This endpoint is just for permission check, any endpoint requiring admin role would work
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!barcodeId) {
      setMessage("Please enter a barcode ID.");
      setIsError(true);
      return;
    }
    setHasAccessError(false);
    setMessage(""); // Clear previous message
    setIsError(false);
    setIsLoading(true);

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
      setBarcodeId(""); // Clear input after successful deactivation
      setBarcodeData(null); // Clear barcode display
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
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);

    try {
      const barcodeResponse = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/employee/barcode/${barcodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for image data
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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintBarcode = () => {
    if (!barcodeData) {
      setMessage("No barcode data to print.");
      setIsError(true);
      return;
    }

    // Convert inches to pixels (1 inch = 96 pixels) for screen preview accuracy
    const stickerWidthIn = 2.9;
    const stickerHeightIn = 3.9;
    const pxPerInch = 96;

    const stickerWidthPx = stickerWidthIn * pxPerInch;
    const stickerHeightPx = stickerHeightIn * pxPerInch;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Barcode</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
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
                size: ${stickerWidthIn}in ${stickerHeightIn}in; /* Set actual print size */
                margin: 0; /* Remove default margins */
            }
            @media print {
                body {
                    width: ${stickerWidthIn}in;
                    height: ${stickerHeightIn}in;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight md:text-5xl">
          Employee Management
        </h2>

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
          <button
            onClick={handleCreateEmployeeClick}
            disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed
                       text-lg w-full sm:w-auto"
          >
            {isLoading ? 'Processing...' : 'Create Employee'}
          </button>

          <button
            onClick={() => navigate("/admin/employee/get-all-employees")}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                       text-lg w-full sm:w-auto"
          >
            {isLoading ? 'Loading...' : 'View Employees'}
          </button>
        </div>

        {/* Barcode Operations Section */}
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Employee Barcode Operations
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="Enter Barcode ID"
              value={barcodeId}
              onChange={(e) => setBarcodeId(e.target.value)}
              className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleFetchBarcode}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed
                         text-base w-full sm:w-auto"
            >
              {isLoading ? 'Fetching...' : 'Fetch Barcode'}
            </button>

            <button
              onClick={handleDeactivate}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed
                         text-base w-full sm:w-auto"
            >
              {isLoading ? 'Deactivating...' : 'Deactivate Employee'}
            </button>
          </div>

          {/* Barcode Display Area */}
          {barcodeData && (
            <div className="mt-8 text-center p-6 border border-dashed border-gray-300 rounded-xl bg-white shadow-lg flex flex-col items-center">
              <div className="text-xl font-bold text-gray-800 mb-4 break-words">
                Barcode ID: {barcodeData.barcodeId}
              </div>
              <img
                src={barcodeData.imageUrl}
                alt="Employee Barcode"
                className="max-w-full h-auto max-h-52 object-contain mb-4 border border-gray-200 p-1 rounded-md"
              />
              {barcodeData.employeeName && (
                <div className="mt-4 text-gray-700 text-lg">
                  <p className="mb-1">
                    <strong className="font-semibold">Name:</strong> {barcodeData.employeeName}
                  </p>
                  <p>
                    <strong className="font-semibold">Unit:</strong> {barcodeData.unit}
                  </p>
                </div>
              )}
              <button
                onClick={handlePrintBarcode}
                className="mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md
                           hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              >
                Print Barcode Sticker
              </button>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium w-full max-w-sm ${
                isError
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-green-100 border border-green-400 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;