import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/reel/barcode-image/${barcodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer'
            });

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
        <div>
            <button onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}>Create Reel</button>
            
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={barcodeId}
                    onChange={(e) => setBarcodeId(e.target.value)}
                    placeholder="Enter Barcode ID"
                />
                <button onClick={handleGetBarcode}>Get Barcode</button>
            </div>

            {barcodeImage && (
                <div style={{ marginTop: '20px' }}>
                    <img src={barcodeImage} alt="Barcode" style={{ height: "100px" }} />
                    <div>
                        <button onClick={handlePrint}>Print Barcode</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryHome;
