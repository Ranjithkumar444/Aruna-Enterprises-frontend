import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/InventoryHome.css"

const InventoryHome = () => {
    const navigate = useNavigate();
    const [barcodeId, setBarcodeId] = useState('');
    const [barcodeImage, setBarcodeImage] = useState(null);

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
                responseType: 'arraybuffer'
            });
            console.log(response)
            const blob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setBarcodeImage(imageUrl);

        } catch (error) {
            console.error("Error fetching barcode image:", error);
            alert("Failed to fetch barcode image. Make sure the barcode ID is correct.");
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && barcodeImage) {
            printWindow.document.write(`
                <html>
                    <head><title>Print Barcode</title></head>
                    <body style="margin:0; padding:0;">
                        <img src="${barcodeImage}" style="width: 100%;"/>
                        <script>
                            window.onload = function() {
                                window.print();
                                window.onafterprint = function() { window.close(); };
                            };
                        </script>
                    </body>
                </html>
            `);
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
