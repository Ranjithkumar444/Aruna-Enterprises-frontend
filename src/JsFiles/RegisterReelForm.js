import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CssFiles/ReelForm.css';

const ReelForm = () => {
  const [formData, setFormData] = useState({
    size: '',
    length: '',
    width: '',
    height: '',
    gsm: '',
    quality: '',
    burstFactor: '',
    deckle: '',
    initialWeight: '',
    unit: '',
    paperType: '',
    supplierName: '',
    createdBy: '',
  });

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
      await axios.post(
        'http://localhost:8080/admin/register-reel',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      alert('Reel registered successfully!');
      setFormData({
        size: '',
        length: '',
        width: '',
        height: '',
        gsm: '',
        quality: '',
        burstFactor: '',
        deckle: '',
        initialWeight: '',
        unit: '',
        paperType: '',
        supplierName: '',
        createdBy: formData.createdBy,
      });
    } catch (error) {
      console.error('Error registering reel:', error);
      alert('Failed to register reel.');
    }
  };

  return (
    <div className="form-container">
      <h2>Register New Reel</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Size', name: 'size', placeholder: 'e.g. A4, A3' },
          { label: 'Length', name: 'length', placeholder: 'Enter length in cm' },
          { label: 'Width', name: 'width', placeholder: 'Enter width in cm' },
          { label: 'Height', name: 'height', placeholder: 'Enter height in cm' },
          { label: 'GSM', name: 'gsm', placeholder: 'e.g. 80, 100, 120' },
          { label: 'Quality', name: 'quality', placeholder: 'e.g. High, Medium, Low' },
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
    </div>
  );
};

export default ReelForm;
