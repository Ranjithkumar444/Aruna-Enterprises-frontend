import React, { useEffect, useState } from 'react';
import '../CssFiles/InUseReelsTable.css'

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
        return date.toLocaleString();
    };

    if (loading) return <div className="loading">Loading reels data...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="reels-container">
            <h2>In-Use Reels with Usage Details</h2>
            
            {reels.length === 0 ? (
                <div className="empty">No in-use reels found</div>
            ) : (
                <div className="reels-list">
                    {reels.map((reel) => (
                        <div key={reel.barcodeId} className="reel-item">
                            <div 
                                className={`reel-header ${expandedReel === reel.barcodeId ? 'expanded' : ''}`}
                                onClick={() => toggleReel(reel.barcodeId)}
                            >
                                <div className="reel-main-info">
                                    <span className="barcode">Barcode: {reel.barcodeId}</span>
                                    <span className="reel-no">Reel No: {reel.reelNo}</span>
                                </div>
                                <div className="reel-weights">
                                    <span>Initial: {reel.initialWeight}</span>
                                    <span>Current: {reel.currentWeight}</span>
                                    <span>Previous: {reel.previousWeight}</span>
                                </div>
                                <div className="reel-specs">
                                    <span>Paper: {reel.paperType}</span>
                                    <span>GSM: {reel.gsm}</span>
                                    <span>Deckle: {reel.deckle}</span>
                                </div>
                                <div className="arrow">
                                    {expandedReel === reel.barcodeId ? '▼' : '▶'}
                                </div>
                            </div>

                            {expandedReel === reel.barcodeId && (
                                <div className="usage-details">
                                    <h3>Order Usages ({reel.orderUsages.length})</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Client</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Size</th>
                                                <th>Weight Used</th>
                                                <th>Usage In</th>
                                                <th>Usage Out</th>
                                                <th>Boxes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reel.orderUsages.map((usage, index) => (
                                                <tr key={index}>
                                                    <td>{usage.client}</td>
                                                    <td>{usage.productType}</td>
                                                    <td>{usage.quantity}</td>
                                                    <td>{usage.size}</td>
                                                    <td>{usage.weightConsumed}</td>
                                                    <td>{formatDate(usage.courgationIn)}</td>
                                                    <td>{formatDate(usage.courgationOut)}</td>
                                                    <td>{usage.howManyBox}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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