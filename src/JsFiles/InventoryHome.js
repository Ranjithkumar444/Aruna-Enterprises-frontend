import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssFiles/InventoryHome.css"

const InventoryHome = () => {
    const navigate = useNavigate();
    const [barcodeId, setBarcodeId] = useState('');
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [reelData, setReelData] = useState(null);

    const handleGetBarcode = async () => {
    const token = localStorage.getItem("adminToken");

    if (!barcodeId || !token) {
        alert("Please provide a Barcode ID and ensure adminToken is present.");
        return;
    }

    try {
        const response = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
        });

        const data = response.data;
        setReelData(data);

        if (data.barcodeImage) {
            const byteArray = new Uint8Array(data.barcodeImage);
            const blob = new Blob([byteArray], { type: 'image/png' });
            const reader = new FileReader();
            reader.onloadend = () => {
                setBarcodeImage(reader.result); 
            };
            reader.readAsDataURL(blob);
        }
    } catch (error) {
        console.error("Error fetching barcode image and details:", error);
        alert("Failed to fetch barcode details.");
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
                                flex-direction: row;
                                box-sizing: border-box;
                                padding: 4px;
                            }
                            .barcode-column {
                                width: 55%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                            .barcode-image {
                                max-width: 100%;
                                max-height: 1.5in;
                                margin-bottom: 3px;
                            }
                            .details-column {
                                width: 45%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding-left: 4px;
                            }
                            .detail-row {
                                margin-bottom: 2px;
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
                                margin-bottom: 4px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <div class="barcode-column">
                                <div class="company-name">ARUNA ENTERPRISES</div>
                                <img src="${barcodeImage}" class="barcode-image" />
                                <div>${reelData.barcodeId || ''}</div>
                            </div>
                            <div class="details-column">
                                <div class="detail-row"><span class="detail-label">Type:</span>${reelData.paperType || ''}</div>
                                <div class="detail-row"><span class="detail-label">Supplier:</span>${reelData.supplierName || ''}</div>
                                <div class="detail-row"><span class="detail-label">GSM:</span>${reelData.gsm || ''}</div>
                                <div class="detail-row"><span class="detail-label">Deckle:</span>${reelData.deckle || ''} mm</div>
                                <div class="detail-row"><span class="detail-label">Weight:</span>${reelData.currentWeight || ''} ${reelData.unit || 'kg'}</div>
                                <div class="detail-row"><span class="detail-label">Burst:</span>${reelData.burstFactor || ''}</div>
                                <div class="detail-row"><span class="detail-label">Status:</span>${reelData.status || ''}</div>
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
                    <div className="barcode-image-container" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <img src={barcodeImage} alt="Barcode" style={{ maxWidth: '120px', height: 'auto' }} />
                        <div className="reel-details-preview">
                            <p><strong>Paper Type:</strong> {reelData.paperType}</p>
                            <p><strong>Supplier:</strong> {reelData.supplierName}</p>
                            <p><strong>GSM:</strong> {reelData.gsm}</p>
                            <p><strong>Deckle:</strong> {reelData.deckle} mm</p>
                            <p><strong>Weight:</strong> {reelData.currentWeight} {reelData.unit || 'kg'}</p>
                            <p><strong>Burst Factor:</strong> {reelData.burstFactor}</p>
                            <p><strong>Status:</strong> {reelData.status}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="action-button-reel">
                <button onClick={() => navigate("reel")}>Reel Stocks</button> 
                {barcodeImage && reelData && (
                    <button className="action-button print-button" onClick={handlePrint}>
                        Print Barcode
                    </button>
                )}
            </div>
        </div>
    );
};

export default InventoryHome;
