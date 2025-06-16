import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CssFiles/ReelHistoryComponent.css"

const ReelHistoryComponent = () => {
  const { barcodeId: urlBarcode } = useParams();
  const navigate = useNavigate();

  const [barcodeId, setBarcodeId] = useState(urlBarcode || '');
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [printData, setPrintData] = useState([]);

  useEffect(() => {
    if (urlBarcode) {
      fetchHistory(urlBarcode);
    }
  }, [urlBarcode]);

  const fetchHistory = async (barcode) => {
    if (!barcode.trim()) {
      alert('Please enter a barcode ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/reel/orderReelUsage/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          usageType: usage.usageType,
          courgationIn: usage.courgationIn,
          courgationOut: usage.courgationOut,
        }))
      );
    } catch (error) {
      alert('Error fetching history: ' + error.message);
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (barcodeId.trim()) {
      navigate(`/admin/dashboard/admin/inventory/reel-history/${encodeURIComponent(barcodeId)}`);
    }
  };

  const printStickers = () => {
    const printWindow = window.open('', '_blank');

    const printContent = printData.map((item, index) => `
      <div style="width: 2.8in; height: 4.8in; border: 1px solid #000; padding: 5px; margin: 5px; font-family: Arial; font-size: 8px; page-break-after: always;">
        <h3 style="text-align: center; margin: 2px 0; font-size: 10px;">Reel Usage History</h3>
        <p><strong>Barcode:</strong> ${barcodeId}</p>
        <p><strong>Entry ${index + 1} of ${printData.length}</strong></p>
        <hr style="margin: 3px 0;"/>
        <p><strong>Client:</strong> ${item.client}</p>
        <p><strong>Product Type:</strong> ${item.productType}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Size:</strong> ${item.size}</p>
        <p><strong>Unit:</strong> ${item.unit}</p>
        <p><strong>Boxes Made:</strong> ${item.howManyBox}</p>
        <p><strong>Weight Consumed:</strong> ${item.weightConsumed?.toFixed(2) || '0.00'}</p>
        <p><strong>Usage Type:</strong> ${item.usageType}</p>
        <hr style="margin: 3px 0;"/>
        <p style="text-align: center; font-size: 7px;">Printed on: ${new Date().toLocaleString()}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
      <head>
        <title>Reel Usage Stickers</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: 2.8in 4.8in; margin: 0; }
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
    { title: 'Usage Type', key: 'usageType' },
    { title: 'Date In', key: 'courgationIn' },
    { title: 'Date Out', key: 'courgationOut' },
  ];

  return (
    <div className="reel-history-container">
      <div className="reel-history-controls">
        <input
          className="reel-history-input"
          placeholder="Enter Reel Barcode ID"
          value={barcodeId}
          onChange={(e) => setBarcodeId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="reel-history-button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
        {historyData && (
          <button
            className="reel-history-button print"
            onClick={printStickers}
            disabled={printData.length === 0}
          >
            Print Stickers
          </button>
        )}
      </div>

      {historyData && (
        <div className="reel-history-table-wrapper">
          <h2 className="reel-history-heading">Reel Usage History: {historyData.barcodeId}</h2>
          <table className="reel-history-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyData.usages.map((item, index) => (
                <tr key={index}>
                  <td>{item.client}</td>
                  <td>{item.productType}</td>
                  <td>{item.quantity}</td>
                  <td>{item.size}</td>
                  <td>{item.unit}</td>
                  <td>{item.howManyBox}</td>
                  <td>{item.weightConsumed?.toFixed(2) || '0.00'}</td>
                  <td>{item.usageType}</td>
                  <td>{item.courgationIn ? new Date(item.courgationIn).toLocaleString() : '-'}</td>
                  <td>{item.courgationOut ? new Date(item.courgationOut).toLocaleString() : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReelHistoryComponent;
