import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../CssFiles/ReelForm.css";

const ReelForm = () => {
  const [formData, setFormData] = useState({
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
  const printRef = useRef();
  const [reelDetails, setReelDetails] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (barcodeId) {
      fetchReelDetails(barcodeId);
    }
  }, [barcodeId]);

  const fetchReelDetails = async (id) => {
    try {
      const response = await axios.get(`https://arunaenterprises.azurewebsites.net/admin/barcode/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setReelDetails(response.data);
    } catch (error) {
      console.error("Error fetching reel details", error);
    }
  };

  useEffect(() => {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    if (adminDetails && adminDetails.email) {
      setFormData((prev) => ({ ...prev, createdBy: adminDetails.email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/register-reel",
        formData,
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
        `https://arunaenterprises.azurewebsites.net/admin/barcode/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );

      const base64Image = btoa(
        new Uint8Array(imageResponse.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const imgSrc = `data:image/png;base64,${base64Image}`;
      setBarcodeImageUrl(imgSrc);

      alert('Reel registered successfully!');
      setFormData((prev) => ({
        gsm: '',
        burstFactor: '',
        deckle: '',
        initialWeight: '',
        unit: '',
        paperType: '',
        supplierName: '',
        createdBy: prev.createdBy,
      }));
    } catch (error) {
      console.error('Error registering reel:', error);
      alert('Failed to register reel.');
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=600,height=600');
    newWindow.document.write('<html><head><title>Print</title></head><body>');
    newWindow.document.write(printContents);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="form-container">
      <h2>Register New Reel</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'GSM', name: 'gsm', placeholder: 'e.g. 80, 100, 120' },
          { label: 'Burst Factor', name: 'burstFactor', placeholder: 'e.g. 25, 30' },
          { label: 'Deckle', name: 'deckle', placeholder: 'Enter deckle size' },
          { label: 'Initial Weight', name: 'initialWeight', placeholder: 'e.g. 500 kg' },
          { label: 'Unit', name: 'unit', placeholder: 'e.g. A,B' },
          { label: 'Paper Type', name: 'paperType', placeholder: 'e.g. Kraft, Duplex' },
          { label: 'Supplier Name', name: 'supplierName', placeholder: 'Supplier full name' },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
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
          <button type="submit">Submit</button>
        </div>
      </form>

      {barcodeImageUrl && reelDetails && (
        <div className="barcode-display" style={{ marginTop: '20px' }}>
          <h3>Generated Barcode</h3>
          <div
            ref={printRef}
            style={{
              width: '384px',
              height: '192px',
              padding: '8px',
              border: '1px solid black',
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px' }}>
              Aruna Enterprises
            </div>

            <img
              src={barcodeImageUrl}
              alt="Reel Barcode"
              style={{ width: '192px', height: '144px', marginBottom: '2px' }}
            />

            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{barcodeId}</div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>GSM:</strong> {reelDetails.gsm}</span>
              <span><strong>Deckle:</strong> {reelDetails.deckle}</span>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Weight:</strong> {reelDetails.currentWeight} kg</span>
              <span><strong>BF:</strong> {reelDetails.burstFactor}</span>
            </div>
            <div style={{
              width: '100%',
              textAlign: 'left',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <strong>Supplier:</strong> {reelDetails.supplierName}
            </div>
          </div>

          <button onClick={handlePrint} style={{ marginTop: '10px' }}>
            Print Barcode
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelForm;
