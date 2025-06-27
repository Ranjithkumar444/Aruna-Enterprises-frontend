import React, { useState, useEffect, useRef } from 'react';
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

  const [barcodeId, setBarcodeId] = useState(null);
  const [barcodeImageUrl, setBarcodeImageUrl] = useState(null);
  const [reelDetails, setReelDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const printRef = useRef();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (barcodeId) {
      fetchReelDetails(barcodeId);
    }
  }, [barcodeId]); 

  const fetchReelDetails = async (id) => {
    try {
      const response = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/reel/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setReelDetails(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching reel details", error);
      setError("Failed to fetch reel details. Please check the reel number or barcode ID.");
    }
  };

  useEffect(() => {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    if (adminDetails?.email) {
      setFormData(prev => ({ ...prev, createdBy: adminDetails.email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['gsm', 'burstFactor', 'deckle', 'initialWeight', 'reelNo'].includes(name)) {
      if (value && isNaN(Number(value))) { 
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.reelNo || isNaN(Number(formData.reelNo))) {
        throw new Error("Reel No must be a valid number.");
      }
      if (!formData.gsm || isNaN(Number(formData.gsm))) {
        throw new Error("GSM must be a valid number.");
      }
      if (!formData.burstFactor || isNaN(Number(formData.burstFactor))) {
        throw new Error("Burst Factor must be a valid number.");
      }
      if (!formData.deckle || isNaN(Number(formData.deckle))) {
        throw new Error("Deckle must be a valid number.");
      }
      if (!formData.initialWeight || isNaN(Number(formData.initialWeight))) {
        throw new Error("Initial Weight must be a valid number.");
      }
      for (const key in formData) {
        if (typeof formData[key] === 'string' && formData[key].trim() === '' && key !== 'createdBy') {
          throw new Error(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
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

      const id = response.data.barcodeId;
      setBarcodeId(id);

      const imageResponse = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/reel/barcode-image/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );

      
      const base64Image = btoa(
        new Uint8Array(imageResponse.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setBarcodeImageUrl(`data:image/png;base64,${base64Image}`);

      alert('Reel registered successfully!');
      resetForm();
    } catch (error) {
      console.error('Error registering reel:', error);
      setError(error.response?.data?.message || error.message || 'Failed to register reel');
      setBarcodeId(null); 
      setBarcodeImageUrl(null);
      setReelDetails(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      reelNo: '',
      gsm: '',
      burstFactor: '',
      deckle: '',
      initialWeight: '',
      unit: '',
      paperType: '',
      supplierName: '',
      createdBy: prev.createdBy, 
    }));
    setBarcodeId(null);
    setBarcodeImageUrl(null);
    setReelDetails(null);
    setError(null);
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    
    const stickerWidthPx = 2.9 * 96; 
    const stickerHeightPx = 3.9 * 96; 

    const printContents = `
        <div style="
            width: ${stickerWidthPx}px;
            height: ${stickerHeightPx}px;
            padding: 4px; /* Adjust padding as needed for border or spacing */
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; /* Align content to the top */
            align-items: center; /* Center horizontally */
            text-align: center;
            overflow: hidden; /* Ensure content stays within the sticker */
            font-family: sans-serif;
        ">
            <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px; margin-top: 3px;">Aruna Enterprises</div>
            <img src="${barcodeImageUrl}" alt="Barcode" style="max-width: 95%; height: auto; max-height: 35%; object-fit: contain; margin-bottom: 3px;" />
            <div style="font-size: 9px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: left; padding: 0 5px; box-sizing: border-box;">
                <p style="margin: 1.5px 0;"><strong>Barcode ID:</strong> ${barcodeId}</p>
                <p style="margin: 1.5px 0;"><strong>ReelNo:</strong> ${reelDetails?.reelNo || 'N/A'}</p>
                <p style="margin: 1.5px 0;"><strong>GSM:</strong> ${reelDetails?.gsm}</p>
                <p style="margin: 1.5px 0;"><strong>Deckle:</strong> ${reelDetails?.deckle}</p>
                <p style="margin: 1.5px 0;"><strong>Initial Wt:</strong> ${reelDetails?.initialWeight} kg</p>
                <p style="margin: 1.5px 0;"><strong>Current Wt:</strong> ${reelDetails?.currentWeight} kg</p>
                <p style="margin: 1.5px 0;"><strong>Burst Factor:</strong> ${reelDetails?.burstFactor}</p>
                <p style="margin: 1.5px 0;"><strong>Supplier:</strong> ${reelDetails?.supplierName}</p>
                <p style="margin: 1.5px 0;"><strong>Paper Type:</strong> ${reelDetails?.paperType}</p>
            </div>
        </div>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            @page {
                size: ${2.9}in ${3.9}in;
                margin: 0;
            }
            body { margin: 0; padding: 0; font-family: sans-serif; }
            @media print {
                body {
                    width: ${2.9}in;
                    height: ${3.9}in;
                    margin: 0;
                    padding: 0;
                    display: block;
                }
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
    
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Register New Reel</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 text-center shadow-md" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Reel No', name: 'reelNo', type: 'text', placeholder: 'Enter reel number', required: true },
            { label: 'GSM', name: 'gsm', type: 'text', placeholder: 'e.g. 80, 100, 120', required: true },
            { label: 'Burst Factor', name: 'burstFactor', type: 'text', placeholder: 'e.g. 25, 30', required: true },
            { label: 'Deckle', name: 'deckle', type: 'text', placeholder: 'Enter deckle size', required: true },
            { label: 'Initial Weight', name: 'initialWeight', type: 'text', placeholder: 'e.g. 500 kg', required: true },
            { label: 'Unit', name: 'unit', type: 'text', placeholder: 'e.g. A, B', required: true },
            { label: 'Paper Type', name: 'paperType', type: 'text', placeholder: 'e.g. Kraft, Duplex', required: true },
            { label: 'Supplier Name', name: 'supplierName', type: 'text', placeholder: 'Supplier full name', required: true },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label htmlFor={field.name} className="block text-gray-700 text-sm font-semibold mb-2">
                {field.label}
              </label>
              <input
                type={field.type === 'number' ? 'text' : field.type} 
                inputMode={field.type === 'number' ? 'numeric' : undefined} 
                pattern={field.type === 'number' ? '[0-9]*' : undefined}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
              />
            </div>
          ))}

          <div className="flex flex-col md:col-span-2"> 
            <label htmlFor="createdBy" className="block text-gray-700 text-sm font-semibold mb-2">
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={formData.createdBy}
              readOnly
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-lg shadow-sm"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6 justify-center"> 
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Submitting...' : 'Register Reel'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reset Form
            </button>
          </div>
        </form>

        {barcodeImageUrl && reelDetails && (
          <div className="mt-12 p-8 bg-green-50 rounded-2xl shadow-xl border border-green-200 text-center">
            <h3 className="text-3xl font-bold text-green-800 mb-6 border-b-2 border-green-300 pb-3">Generated Barcode & Details</h3>
            <div
              ref={printRef}
              className="p-4 bg-white rounded-xl border border-gray-200 inline-block shadow-lg" 
            >
              
              <div className="text-xs font-bold text-gray-800 mb-1">Aruna Enterprises</div>
              <img
                src={barcodeImageUrl}
                alt="Reel Barcode"
                className="max-w-full h-auto object-contain mx-auto my-2" 
                style={{ maxHeight: '100px' }} 
              />
              <div className="text-sm font-semibold text-gray-800 mb-1">{barcodeId}</div>
              <div className="text-sm text-gray-700 mb-1">
                <strong className="font-semibold">Reel No:</strong> {reelDetails.reelNo || 'N/A'}
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-700 mb-1">
                <span><strong className="font-semibold">GSM:</strong> {reelDetails.gsm}</span>
                <span><strong className="font-semibold">Deckle:</strong> {reelDetails.deckle}</span>
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-700 mb-1">
                <span><strong className="font-semibold">Weight:</strong> {reelDetails.currentWeight} kg</span>
                <span><strong className="font-semibold">BF:</strong> {reelDetails.burstFactor}</span>
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-semibold">Supplier:</strong> {reelDetails.supplierName}
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-8 px-10 py-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            >
              Print Barcode Sticker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelForm;