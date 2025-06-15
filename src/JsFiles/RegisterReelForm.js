import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../CssFiles/ReelForm.css";
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
      if (value && isNaN(value)) return;
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
      if (!formData.reelNo || isNaN(Number(formData.reelNo))) {
        throw new Error("Reel No must be a valid number");
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
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=600,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="form-container">
      <h2>Register New Reel</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Reel No', name: 'reelNo', type: 'number', placeholder: 'Enter reel number', required: true },
          { label: 'GSM', name: 'gsm', type: 'number', placeholder: 'e.g. 80, 100, 120', required: true },
          { label: 'Burst Factor', name: 'burstFactor', type: 'number', placeholder: 'e.g. 25, 30', required: true },
          { label: 'Deckle', name: 'deckle', type: 'number', placeholder: 'Enter deckle size', required: true },
          { label: 'Initial Weight', name: 'initialWeight', type: 'number', placeholder: 'e.g. 500 kg', required: true },
          { label: 'Unit', name: 'unit', type: 'text', placeholder: 'e.g. A,B', required: true },
          { label: 'Paper Type', name: 'paperType', type: 'text', placeholder: 'e.g. Kraft, Duplex', required: true },
          { label: 'Supplier Name', name: 'supplierName', type: 'text', placeholder: 'Supplier full name', required: true },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="createdBy">Created By</label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            value={formData.createdBy}
            readOnly
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={resetForm} style={{ marginTop: "30px" }}>
            Reset Form
          </button>

        </div>
      </form>

      {barcodeImageUrl && reelDetails && (
        <div className="barcode-display">
          <h3>Generated Barcode</h3>
          <div
            ref={printRef}
            className="barcode-printable"
          >
            <div className="company-name">Aruna Enterprises</div>
            <img
              src={barcodeImageUrl}
              alt="Reel Barcode"
              className="barcode-image"
            />
            <div className="barcode-id">{barcodeId}</div>
            <div className="reel-no">
              <strong>Reel No:</strong> {reelDetails.reelNo || 'N/A'}
            </div>
            <div className="details-row">
              <span><strong>GSM:</strong> {reelDetails.gsm}</span>
              <span><strong>Deckle:</strong> {reelDetails.deckle}</span>
            </div>
            <div className="details-row">
              <span><strong>Weight:</strong> {reelDetails.currentWeight} kg</span>
              <span><strong>BF:</strong> {reelDetails.burstFactor}</span>
            </div>
            <div className="supplier">
              <strong>Supplier:</strong> {reelDetails.supplierName}
            </div>
          </div>

          <button onClick={handlePrint} className="print-button">
            Print Barcode
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelForm;