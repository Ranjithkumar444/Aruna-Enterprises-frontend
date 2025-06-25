import React, { useState } from 'react';
import "../CssFiles/ReelManipulationForm.css";
import axios from 'axios';

const ReelManipulationForm = () => {
  const [formData, setFormData] = useState({
    reelNoOrBarcodeId: '',
    initialWeight: '',
    currentWeight: '',
    previousWeight: '',
    unit: '',
    status: 'IN_USE',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const statusOptions = [
    { label: 'InUse', value: 'IN_USE' },
    { label: 'NotInUse', value: 'NOT_IN_USE' },
    { label: 'PartiallyUsedAvailable', value: 'PARTIALLY_USED_AVAILABLE' },
    { label: 'OutOfStock', value: 'USE_COMPLETED' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      reelNoOrBarcodeId: '',
      initialWeight: '',
      currentWeight: '',
      previousWeight: '',
      unit: '',
      status: 'IN_USE',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    setMessageType('info');

    if (!formData.reelNoOrBarcodeId.trim()) {
      setMessage('Please enter Reel No or Barcode ID.');
      setMessageType('error');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage('Admin token missing. Please login.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        'https://arunaenterprises.azurewebsites.net/admin/inventory/manipulateReelData',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(response.data?.message || 'Reel updated successfully.');
      setMessageType('success');
      resetForm();

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000); 
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
      setMessageType('error');
    }
  };

  return (
    <div className="reel-form-container">
      <h2>Manipulate Reel Data</h2>
      <form onSubmit={handleSubmit} className="reel-form">
        <label>
          Reel No / Barcode ID:
          <input
            type="text"
            name="reelNoOrBarcodeId"
            value={formData.reelNoOrBarcodeId}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Initial Weight (kg):
          <input
            type="number"
            name="initialWeight"
            value={formData.initialWeight}
            onChange={handleChange}
          />
        </label>

        <label>
          Previous Weight (kg):
          <input
            type="number"
            name="previousWeight"
            value={formData.previousWeight}
            onChange={handleChange}
          />
        </label>

        <label>
          Current Weight (kg):
          <input
            type="number"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleChange}
          />
        </label>

        <label>
          Unit:
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Submit</button>
        {message && (
          <p className={`message ${messageType}`}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default ReelManipulationForm;
