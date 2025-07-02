import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReelHistoryComponent = () => {
  const { barcodeId: urlBarcode } = useParams();
  const navigate = useNavigate();

  const [barcodeId, setBarcodeId] = useState(urlBarcode || '');
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [printData, setPrintData] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (urlBarcode) {
      fetchHistory(urlBarcode);
    }
  }, [urlBarcode]); 

  const fetchHistory = async (barcode) => {
    if (!barcode.trim()) {
      setError('Please enter a barcode ID.');
      setHistoryData(null); 
      return;
    }

    setLoading(true);
    setError(null); 
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError('Authentication token missing. Please log in.');
        setLoading(false);
        
        
        return;
      }

      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/reel/orderReelUsage/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      setHistoryData(response.data);
      setPrintData(
        response.data.usages.map((usage) => ({
          client: usage.client,
          productType: usage.productType,
          quantity: usage.quantity,
          size: usage.size,
          unit: usage.unit,
          howManyBox: usage.howManyBox,
          weightConsumed: usage.weightConsumed,
          previousWeight: usage.previousWeight, 
          usageType: usage.usageType,
          courgationIn: usage.courgationIn,
          courgationOut: usage.courgationOut,
        }))
      );
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || err.message || 'Error fetching history data.');
      setHistoryData(null);
      setPrintData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (barcodeId.trim()) {
      navigate(`/admin/dashboard/admin/inventory/reel-history/${encodeURIComponent(barcodeId)}`);
      
    } else {
      setError('Please enter a barcode ID.');
    }
  };

  const printStickers = () => {
    if (printData.length === 0) {
      setError('No usage data to print stickers for.');
      return;
    }

    const printWindow = window.open('', '_blank');

    
    const stickerWidthIn = 2.8;
    const stickerHeightIn = 4.8;
    
    
    

    const printContent = printData.map((item, index) => `
      <div style="width: ${stickerWidthIn}in; height: ${stickerHeightIn}in; border: 1px solid #000; padding: 5px; margin: 5px; font-family: Arial; font-size: 8px; page-break-after: always; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; text-align: center;">
        <h3 style="text-align: center; margin: 2px 0; font-size: 10px; font-weight: bold;">Reel Usage History</h3>
        <p style="margin: 1px 0;"><strong>Barcode:</strong> ${barcodeId}</p>
        <p style="margin: 1px 0;"><strong>Entry ${index + 1} of ${printData.length}</strong></p>
        <hr style="width: 90%; border: none; border-top: 1px dashed #ccc; margin: 3px auto;"/>
        <div style="text-align: left; width: 90%;">
          <p style="margin: 1px 0;"><strong>Client:</strong> ${item.client}</p>
          <p style="margin: 1px 0;"><strong>Product Type:</strong> ${item.productType}</p>
          <p style="margin: 1px 0;"><strong>Quantity:</strong> ${item.quantity}</p>
          <p style="margin: 1px 0;"><strong>Size:</strong> ${item.size}</p>
          <p style="margin: 1px 0;"><strong>Unit:</strong> ${item.unit}</p>
          <p style="margin: 1px 0;"><strong>Boxes Made:</strong> ${item.howManyBox}</p>
          <p style="margin: 1px 0;"><strong>Weight Consumed:</strong> ${item.weightConsumed?.toFixed(2) || '0.00'}</p>
          <p style="margin: 1px 0;"><strong>Previous Weight:</strong> ${item.previousWeight?.toFixed(2) || '0.00'}</p>
          <p style="margin: 1px 0;"><strong>Usage Type:</strong> ${item.usageType}</p>
          <p style="margin: 1px 0;"><strong>Date In:</strong> ${item.courgationIn ? new Date(item.courgationIn).toLocaleString() : '-'}</p>
          <p style="margin: 1px 0;"><strong>Date Out:</strong> ${item.courgationOut ? new Date(item.courgationOut).toLocaleString() : 'Active'}</p>
        </div>
        <hr style="width: 90%; border: none; border-top: 1px dashed #ccc; margin: 3px auto;"/>
        <p style="text-align: center; font-size: 7px; margin: 2px 0;">Printed on: ${new Date().toLocaleString()}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
      <head>
        <title>Reel Usage Stickers</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; }
            @page { size: ${stickerWidthIn}in ${stickerHeightIn}in; margin: 0; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 100);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const columns = [
    { title: 'Client', key: 'client' },
    { title: 'Product Type', key: 'productType' },
    { title: 'Quantity', key: 'quantity' },
    { title: 'Size', key: 'size' },
    { title: 'Unit', key: 'unit' },
    { title: 'Boxes Made', key: 'howManyBox' },
    { title: 'Weight Consumed', key: 'weightConsumed' },
    { title: 'Previous Weight', key: 'previousWeight' },
    { title: 'Usage Type', key: 'usageType' },
    { title: 'Date In', key: 'courgationIn' },
    { title: 'Date Out', key: 'courgationOut' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight md:text-5xl">
          Reel Usage History
        </h2>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
          <input
            className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm max-w-xs sm:max-w-none"
            placeholder="Enter Reel Barcode ID"
            value={barcodeId}
            onChange={(e) => setBarcodeId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-lg w-full sm:w-auto"
            onClick={handleSearch}
            disabled={loading || !barcodeId.trim()}
          >
            {loading ? 'Searching...' : 'Search History'}
          </button>
          {historyData && ( 
            <button
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-lg w-full sm:w-auto"
              onClick={printStickers}
              disabled={printData.length === 0}
            >
              Print Usage Stickers
            </button>
          )}
        </div>

        
        {loading && (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-gray-700">Loading reel history...</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 text-center shadow-md">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        
        {!loading && !error && historyData && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-700 p-6 pb-4 border-b-2 border-blue-200">
              Usage for Barcode ID: <span className="text-blue-700">{historyData.barcodeId}</span>
            </h3>
            {historyData.usages.length === 0 ? (
                <p className="px-6 py-8 text-center text-gray-500 text-base">No usage records found for this reel.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                    {columns.map((col) => (
                        <th key={col.key} scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {col.title}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {historyData.usages.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.productType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.howManyBox}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">{item.weightConsumed?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-semibold">{item.previousWeight?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                                {item.usageType?.replace(/_/g, ' ') || 'N/A'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.courgationIn ? new Date(item.courgationIn).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.courgationOut ? new Date(item.courgationOut).toLocaleString() : <span className="font-semibold text-orange-600">Active</span>}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelHistoryComponent;