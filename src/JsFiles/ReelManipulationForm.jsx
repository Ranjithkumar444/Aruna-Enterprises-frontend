import React, { useState } from 'react';
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
    { label: 'In Use', value: 'IN_USE' },
    { label: 'Not In Use', value: 'NOT_IN_USE' },
    { label: 'Partially Used Available', value: 'PARTIALLY_USED_AVAILABLE' },
    { label: 'Use Completed (Out of Stock)', value: 'USE_COMPLETED' },
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
      const payload = {
        ...formData,
        
        initialWeight: formData.initialWeight === '' ? null : Number(formData.initialWeight),
        currentWeight: formData.currentWeight === '' ? null : Number(formData.currentWeight),
        previousWeight: formData.previousWeight === '' ? null : Number(formData.previousWeight),
      };

      const response = await axios.post(
        'https://arunaenterprises.azurewebsites.net/admin/inventory/manipulateReelData',
        payload,
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
      setMessage(error.response?.data?.message || 'An error occurred while updating reel.');
      setMessageType('error');
    }
  };

  const getMessageClasses = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-10 font-sans">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Manipulate Reel Data
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="reelNoOrBarcodeId" className="block text-gray-700 text-sm font-semibold mb-2">
              Reel No / Barcode ID:
            </label>
            <input
              type="text"
              id="reelNoOrBarcodeId"
              name="reelNoOrBarcodeId"
              value={formData.reelNoOrBarcodeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
              placeholder="Enter Reel No or Barcode ID"
            />
          </div>

          
          <div>
            <label htmlFor="initialWeight" className="block text-gray-700 text-sm font-semibold mb-2">
              Initial Weight (kg):
            </label>
            <input
              type="number"
              id="initialWeight"
              name="initialWeight"
              value={formData.initialWeight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
              placeholder="e.g. 500"
            />
          </div>

          
          <div>
            <label htmlFor="previousWeight" className="block text-gray-700 text-sm font-semibold mb-2">
              Previous Weight (kg):
            </label>
            <input
              type="number"
              id="previousWeight"
              name="previousWeight"
              value={formData.previousWeight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
              placeholder="e.g. 450"
            />
          </div>

          
          <div>
            <label htmlFor="currentWeight" className="block text-gray-700 text-sm font-semibold mb-2">
              Current Weight (kg):
            </label>
            <input
              type="number"
              id="currentWeight"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
              placeholder="e.g. 400"
            />
          </div>

          
          <div>
            <label htmlFor="unit" className="block text-gray-700 text-sm font-semibold mb-2">
              Unit:
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
              placeholder="e.g. A, B"
            />
          </div>

          
          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-semibold mb-2">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          
          <button
            type="submit"
            className="w-full px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
          >
            Submit
          </button>

          
          {message && (
            <p className={`p-4 rounded-lg text-center font-medium ${getMessageClasses()}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReelManipulationForm;