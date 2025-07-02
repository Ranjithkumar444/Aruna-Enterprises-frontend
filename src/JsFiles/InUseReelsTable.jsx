import React, { useEffect, useState } from 'react';
// Removed: import '../CssFiles/InUseReelsTable.css' // No longer needed

const InUseReelsWithDetails = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedReel, setExpandedReel] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) throw new Error('Authentication token not found');
                
                const response = await fetch('https://arunaenterprises.azurewebsites.net/admin/inventory/getInUseReelsWithDetails', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch data');
                }
                
                const data = await response.json();
                setReels(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleReel = (barcodeId) => {
        setExpandedReel(expandedReel === barcodeId ? null : barcodeId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        // Using toLocaleString with options for more control and elegance
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            // timeZoneName: 'short', // Optional: if you want to display timezone
        }).format(date);
    };

    if (loading) return <div className="p-8 text-center text-lg font-medium text-gray-700 bg-blue-50 rounded-lg shadow-md max-w-lg mx-auto my-8">Loading reels data...</div>;
    if (error) return <div className="p-8 text-center text-lg font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg shadow-md max-w-lg mx-auto my-8">Error: {error}</div>;

    return (
        <div className="font-sans max-w-6xl mx-auto my-5 p-5 bg-blue-50 rounded-xl shadow-lg">
            <h2 className="text-center text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
                In-Use Reels with Usage Details
            </h2>
            
            {reels.length === 0 ? (
                <div className="p-8 text-center text-lg font-medium text-gray-600 bg-gray-100 rounded-lg shadow-inner max-w-lg mx-auto my-8">No in-use reels found</div>
            ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xl">
                    {reels.map((reel) => (
                        <div key={reel.barcodeId} className="mb-2 last:mb-0 border-b last:border-b-0 border-gray-100">
                            <div 
                                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg relative rounded-lg 
                                ${expandedReel === reel.barcodeId ? 'bg-blue-100 shadow-md border-b border-blue-300' : ''}`}
                                onClick={() => toggleReel(reel.barcodeId)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-4 md:mb-0 w-full md:w-auto">
                                    <div className="flex flex-col min-w-[180px] text-gray-800">
                                        <span className="font-bold text-lg text-indigo-700 mb-1">Barcode: {reel.barcodeId}</span>
                                        <span className="text-sm text-gray-600">Reel No: {reel.reelNo}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-700">
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">Initial: <span className="font-bold">{reel.initialWeight}</span></span>
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">Current: <span className="font-bold">{reel.currentWeight}</span></span>
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">Previous: <span className="font-bold">{reel.previousWeight}</span></span>
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">UsageType: <span className="font-bold">{reel.usageType}</span></span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-700 mt-2 md:mt-0">
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">Paper: <span className="font-bold">{reel.paperType}</span></span>
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">GSM: <span className="font-bold">{reel.gsm}</span></span>
                                        <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">Deckle: <span className="font-bold">{reel.deckle}</span></span>
                                    </div>
                                </div>
                                <div className="absolute top-5 right-5 md:relative md:top-0 md:right-0 text-gray-600 text-xl transition-transform duration-300">
                                    {expandedReel === reel.barcodeId ? '▼' : '▶'}
                                </div>
                            </div>

                            {expandedReel === reel.barcodeId && (
                                <div className="p-5 bg-white border-t border-gray-200 rounded-b-lg shadow-inner overflow-x-auto">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-50">
                                        Order Usages (<span className="text-blue-600">{reel.orderUsages.length}</span>)
                                    </h3>
                                    {reel.orderUsages.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No usage details for this reel.</p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-blue-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Size</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Weight Used</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Usage In</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Usage Out</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Boxes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {reel.orderUsages.map((usage, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.client}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.productType}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.size}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.weightConsumed}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(usage.courgationIn)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(usage.courgationOut)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.howManyBox}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InUseReelsWithDetails;