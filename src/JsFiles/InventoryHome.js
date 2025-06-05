import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/InventoryHome.css"

const InventoryHome = () => {
    const navigate = useNavigate();
    const [barcodeId, setBarcodeId] = useState('');
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [reelData, setReelData] = useState(null);

    const handleGetBarcode = async () => {
        const token = localStorage.getItem("adminToken");

        if (!barcodeId || !token) {
            alert("Please provide a Barcode ID and ensure adminToken is present in localStorage.");
            return;
        }

        try {
            const response = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            // Convert base64 image data to URL
            if (response.data.barcodeImage) {
                const blob = new Blob([new Uint8Array(response.data.barcodeImage)], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setBarcodeImage(imageUrl);
            }
            
            setReelData(response.data);

        } catch (error) {
            console.error("Error fetching barcode image:", error);
            alert("Failed to fetch barcode image. Make sure the barcode ID is correct.");
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && barcodeImage && reelData) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Barcode</title>
                        <style>
                            @page {
                                size: 2.9in 4.9in;
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                font-size: 8px;
                            }
                            .print-container {
                                width: 2.9in;
                                height: 4.9in;
                                display: flex;
                                padding: 2px;
                                box-sizing: border-box;
                            }
                            .barcode-column {
                                width: 60%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            .details-column {
                                width: 40%;
                                padding-left: 3px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                            }
                            .barcode-image {
                                max-width: 100%;
                                max-height: 1.5in;
                                margin-bottom: 2px;
                            }
                            .detail-row {
                                margin-bottom: 1px;
                                word-break: break-word;
                            }
                            .detail-label {
                                font-weight: bold;
                                margin-right: 2px;
                            }
                            .company-name {
                                font-weight: bold;
                                font-size: 9px;
                                text-align: center;
                                margin-bottom: 3px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <div class="barcode-column">
                                <div class="company-name">ARUNA ENTERPRISES</div>
                                <img src="${barcodeImage}" class="barcode-image" />
                                <div>${reelData.barcodeId}</div>
                            </div>
                            <div class="details-column">
                                <div class="detail-row"><span class="detail-label">Type:</span>${reelData.paperType}</div>
                                <div class="detail-row"><span class="detail-label">Supplier:</span>${reelData.supplierName}</div>
                                <div class="detail-row"><span class="detail-label">GSM:</span>${reelData.gsm}</div>
                                <div class="detail-row"><span class="detail-label">Deckle:</span>${reelData.deckle} mm</div>
                                <div class="detail-row"><span class="detail-label">Weight:</span>${reelData.currentWeight} ${reelData.unit || 'kg'}</div>
                                <div class="detail-row"><span class="detail-label">Burst:</span>${reelData.burstFactor}</div>
                                <div class="detail-row"><span class="detail-label">Status:</span>${reelData.status}</div>
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
                    <div className="barcode-image-container">
                        <img src={barcodeImage} alt="Barcode" className="barcode-image" />
                        <div className="barcode-actions">
                            <button className="action-button print-button" onClick={handlePrint}>
                                Print Barcode
                            </button>
                        </div>
                        <div className="reel-details-preview">
                            <p><strong>Barcode ID:</strong> {reelData.barcodeId}</p>
                            <p><strong>Paper Type:</strong> {reelData.paperType}</p>
                            <p><strong>Supplier:</strong> {reelData.supplierName}</p>
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