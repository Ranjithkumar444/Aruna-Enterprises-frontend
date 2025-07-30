import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReelStockChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allReels, setAllReels] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('all'); // 'all', 'A', 'B'

  useEffect(() => {
    const fetchReelStocks = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          setError('Admin token not found in localStorage.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8080/admin/inventory/getReelStocks', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        const data = response.data;
        setAllReels(data);
        
        // Process data based on selected unit
        processChartData(data, selectedUnit);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reel stocks:', err);
        setError('Failed to load reel stock data.');
        setLoading(false);
      }
    };

    fetchReelStocks();
  }, [selectedUnit]);

  const processChartData = (data, unitFilter) => {
    let filteredData = data;
    
    // Filter by unit if not 'all'
    if (unitFilter !== 'all') {
      filteredData = data.filter(reel => reel.unit === unitFilter);
    }

    // Group by GSM, Burst Factor, and Paper Type
    const groupedData = filteredData.reduce((acc, reel) => {
      const key = `${reel.gsm} GSM, ${reel.burstFactor} BF, ${reel.paperTypeNormalized}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += reel.currentWeight;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const weights = Object.values(groupedData);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Total Current Weight (kg)',
          data: weights,
          backgroundColor: 'rgba(17, 63, 103, 0.8)', // 113F67 with opacity
          borderColor: 'rgba(17, 63, 103, 1)', // 113F67
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 40,
          barPercentage: 0.4,
          categoryPercentage: 0.7,
        },
      ],
    });
  };

  const handleUnitFilter = (unit) => {
    setSelectedUnit(unit);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151', // Dark grey
          font: {
            size: 14,
            weight: '600'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: `Reel Stock Inventory ${selectedUnit !== 'all' ? `- Unit ${selectedUnit}` : ''}`,
        color: '#113F67',
        font: {
          size: 18,
          weight: '700'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#113F67',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6B7280',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'unit',
                unit: 'kilogram',
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'GSM, Burst Factor, Paper Type',
          color: '#374151',
          font: { 
            weight: '600', 
            size: 13 
          },
          padding: {
            top: 10
          }
        },
        ticks: {
          color: '#6B7280',
          font: { 
            size: 11,
            weight: '500'
          },
          autoSkip: false,
          maxRotation: 60,
          minRotation: 45,
          padding: 8
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Current Weight (kg)',
          color: '#374151',
          font: { 
            weight: '600', 
            size: 13 
          },
          padding: {
            bottom: 10
          }
        },
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: { 
            size: 11,
            weight: '500'
          },
          padding: 8
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        }
      }
    },
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Stock Overview
            </h3>
            <p className="text-sm text-gray-600">
              Total reel weight distribution by specifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#113F67] rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Current Weight</span>
          </div>
        </div>

        {/* Unit Filter Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Filter by Unit:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleUnitFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedUnit === 'all'
                  ? 'bg-[#113F67] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Units
            </button>
            <button
              onClick={() => handleUnitFilter('A')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedUnit === 'A'
                  ? 'bg-[#113F67] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unit A
            </button>
            <button
              onClick={() => handleUnitFilter('B')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedUnit === 'B'
                  ? 'bg-[#113F67] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unit B
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allReels.filter(reel => selectedUnit === 'all' || reel.unit === selectedUnit).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#113F67] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Weight</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allReels
                    .filter(reel => selectedUnit === 'all' || reel.unit === selectedUnit)
                    .reduce((sum, reel) => sum + reel.currentWeight, 0)
                    .toLocaleString()} kg
                </p>
              </div>
              <div className="w-8 h-8 bg-[#113F67] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l1-6m-1 6l-6-2m0 0l-1 6m1-6l6 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#113F67]"></div>
              <span className="text-gray-600 font-medium">Loading chart data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          </div>
        ) : chartData.labels.length > 0 ? (
          <div className="h-96">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No data available for the selected filter.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelStockChart;
