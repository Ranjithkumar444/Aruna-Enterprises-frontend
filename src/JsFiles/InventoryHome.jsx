import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

        const stickerWidthPx = 2.9 * 96; 
        const stickerHeightPx = 3.9 * 96; 

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
                            font-size: 11px;
                            margin-bottom: 3px;
                            margin-top: 3px;
                        }
                        .barcode-image {
                            max-width: 95%;
                            height: auto;
                            max-height: 35%;
                            object-fit: contain;
                            margin-bottom: 3px;
                        }
                        .details {
                            font-size: 9px;
                            line-height: 1.2;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            width: 100%;
                            text-align: left;
                            padding: 0 5px;
                            box-sizing: border-box;
                        }
                        .details p {
                            margin: 1.5px 0;
                        }
                        @page {
                            size: ${2.9}in ${3.9}in;
                            margin: 0;
                        }
                        @media print {
                            body {
                                width: ${2.9}in;
                                height: ${3.9}in;
                                margin: 0;
                                padding: 0;
                                display: block;
                            }
                            .sticker {
                                border: none;
                            }
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-10 font-sans">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
                Inventory Management
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 max-w-xl mx-auto shadow-md" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                <button 
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 min-w-[200px]"
                    onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}
                >
                    Create Reel
                </button>
                <button 
                    className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 min-w-[200px]"
                    onClick={() => navigate("/admin/dashboard/admin/inventory/reel")}
                >
                    Reel Stocks
                </button>
                <button 
                    className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 min-w-[200px]"
                    onClick={() => navigate("/admin/dashboard/admin/inventory/manipulateReel")}
                >
                    Manipulate Reel
                </button>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-10 max-w-4xl mx-auto border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b-2 border-blue-200">Retrieve Reel Details & Barcode</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    <input
                        className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
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
                        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500" 
                        onClick={handleGetBarcode}
                        disabled={loading || !barcodeId.trim()}
                    >
                        {loading ? 'Loading...' : 'Get Barcode'}
                    </button>
                </div>

                {barcodeImage && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200 flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex-shrink-0">
                            <img src={barcodeImage} alt="Barcode" className="w-48 h-auto object-contain rounded-lg shadow-md border border-gray-200" />
                        </div>
                        {reelDetails && (
                            <div className="flex-1 text-gray-800 text-lg">
                                <h3 className="text-xl font-bold mb-3 border-b pb-2 border-blue-300 text-blue-800">Reel Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    <p><strong className="font-semibold text-gray-700">REEL NO:</strong> {reelDetails.reelNo || 'N/A'}</p>
                                    <p><strong className="font-semibold text-gray-700">GSM:</strong> {reelDetails.gsm}</p>
                                    <p><strong className="font-semibold text-gray-700">Deckle:</strong> {reelDetails.deckle}</p>
                                    <p><strong className="font-semibold text-gray-700">Initial Weight:</strong> {reelDetails.initialWeight} kg</p>
                                    <p><strong className="font-semibold text-gray-700">Current Weight:</strong> {reelDetails.currentWeight} kg</p>
                                    <p><strong className="font-semibold text-gray-700">Burst Factor:</strong> {reelDetails.burstFactor}</p>
                                    <p><strong className="font-semibold text-gray-700">Supplier Name:</strong> {reelDetails.supplierName}</p>
                                    <p><strong className="font-semibold text-gray-700">Paper Type:</strong> {reelDetails.paperType}</p>
                                </div>
                                <button 
                                    className="mt-6 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                                    onClick={handlePrint}
                                    disabled={!barcodeImage || !reelDetails}
                                >
                                    Print Barcode Sticker
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b-2 border-blue-200">Search Reel History</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    <input
                        className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
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
                        className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500" 
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