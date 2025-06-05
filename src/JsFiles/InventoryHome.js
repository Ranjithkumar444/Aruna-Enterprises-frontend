import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssFiles/InventoryHome.css";

const InventoryHome = () => {
    const navigate = useNavigate();
    const [barcodeId, setBarcodeId] = useState('');
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [reelData, setReelData] = useState(null); // Unified state for all reel data including details

    const handleGetBarcode = async () => {
        const token = localStorage.getItem("adminToken");

        if (!barcodeId || !token) {
            alert("Please provide a Barcode ID and ensure adminToken is present.");
            return;
        }

        try {
            // This API call is assumed to return a JSON object containing
            // both 'barcodeImage' (as byte array) and reel details (GSM, Deckle, etc.)
            const response = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'json', // Expect JSON response
            });

            const data = response.data;
            setReelData(data); // Store all reel data

            if (data.barcodeImage) {
                // Convert byte array to Blob and then to Data URL for image display
                const byteArray = new Uint8Array(data.barcodeImage);
                const blob = new Blob([byteArray], { type: 'image/png' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBarcodeImage(reader.result);
                };
                reader.readAsDataURL(blob);
            } else {
                setBarcodeImage(null); // Clear image if not present
            }

        } catch (error) {
            console.error("Error fetching barcode image and details:", error);
            alert("Failed to fetch barcode details. Make sure the barcode ID is correct.");
            setBarcodeImage(null);
            setReelData(null); // Clear all reel data on error
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        // Ensure both barcodeImage (Data URL) and reelData are available
        if (printWindow && barcodeImage && reelData) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Barcode</title>
                        <style>
                            @page {
                                size: 2.9in 4.9in; /* Set the page size directly for printing */
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                font-size: 8px; /* Base font size for sticker details */
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh; /* Use 100vh to ensure centering in print preview */
                            }
                            .print-container {
                                width: 2.9in;
                                height: 4.9in;
                                display: flex;
                                flex-direction: column; /* Changed to column layout for better vertical space usage */
                                box-sizing: border-box;
                                padding: 4px; /* Slight padding around the content */
                                border: 1px solid #ccc; /* Optional: for visual debugging of sticker boundary */
                            }
                            .company-name {
                                font-weight: bold;
                                font-size: 10px; /* Slightly larger for company name */
                                text-align: center;
                                margin-bottom: 5px;
                            }
                            .barcode-section-print {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                margin-bottom: 5px;
                            }
                            .barcode-image-print {
                                max-width: 90%; /* Max width relative to container */
                                max-height: 1.8in; /* Allocate more height for barcode */
                                object-fit: contain;
                                margin-bottom: 3px;
                            }
                            .barcode-id-print {
                                font-size: 9px;
                                font-weight: bold;
                                margin-bottom: 5px;
                            }
                            .details-section-print {
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                font-size: 8px; /* Ensure small font size for details */
                            }
                            .detail-row {
                                margin-bottom: 1px; /* Very tight spacing */
                                word-break: break-all; /* Allow breaking long words */
                                line-height: 1.2; /* Tight line height */
                                display: flex; /* Use flex for label-value alignment */
                                justify-content: space-between; /* Space out label and value */
                            }
                            .detail-label {
                                font-weight: bold;
                                margin-right: 3px;
                                flex-shrink: 0; /* Prevent label from shrinking */
                            }
                            .detail-value {
                                text-align: right; /* Align values to the right */
                                flex-grow: 1; /* Allow value to take remaining space */
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <div class="company-name">ARUNA ENTERPRISES</div>
                            <div class="barcode-section-print">
                                <img src="${barcodeImage}" class="barcode-image-print" />
                                <div class="barcode-id-print">${barcodeId || ''}</div>
                            </div>
                            <div class="details-section-print">
                                <div class="detail-row"><span class="detail-label">Type:</span><span class="detail-value">${reelData.paperType || ''}</span></div>
                                <div class="detail-row"><span class="detail-label">Supplier:</span><span class="detail-value">${reelData.supplierName || ''}</span></div>
                                <div class="detail-row"><span class="detail-label">GSM:</span><span class="detail-value">${reelData.gsm || ''}</span></div>
                                <div class="detail-row"><span class="detail-label">Deckle:</span><span class="detail-value">${reelData.deckle || ''} mm</span></div>
                                <div class="detail-row"><span class="detail-label">Initial Wt:</span><span class="detail-value">${reelData.initialWeight || ''} ${reelData.unit || 'kg'}</span></div>
                                <div class="detail-row"><span class="detail-label">Current Wt:</span><span class="detail-value">${reelData.currentWeight || ''} ${reelData.unit || 'kg'}</span></div>
                                <div class="detail-row"><span class="detail-label">Burst:</span><span class="detail-value">${reelData.burstFactor || ''}</span></div>
                                <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value">${reelData.status || ''}</span></div>
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
        } else {
            alert("Barcode image and reel details are not available for printing. Please fetch them first.");
        }
    };

    return (
        <div className="inventory-home-container">
            <h2 className="inventory-heading">Inventory Management</h2>
            <button
                className="action-button"
                onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}
            >
                Create Reel
            </button>

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
                        placeholder="Enter Barcode ID"
                    />
                    <button className="action-button" onClick={handleGetBarcode}>Get Barcode</button>
                </div>

                {barcodeImage && reelData && (
                    <div className="barcode-image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '16px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                        <img src={barcodeImage} alt="Barcode" style={{ maxWidth: '150px', height: 'auto', border: '1px solid #eee', padding: '5px' }} />
                        <div className="reel-details-preview" style={{ width: '100%', textAlign: 'left' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1em', color: '#333' }}>Reel Details:</h3>
                            <p style={{ margin: '4px 0' }}><strong>Barcode ID:</strong> {barcodeId}</p>
                            <p style={{ margin: '4px 0' }}><strong>Paper Type:</strong> {reelData.paperType}</p>
                            <p style={{ margin: '4px 0' }}><strong>Supplier:</strong> {reelData.supplierName}</p>
                            <p style={{ margin: '4px 0' }}><strong>GSM:</strong> {reelData.gsm}</p>
                            <p style={{ margin: '4px 0' }}><strong>Deckle:</strong> {reelData.deckle} mm</p>
                            <p style={{ margin: '4px 0' }}><strong>Initial Weight:</strong> {reelData.initialWeight} kg</p>
                            <p style={{ margin: '4px 0' }}><strong>Current Weight:</strong> {reelData.currentWeight} {reelData.unit || 'kg'}</p>
                            <p style={{ margin: '4px 0' }}><strong>Burst Factor:</strong> {reelData.burstFactor}</p>
                            <p style={{ margin: '4px 0' }}><strong>Status:</strong> {reelData.status}</p>
                        </div>
                        <div className="barcode-actions" style={{ marginTop: '15px' }}>
                            <button className="action-button print-button" onClick={handlePrint}>
                                Print Barcode
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="action-button-reel">
                <button onClick={() => navigate("reel")}>Reel Stocks</button>
            </div>
        </div>
    );
};

export default InventoryHome;