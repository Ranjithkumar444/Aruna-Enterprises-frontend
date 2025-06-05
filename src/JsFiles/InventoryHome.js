import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/InventoryHome.css";

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
                },
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const imageUrl = `data:image/png;base64,${base64}`;
            setBarcodeImage(imageUrl);

            // Fetch reel details
            const detailsRes = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/details/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setReelData(detailsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch barcode data. Make sure the barcode ID is correct.");
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow || !barcodeImage || !reelData) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Barcode Sticker</title>
                <style>
                    @page {
                        size: 2.9in 4.9in;
                        margin: 0;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 8px;
                        margin: 0;
                        padding: 4px;
                    }
                    .container {
                        width: 2.9in;
                        height: 4.9in;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                    .logo {
                        font-size: 10px;
                        font-weight: bold;
                        margin-bottom: 3px;
                    }
                    .barcode {
                        max-height: 1.5in;
                        margin-bottom: 4px;
                    }
                    .barcode-id {
                        font-size: 9px;
                        margin-bottom: 4px;
                    }
                    .detail {
                        margin: 1px 0;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                    }
                    .label {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">ARUNA ENTERPRISES</div>
                    <img src="${barcodeImage}" class="barcode" />
                    <div class="barcode-id">${barcodeId}</div>
                    <div class="detail"><span class="label">Type:</span><span>${reelData.paperType}</span></div>
                    <div class="detail"><span class="label">Supplier:</span><span>${reelData.supplierName}</span></div>
                    <div class="detail"><span class="label">GSM:</span><span>${reelData.gsm}</span></div>
                    <div class="detail"><span class="label">Deckle:</span><span>${reelData.deckle} mm</span></div>
                    <div class="detail"><span class="label">Weight:</span><span>${reelData.currentWeight} kg</span></div>
                    <div class="detail"><span class="label">Initial:</span><span>${reelData.initialWeight} kg</span></div>
                    <div class="detail"><span class="label">Burst:</span><span>${reelData.burstFactor}</span></div>
                    <div class="detail"><span class="label">Status:</span><span>${reelData.status}</span></div>
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
                                Print Sticker
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
