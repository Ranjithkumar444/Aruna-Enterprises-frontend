import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderReelSuggestions = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedReelType, setSelectedReelType] = useState('ALL');
  
  // Get order details from navigation state
  const orderDetails = state?.order;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://arunaenterprises.azurewebsites.net/admin/order/${orderId}/suggested-reels`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            cancelToken: source.token
          }
        );

        setSuggestions(response.data);
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch suggested reels');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      source.cancel("Component unmounted, request canceled");
    };
  }, [orderId]);

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleReelTypeChange = (e) => {
    setSelectedReelType(e.target.value);
  };

  const getFilteredReels = () => {
  if (!suggestions) return [];

  let reels = [];
  if (selectedReelType === 'ALL' || selectedReelType === 'TOP') {
    reels = [...reels, ...suggestions.topGsmReels.map(r => ({ ...r, type: 'Top' }))];
  }
  if (selectedReelType === 'ALL' || selectedReelType === 'BOTTOM') {
    reels = [...reels, ...suggestions.bottomGsmReels.map(r => ({ ...r, type: 'Bottom' }))];
  }
  if (selectedReelType === 'ALL' || selectedReelType === 'FLUTE') {
    reels = [...reels, ...suggestions.fluteGsmReels.map(r => ({ ...r, type: 'Flute' }))];
  }

  if (selectedUnit !== 'ALL') {
    reels = reels.filter(reel => reel.unit === selectedUnit);
  }

  // Sort by currentWeight (ascending)
  reels.sort((a, b) => (a.currentWeight ?? 0) - (b.currentWeight ?? 0));

  return reels;
};


  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOT_IN_USE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>;
      case 'IN_USE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">In Use</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-blue-600">Loading suggested reels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const filteredReels = getFilteredReels();
  const uniqueUnits = ['ALL', ...new Set(filteredReels.map(reel => reel.unit).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Suggested Reels for Order #{orderId}
          </h2>
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Orders
          </button>
        </div>

        {orderDetails && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{orderDetails.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-medium">{orderDetails.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product Type</p>
                <p className="font-medium">{orderDetails.productType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium">{orderDetails.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unit</p>
                <p className="font-medium">{orderDetails.unit || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{orderDetails.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="reel-type" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Reel Type
            </label>
            <select
              id="reel-type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
              value={selectedReelType}
              onChange={handleReelTypeChange}
            >
              <option value="ALL">All Types</option>
              <option value="TOP">Top GSM Reels</option>
              <option value="BOTTOM">Bottom GSM Reels</option>
              {suggestions?.fluteRequired && <option value="FLUTE">Flute GSM Reels</option>}
            </select>
          </div>
          <div>
            <label htmlFor="unit-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Unit
            </label>
            <select
              id="unit-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
              value={selectedUnit}
              onChange={handleUnitChange}
            >
              {uniqueUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit === 'ALL' ? 'All Units' : `Unit ${unit}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredReels.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            <p>No reels found matching your filters.</p>
            <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Barcode ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reel No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GSM</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deckle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Current Weight</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReels.map((reel, index) => (
                  <tr key={`${reel.type}-${index}`} className="hover:bg-blue-50 transition duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reel.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.barcodeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.reelNo || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.gsm}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.deckle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.unit || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.currentWeight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(reel.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {suggestions?.message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            {suggestions.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReelSuggestions;