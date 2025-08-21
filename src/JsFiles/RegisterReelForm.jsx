import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReelForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reelNo: '',
    gsm: '',
    burstFactor: '',
    deckle: '',
    initialWeight: '',
    unit: '',
    paperType: '',
    supplierName: '',
    createdBy: '',
  });

  const [barcodeData, setBarcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    if (adminDetails?.email) {
      setFormData(prev => ({ ...prev, createdBy: adminDetails.email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['gsm', 'burstFactor', 'deckle', 'initialWeight', 'reelNo'].includes(name) && value && isNaN(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Authentication token missing");

      const requiredFields = ['reelNo', 'gsm', 'burstFactor', 'deckle', 'initialWeight', 'unit', 'paperType', 'supplierName'];
      for (const field of requiredFields) {
        if (!formData[field]?.trim()) {
          throw new Error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }

      const payload = {
        ...formData,
        reelNo: Number(formData.reelNo),
        gsm: Number(formData.gsm),
        burstFactor: Number(formData.burstFactor),
        deckle: Number(formData.deckle),
        initialWeight: Number(formData.initialWeight),
      };

      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/register-reel",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const barcodeId = response.data.barcodeId;

      const [barcodeResponse, detailsResponse] = await Promise.all([
        axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${barcodeId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }),
        axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/details/${barcodeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const base64Image = btoa(
        new Uint8Array(barcodeResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const imageUrl = `data:image/png;base64,${base64Image}`;

      setBarcodeData({
        imageUrl,
        details: detailsResponse.data
      });

    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to register reel');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!barcodeData) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            @page {
              size: 2.90in 3.90in;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              width: 2.90in;
              height: 3.90in;
            }
            .sticker {
              width: 100%;
              height: 60%;
              padding: 8px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .company-name {
              font-weight: bold;
              font-size: 13px;
              margin: 5px 0;
            }
            .barcode-image {
              width: 120%;
              height: auto;
              max-height: 60%;
              margin: 5px 0;
            }
            .details {
              font-size: 14px;
              line-height: 1.3;
              width: 100%;
              text-align: center;
              padding: 0 5px;
            }
            .details p {
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="company-name">Aruna Enterprises</div>
            <img src="${barcodeData.imageUrl}" class="barcode-image" />
            <div class="details">
              <p><strong>Barcode ID:</strong> ${barcodeData.details.barcodeId}</p>
              <p><strong>Reel No:</strong> ${barcodeData.details.reelNo || 'N/A'}</p>
              <p><strong>GSM:</strong> ${barcodeData.details.gsm}</p>
              <p><strong>Deckle:</strong> ${barcodeData.details.deckle}</p>
              <p><strong>Weight:</strong> ${barcodeData.details.currentWeight} kg</p>
              <p><strong>Supplier:</strong> ${barcodeData.details.supplierName}</p>
              <p><strong>Paper Type:</strong> ${barcodeData.details.paperType}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetForm = () => {
    setFormData({
      reelNo: '',
      gsm: '',
      burstFactor: '',
      deckle: '',
      initialWeight: '',
      unit: '',
      paperType: '',
      supplierName: '',
      createdBy: formData.createdBy,
    });
    setBarcodeData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Register New Reel</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Reel No', name: 'reelNo', type: 'text', pattern: '[0-9]*' },
            { label: 'GSM', name: 'gsm', type: 'text', pattern: '[0-9]*' },
            { label: 'Burst Factor', name: 'burstFactor', type: 'text', pattern: '[0-9]*' },
            { label: 'Deckle', name: 'deckle', type: 'text', pattern: '[0-9]*' },
            { label: 'Initial Weight (kg)', name: 'initialWeight', type: 'text', pattern: '[0-9]*' },
            { label: 'Unit', name: 'unit', type: 'text' },
            { label: 'Paper Type', name: 'paperType', type: 'text' },
            { label: 'Supplier Name', name: 'supplierName', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                pattern={field.pattern}
                inputMode={field.pattern ? 'numeric' : 'text'}
              />
            </div>
          ))}

          <div className="md:col-span-2 flex justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              {loading ? 'Submitting...' : 'Register Reel'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
            >
              Reset
            </button>
          </div>
        </form>

        {barcodeData && (
          <div className="mt-10 bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-4">Reel Registered Successfully!</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={barcodeData.imageUrl} alt="Barcode" className="w-40 border p-2 bg-white" />
              <div className="text-sm text-gray-700">
                <p><strong>Barcode ID:</strong> {barcodeData.details.barcodeId}</p>
                <p><strong>Reel No:</strong> {barcodeData.details.reelNo}</p>
                <p><strong>GSM:</strong> {barcodeData.details.gsm}</p>
                <p><strong>Deckle:</strong> {barcodeData.details.deckle}</p>
                <p><strong>Weight:</strong> {barcodeData.details.currentWeight} kg</p>
                <p><strong>Supplier:</strong> {barcodeData.details.supplierName}</p>
                <p><strong>Paper Type:</strong> {barcodeData.details.paperType}</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handlePrint}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded"
              >
                Print Barcode Sticker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelForm;