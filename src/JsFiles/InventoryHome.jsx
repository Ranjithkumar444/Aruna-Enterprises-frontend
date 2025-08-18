import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReelStockChart from './ReelStockCharts';

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
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8 font-sans">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Inventory Management
                </h1>
                <p className="text-gray-600 text-center text-sm">
                    Manage reel inventory and track stock levels
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto" role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Main Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Primary Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button 
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Reel
                    </button>
                    <button 
                        className="flex items-center justify-center px-6 py-4 bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={() => navigate("/admin/dashboard/admin/inventory/reel")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Reel Stocks
                    </button>
                    <button 
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate("/admin/dashboard/admin/inventory/manipulateReel")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manipulate Reel
                    </button>
                    <button 
                        className="flex items-center justify-center px-6 py-4 bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={() => navigate("/admin/dashboard/admin/inventory/reel/usage")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Reel Usage Search
                    </button>
                    <button 
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate("/admin/dashboard/admin/inventory/reel/stock")}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Reel Stocks Alert
                    </button>
                </div>
            </div>

            {/* Stock Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Stock Overview</h2>
                <ReelStockChart/>
            </div>

            {/* Utility Functions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Barcode Retrieval */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Retrieve Reel Details & Barcode</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <input
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={handleGetBarcode}
                                disabled={loading || !barcodeId.trim()}
                            >
                                {loading ? 'Loading...' : 'Get Barcode'}
                            </button>
                        </div>

                        {barcodeImage && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <img src={barcodeImage} alt="Barcode" className="w-32 h-auto object-contain rounded border border-gray-300" />
                                    </div>
                                    {reelDetails && (
                                        <div className="flex-1 text-gray-700 text-sm">
                                            <h4 className="font-semibold text-gray-900 mb-2">Reel Details</h4>
                                            <div className="grid grid-cols-1 gap-1">
                                                <p><span className="font-medium">REEL NO:</span> {reelDetails.reelNo || 'N/A'}</p>
                                                <p><span className="font-medium">GSM:</span> {reelDetails.gsm}</p>
                                                <p><span className="font-medium">Deckle:</span> {reelDetails.deckle}</p>
                                                <p><span className="font-medium">Initial Weight:</span> {reelDetails.initialWeight} kg</p>
                                                <p><span className="font-medium">Current Weight:</span> {reelDetails.currentWeight} kg</p>
                                                <p><span className="font-medium">Burst Factor:</span> {reelDetails.burstFactor}</p>
                                                <p><span className="font-medium">Supplier:</span> {reelDetails.supplierName}</p>
                                                <p><span className="font-medium">Paper Type:</span> {reelDetails.paperType}</p>
                                            </div>
                                            <button 
                                                className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" 
                                                onClick={handlePrint}
                                                disabled={!barcodeImage || !reelDetails}
                                            >
                                                Print Barcode Sticker
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search History */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Reel History</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <input
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={handleSearchHistory}
                                disabled={!searchBarcode.trim()}
                            >
                                Search History
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Search for detailed reel usage history and tracking information
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryHome;