import React, { useState } from 'react';
import axios from 'axios';

const ReelUsageSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [usageData, setUsageData] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setUsageData([]);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Admin token not found. Please login again.');
      return;
    }

    try {
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/reel/usage/${searchInput}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsageData(response.data);
    } catch (err) {
      console.error(err);
      setError('Reel usage data not found or invalid token.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Search Reel Usage</h2>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Enter Reel No or Barcode ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4 font-medium">{error}</div>
      )}

      {usageData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Reel No</th>
                <th className="px-4 py-2 border">Barcode ID</th>
                <th className="px-4 py-2 border">Used Weight (kg)</th>
                <th className="px-4 py-2 border">Used At</th>
                <th className="px-4 py-2 border">Used By</th>
                <th className="px-4 py-2 border">Reel Set</th>
                <th className="px-4 py-2 border">Box Details</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{item.reelNo}</td>
                  <td className="px-4 py-2 border text-center">{item.barcodeId}</td>
                  <td className="px-4 py-2 border text-center">{item.usedWeight}</td>
                  <td className="px-4 py-2 border text-center">{new Date(item.usedAt).toLocaleString()}</td>
                  <td className="px-4 py-2 border text-center">{item.usedBy}</td>
                  <td className="px-4 py-2 border text-center">{item.reelSet}</td>
                  <td className="px-4 py-2 border text-center">{item.boxDetails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReelUsageSearch;
