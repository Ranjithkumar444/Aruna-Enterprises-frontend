import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../CssFiles/ReelForm.css"

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

  const token = localStorage.getItem("adminToken");

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
        'http://localhost:8080/admin/register-reel',
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

      // Fetch barcode image
      const imageResponse = await axios.get(
        `http://localhost:8080/admin/barcode/${id}`,
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
          { label: 'Unit', name: 'unit', placeholder: 'e.g. kg, lbs' },
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

      {barcodeImageUrl && (
        <div className="barcode-display" style={{ marginTop: '20px' }}>
          <h3>Generated Barcode</h3>
          <div ref={printRef}>
            <p><strong>Barcode ID:</strong> {barcodeId}</p>
            <img
              src={barcodeImageUrl}
              alt="Reel Barcode"
              style={{ border: '1px solid #000', width: '300px', height: 'auto' }}
            />
          </div>
          <br />
          <button onClick={handlePrint} style={{ marginTop: '10px' }}>
            Print Barcode
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelForm;