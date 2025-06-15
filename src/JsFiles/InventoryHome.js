import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/InventoryHome.css"


const InventoryHome = () => {
  const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [reelDetails, setReelDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetBarcode = async () => {
    const token = localStorage.getItem("adminToken");

    if (!barcodeId.trim()) {
      setError("Please enter a Barcode ID or Reel No");
      return;
    }

    if (!token) {
      setError("Authentication token missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [barcodeResponse, detailsResponse] = await Promise.all([
        axios.get(
          `https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer'
          }
        ),
        axios.get(
          `https://arunaenterprises.azurewebsites.net/admin/reel/details/${barcodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);
      console.log(detailsResponse);
      const blob = new Blob([barcodeResponse.data], { type: 'image/png' });
      setBarcodeImage(URL.createObjectURL(blob));
      setReelDetails(detailsResponse.data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Failed to fetch reel details");
      setBarcodeImage(null);
      setReelDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!barcodeImage || !reelDetails) {
      setError("Nothing to print");
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: sans-serif; 
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .sticker {
              width: ${2.9 * 96}px;
              height: ${4 * 96}px;
              padding: 4px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              text-align: center;
              overflow: hidden;
            }
            .company-name {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 4px;
            }
            .barcode-image {
              max-width: 90%;
              max-height: 30%;
              object-fit: contain;
              margin-bottom: 4px;
            }
            .details {
              font-size: 8px;
              line-height: 1.1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
            }
            .details p {
              margin: 1px 0;
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="company-name">Aruna Enterprises</div>
            <img src="${barcodeImage}" alt="Barcode" class="barcode-image" />
            <div class="details">
              <p><strong>Barcode ID:</strong> ${reelDetails.barcodeId}</p>
              <p><strong>ReelNo:</strong> ${reelDetails.reelNo || 'N/A'}</p>
              <p><strong>GSM:</strong> ${reelDetails.gsm}</p>
              <p><strong>Deckle:</strong> ${reelDetails.deckle}</p>
              <p><strong>Initial Wt:</strong> ${reelDetails.initialWeight} kg</p>
              <p><strong>Current Wt:</strong> ${reelDetails.currentWeight} kg</p>
              <p><strong>Burst Factor:</strong> ${reelDetails.burstFactor}</p>
              <p><strong>Supplier:</strong> ${reelDetails.supplierName}</p>
              <p><strong>Paper Type:</strong> ${reelDetails.paperType}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSearchHistory = () => {
    if (!searchBarcode.trim()) {
      setError("Please enter a barcode ID to search history");
      return;
    }
    navigate(`/admin/dashboard/admin/inventory/reel-history/${encodeURIComponent(searchBarcode)}`);
  };

  return (
    <div className="inventory-home-container">
      <h2 className="inventory-heading">Inventory Management</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="action-buttons">
        <button 
          className="action-button"
          onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}
        >
          Create Reel
        </button>
        <button 
          className="action-button"
          onClick={() => navigate("/admin/dashboard/admin/inventory/reel")}
        >
          Reel Stocks
        </button>
      </div>
      
      <div className="barcode-section">
        <div className="barcode-input-group">
          <input
            className="barcode-input"
            type="text"
            value={barcodeId}
            onChange={(e) => {
              const cleaned = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
              setBarcodeId(cleaned);
            }}
            placeholder="Enter Barcode ID or Reel No"
            onKeyPress={(e) => e.key === 'Enter' && handleGetBarcode()}
          />
          <button 
            className="action-button" 
            onClick={handleGetBarcode}
            disabled={loading || !barcodeId.trim()}
          >
            {loading ? 'Loading...' : 'Get Barcode'}
          </button>
        </div>

        {barcodeImage && (
          <div className="barcode-display">
            <div className="barcode-image-container">
              <img src={barcodeImage} alt="Barcode" className="barcode-image" />
              {reelDetails && (
                <div className="reel-details">
                  <h3>Reel Details:</h3>
                  <p><strong>REEL NO:</strong> {reelDetails.reelNo || 'N/A'}</p>
                  <p><strong>GSM:</strong> {reelDetails.gsm}</p>
                  <p><strong>Deckle:</strong> {reelDetails.deckle}</p>
                  <p><strong>Initial Weight:</strong> {reelDetails.initialWeight} kg</p>
                  <p><strong>Current Weight:</strong> {reelDetails.currentWeight} kg</p>
                  <p><strong>Burst Factor:</strong> {reelDetails.burstFactor}</p>
                  <p><strong>Supplier Name:</strong> {reelDetails.supplierName}</p>
                  <p><strong>Paper Type:</strong> {reelDetails.paperType}</p>
                </div>
              )}
              <button 
                className="print-button" 
                onClick={handlePrint}
                disabled={!barcodeImage || !reelDetails}
              >
                Print Barcode
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="history-search-section">
        <h3>Search Reel History</h3>
        <div className="search-input-group">
          <input
            className="search-input"
            type="text"
            value={searchBarcode}
            onChange={(e) => {
              const cleaned = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
              setSearchBarcode(cleaned);
            }}
            placeholder="Enter Barcode ID or Reel No"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchHistory()}
          />
          <button 
            className="action-button" 
            onClick={handleSearchHistory}
            disabled={!searchBarcode.trim()}
          >
            Search History
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHome;