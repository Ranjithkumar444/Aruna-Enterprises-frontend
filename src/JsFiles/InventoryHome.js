import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/InventoryHome.css"

const InventoryHome = () => {
    const navigate = useNavigate();
    const [barcodeId, setBarcodeId] = useState('');
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [reelDetails, setReelDetails] = useState(null); // New state for reel details

    const handleGetBarcode = async () => {
        const token = localStorage.getItem("adminToken");

        if (!barcodeId || !token) {
            alert("Please provide a Barcode ID and ensure adminToken is present in localStorage.");
            return;
        }

        try {
            // Fetch barcode image
            const barcodeResponse = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer'
            });
            console.log(barcodeResponse);
            const blob = new Blob([barcodeResponse.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setBarcodeImage(imageUrl);

            // Fetch reel details
            const detailsResponse = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/details/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(detailsResponse.data);
            setReelDetails(detailsResponse.data);

        } catch (error) {
            console.error("Error fetching barcode or reel details:", error);
            alert("Failed to fetch barcode image or reel details. Make sure the barcode ID is correct.");
            setBarcodeImage(null);
            setReelDetails(null);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && barcodeImage && reelDetails) {
            const stickerWidthPx = 2.90 * 96;
            const stickerHeightPx = 4 * 96;

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
                                width: ${stickerWidthPx}px;
                                height: ${stickerHeightPx}px;
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
                                <p><strong>Barcode ID:</strong> ${barcodeId}</p>
                                <p><strong>GSM:</strong> ${reelDetails.gsm}</p>
                                <p><strong>Deckle:</strong> ${reelDetails.deckle}</p>
                                <p><strong>Initial Wt:</strong> ${reelDetails.initialWeight} kg</p>
                                <p><strong>Current Wt:</strong> ${reelDetails.currentWeight} kg</p>
                                <p><strong>Burst Factor:</strong> ${reelDetails.burstFactor}</p>
                                <p><strong>Supplier:</strong> ${reelDetails.supplierName}</p>
                                <p><strong>Paper Type:</strong> ${reelDetails.paperType}</p>
                                <p><strong>Status:</strong> ${reelDetails.status}</p>
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
            alert("Barcode image and reel details are not available for printing.");
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

                {barcodeImage && (
                    <div className="barcode-image-container">
                        <img src={barcodeImage} alt="Barcode" className="barcode-image" />
                        {reelDetails && (
                            <div className="reel-details-display">
                                <h3>Reel Details:</h3>
                                <p><strong>GSM:</strong> {reelDetails.gsm}</p>
                                <p><strong>Deckle:</strong> {reelDetails.deckle}</p>
                                <p><strong>Initial Weight:</strong> {reelDetails.initialWeight} kg</p>
                                <p><strong>Current Weight:</strong> {reelDetails.currentWeight} kg</p>
                                <p><strong>Burst Factor:</strong> {reelDetails.burstFactor}</p>
                                <p><strong>Supplier Name:</strong> {reelDetails.supplierName}</p>
                                <p><strong>Paper Type:</strong> {reelDetails.paperType}</p>
                                <p><strong>Status:</strong> {reelDetails.status}</p>
                            </div>
                        )}
                        <div className="barcode-actions">
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
