import React, { useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Colors for charts (can be customized further)
const COLORS = ['#4A90E2', '#50E3C2', '#F8E71C', '#FF6B6B', '#8E44AD', '#3498DB', '#1ABC9C', '#F39C12'];

const DailyReelUsageReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]); // For the detailed order-wise table
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for chart data
  const [totalOverallWeight, setTotalOverallWeight] = useState(0);
  const [dailyWeightData, setDailyWeightData] = useState([]);
  const [paperTypeData, setPaperTypeData] = useState([]);
  const [gsmData, setGsmData] = useState([]);
  const [deckleData, setDeckleData] = useState([]);
  const [bfData, setBfData] = useState([]); // Burst Factor data

  const API_BASE_URL = 'https://arunaenterprises.azurewebsites.net/admin/daily-reel-usage';

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setReportData([]);
    // Clear chart data as well
    setTotalOverallWeight(0);
    setDailyWeightData([]);
    setPaperTypeData([]);
    setGsmData([]);
    setDeckleData([]);
    setBfData([]);

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin token not found in local storage. Please log in.');
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      setLoading(false);
      return;
    }

    try {
      const params = {
        startDate: `${startDate}T00:00:00Z`, // Assuming start of the day
        endDate: `${endDate}T23:59:59Z`,     // Assuming end of the day
      };

      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        params: params,
      });

      // Process data for the detailed order-wise table
      const aggregatedTableData = aggregateDataByOrderForTable(response.data);
      setReportData(aggregatedTableData);

      // Process data for all charts
      processChartData(response.data);

    } catch (err) {
      console.error('Error fetching daily reel usage:', err);
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data || err.message}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to aggregate data for the detailed order-wise table
  const aggregateDataByOrderForTable = (data) => {
    const ordersMap = new Map();

    data.forEach(item => {
      if (!ordersMap.has(item.orderId)) {
        ordersMap.set(item.orderId, {
          orderId: item.orderId,
          clientName: item.clientName,
          productType: item.productType, // From Order entity
          productName: item.productName, // From Order entity
          typeOfProduct: item.typeOfProduct, // Another product type from Order entity
          totalWeightConsumed: 0,
          reelsUsed: [], // To store details of each reel used for this order
        });
      }

      const orderEntry = ordersMap.get(item.orderId);
      orderEntry.totalWeightConsumed += item.weightConsumed;
      orderEntry.reelsUsed.push({
        reelBarcodeId: item.reelBarcodeId,
        reelNo: item.reelNo,
        paperType: item.paperType,
        initialWeight: item.initialWeight,
        weightConsumed: item.weightConsumed,
        courgationIn: item.courgationIn ? new Date(item.courgationIn).toLocaleString() : 'N/A',
        courgationOut: item.courgationOut ? new Date(item.courgationOut).toLocaleString() : 'N/A',
        deckle: item.deckle,
        currentWeight: item.currentWeight,
        previousWeight: item.previousWeight,
        gsm: item.gsm,
        burstFactor: item.bf, // Burst Factor from API is 'bf'
      });
    });

    return Array.from(ordersMap.values());
  };

  // Helper function to process data for charts
  const processChartData = (rawData) => {
    // Overall Total Weight Consumed
    const totalWeight = rawData.reduce((sum, item) => sum + item.weightConsumed, 0);
    setTotalOverallWeight(totalWeight);

    // Daily Weight Consumed Trend (Line Chart)
    const dailyMap = new Map();
    rawData.forEach(item => {
        // Use courgationOut for daily trend, and format to YYYY-MM-DD for consistent sorting
        const date = item.courgationOut ? new Date(item.courgationOut) : null;
        if (date) {
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + item.weightConsumed);
        }
    });
    const sortedDailyData = Array.from(dailyMap.entries())
                               .map(([date, weight]) => ({ date, weight: parseFloat(weight.toFixed(2)) })) // Format weight
                               .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
    setDailyWeightData(sortedDailyData);

    // Aggregations for Bar/Pie Charts (total weight consumed per category over the period)
    const aggregateByCategory = (data, keyField) => {
        const map = new Map();
        data.forEach(item => {
            const key = item[keyField] !== null && item[keyField] !== undefined ? item[keyField].toString() : 'N/A';
            map.set(key, (map.get(key) || 0) + item.weightConsumed);
        });
        return Array.from(map.entries()).map(([name, weight]) => ({ name, weight: parseFloat(weight.toFixed(2)) }));
    };

    setPaperTypeData(aggregateByCategory(rawData, 'paperType'));
    setGsmData(aggregateByCategory(rawData, 'gsm'));
    setDeckleData(aggregateByCategory(rawData, 'deckle'));
    setBfData(aggregateByCategory(rawData, 'bf')); // Use 'bf' as keyField
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-10 flex flex-col items-center font-inter text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-6xl mb-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
          📦 Daily Reel Usage Dashboard
        </h1>

        {/* Overall Total Weight Display */}
        {totalOverallWeight > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg mb-8 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-2">Total Weight Consumed (Selected Period):</h2>
            <p className="text-5xl font-extrabold animate-pulse">{totalOverallWeight.toFixed(2)} kg</p>
          </div>
        )}

        {/* Date Filters and Generate Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="startDate" className="block text-base font-semibold text-gray-700 mb-2">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 text-lg transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-base font-semibold text-gray-700 mb-2">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 text-lg transition duration-200"
            />
          </div>
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Generating Report...' : '📊 Generate Report'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-center space-x-2">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {totalOverallWeight > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-6xl mb-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">
            📈 Usage Trends and Breakdown
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Weight Consumed Line Chart */}
            {dailyWeightData.length > 0 && (
              <div className="chart-card bg-white p-5 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Daily Weight Consumed (kg)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyWeightData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666' }} />
                    <YAxis stroke="#666" tick={{ fill: '#666' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#f9f9f9', border: '1px solid #ddd' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="weight" stroke="#4A90E2" strokeWidth={2} activeDot={{ r: 6, fill: '#4A90E2', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weight Consumed by Paper Type (Bar Chart) */}
            {paperTypeData.length > 0 && (
              <div className="chart-card bg-white p-5 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Weight by Paper Type (kg)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paperTypeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                    <YAxis stroke="#666" tick={{ fill: '#666' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#f9f9f9', border: '1px solid #ddd' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="weight">
                      {paperTypeData.map((entry, index) => (
                        <Cell key={`cell-paper-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weight Consumed by GSM (Bar Chart) */}
            {gsmData.length > 0 && (
              <div className="chart-card bg-white p-5 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Weight by GSM (kg)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gsmData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                    <YAxis stroke="#666" tick={{ fill: '#666' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#f9f9f9', border: '1px solid #ddd' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="weight">
                      {gsmData.map((entry, index) => (
                        <Cell key={`cell-gsm-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weight Consumed by Deckle (Bar Chart) */}
            {deckleData.length > 0 && (
              <div className="chart-card bg-white p-5 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Weight by Deckle (kg)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deckleData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                    <YAxis stroke="#666" tick={{ fill: '#666' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#f9f9f9', border: '1px solid #ddd' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="weight">
                      {deckleData.map((entry, index) => (
                        <Cell key={`cell-deckle-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weight Consumed by Burst Factor (Bar Chart) */}
            {bfData.length > 0 && (
              <div className="chart-card bg-white p-5 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Weight by Burst Factor (kg)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bfData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                    <YAxis stroke="#666" tick={{ fill: '#666' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#f9f9f9', border: '1px solid #ddd' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="weight">
                      {bfData.map((entry, index) => (
                        <Cell key={`cell-bf-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order-wise Detailed Table Section */}
      {reportData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-200">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">
            Detailed Order-wise Reel Usage
          </h2>
          {reportData.map(order => (
            <div key={order.orderId} className="border-b border-gray-200 pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0">
              <div className="bg-blue-50 p-5 rounded-lg shadow-md mb-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Order ID: {order.orderId}</h3>
                <p className="text-gray-700 text-lg mb-1">Client: <span className="font-semibold text-blue-800">{order.clientName}</span></p>
                <p className="text-gray-700 text-lg mb-1">Product Type (Order): <span className="font-semibold">{order.productType}</span></p>
                <p className="text-gray-700 text-lg mb-1">Product Name: <span className="font-semibold">{order.productName || 'N/A'}</span></p>
                <p className="text-gray-700 text-lg mb-3">Type of Product (Order): <span className="font-semibold">{order.typeOfProduct || 'N/A'}</span></p>
                <p className="text-xl font-bold text-blue-800 mt-2">Total Weight Consumed for Order: <span className="text-green-600 text-2xl">{order.totalWeightConsumed.toFixed(2)} kg</span></p>
              </div>

              {order.reelsUsed.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Individual Reels Used:</h4>
                  <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Reel Barcode ID</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Reel No</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Deckle</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Paper Type</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Initial Wt (kg)</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Consumed Wt (kg)</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Current Wt (kg)</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Previous Wt (kg)</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Burst Factor</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">GSM</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Courgation In</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Courgation Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.reelsUsed.map((reel, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.reelBarcodeId}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.reelNo}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.deckle || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.paperType || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.initialWeight !== undefined ? reel.initialWeight.toFixed(2) : 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.weightConsumed !== undefined ? reel.weightConsumed.toFixed(2) : 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.currentWeight || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.previousWeight || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.burstFactor || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.gsm || 'N/A'}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.courgationIn}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{reel.courgationOut}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {order.reelsUsed.length === 0 && (
                <p className="text-gray-600 mt-4 text-center text-lg">No reel usage details found for this order in the selected period.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {reportData.length === 0 && !loading && !error && (
        <div className="mt-10 p-6 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg w-full max-w-xl text-center shadow-md">
          <p className="text-xl font-semibold">Select a date range and click "Generate Report" to see data. 🗓️</p>
          <p className="text-md mt-2">Make sure your backend server is running and accessible.</p>
        </div>
      )}
    </div>
  );
};

export default DailyReelUsageReport;
