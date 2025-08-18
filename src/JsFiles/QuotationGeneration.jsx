
import React, { useState } from 'react';
import axios from 'axios';

const QuotationForm = () => {
  const initialLayer = {
    layerType: '',
    shade: '',
    gsm: '',
    bf: '',
    pricePerKg: '',
    fluteType: '',
  };

  const [formData, setFormData] = useState({
    boxType: '',
    length: '',
    width: '',
    height: '',
    trimAllowanceLength: '',
    trimAllowanceWidth: '',
    layers: [],
    conversionCostPerKg: '',
    processWastePercentage: '',
    grossMarginPercentage: '',
    plyType: '',
  });

  const [quotationResult, setQuotationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  const BF_OPTIONS = ['14', '16', '18', '20', '22', '25', '28', '30', '32', '35', '40'];

  const generateLayersFromPly = (plyType) => {
    let layers = [];
    const plyCount = parseInt(plyType.split('-')[0], 10);
    const fluteCount = (plyCount - 1) / 2;

    if (plyCount % 2 !== 1) {
      console.error('Invalid ply count. Must be an odd number.');
      return [];
    }

    // Add layers for the specified ply count
    for (let i = 0; i < plyCount; i++) {
      if (i === 0) {
        // First layer is a liner (Top)
        layers.push({ ...initialLayer, layerType: 'Top' });
      } else if (i % 2 !== 0) {
        // Odd layers are flutes
        layers.push({ ...initialLayer, layerType: 'Flute', fluteType: '' });
      } else {
        // Even layers are liners
        layers.push({ ...initialLayer, layerType: 'Liner' });
      }
    }

    // Assign default flute types for common configurations
    switch (plyType) {
      case '3-ply':
        layers[1].fluteType = 'C';
        break;
      case '5-ply':
        layers[1].fluteType = 'C';
        layers[3].fluteType = 'B';
        break;
      case '7-ply':
        layers[1].fluteType = 'A';
        layers[3].fluteType = 'C';
        layers[5].fluteType = 'B';
        break;
      // Add more cases for 9-ply and 11-ply if you have standard flute combinations
      default:
        break;
    }

    return layers;
  };

  const handlePlyChange = (e) => {
    const plyType = e.target.value;
    setFormData({
      ...formData,
      plyType,
      layers: plyType ? generateLayersFromPly(plyType) : []
    });
    setManualMode(false);
  };

  const toggleManualMode = () => {
    setManualMode(!manualMode);
    if (!manualMode) {
      setFormData({
        ...formData,
        plyType: '',
        layers: []
      });
    }
  };

  const addLayer = () => {
    setFormData({
      ...formData,
      layers: [...formData.layers, { ...initialLayer }],
    });
  };

  const removeLayer = (index) => {
    const newLayers = formData.layers.filter((_, i) => i !== index);
    setFormData({ ...formData, layers: newLayers });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLayerChange = (index, e) => {
    const { name, value } = e.target;
    const newLayers = [...formData.layers];
    newLayers[index][name] = value;
    setFormData({ ...formData, layers: newLayers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuotationResult(null);

    const requestData = {
      ...formData,
      length: parseFloat(formData.length) || 0,
      width: parseFloat(formData.width) || 0,
      height: parseFloat(formData.height) || 0,
      trimAllowanceLength: parseFloat(formData.trimAllowanceLength) || 0,
      trimAllowanceWidth: parseFloat(formData.trimAllowanceWidth) || 0,
      layers: formData.layers.map(layer => ({
        ...layer,
        gsm: parseFloat(layer.gsm) || 0,
        bf: parseFloat(layer.bf) || 0,
        pricePerKg: parseFloat(layer.pricePerKg) || 0,
      })),
      conversionCostPerKg: parseFloat(formData.conversionCostPerKg) || 0,
      processWastePercentage: parseFloat(formData.processWastePercentage) || 0,
      grossMarginPercentage: parseFloat(formData.grossMarginPercentage) || 0,
    };

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin token not found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      };

      const response = await axios.post(
        'https://arunaenterprises.azurewebsites.net/admin/quotation/calculate',
        requestData,
        { headers }
      );
      setQuotationResult(response.data);
    } catch (err) {
      console.error('Error calculating quotation:', err);
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response received from the server. Please check the backend.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Box Quotation Calculator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Box Details */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Box Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Box Type</label>
              <select
                name="boxType"
                value={formData.boxType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Box Type</option>
                <option value="Corrugated RSC">Corrugated RSC</option>
                <option value="Die-Cut">Die-Cut</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Length (mm)</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Width (mm)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Height (mm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Ply Selection */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Ply Configuration</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1">Ply Type</label>
              <select
                name="plyType"
                value={formData.plyType}
                onChange={handlePlyChange}
                className="w-full p-2 border rounded"
                disabled={manualMode}
              >
                <option value="">Select Ply Type</option>
                <option value="3-ply">3-ply</option>
                <option value="5-ply">5-ply</option>
                <option value="7-ply">7-ply</option>
                <option value="9-ply">9-ply</option>
                <option value="11-ply">11-ply</option>
              </select>
            </div>
            <div className="flex items-center mt-5">
              <input
                type="checkbox"
                id="manualMode"
                checked={manualMode}
                onChange={toggleManualMode}
                className="mr-2"
              />
              <label htmlFor="manualMode">Manual Layer Configuration</label>
            </div>
          </div>
          
          {formData.plyType && !manualMode && (
            <div className="bg-blue-50 p-3 rounded mb-4">
              <p className="text-blue-800">
                Selected: {formData.plyType}. Layers have been auto-configured with a standard structure.
                You can modify individual layer properties below.
              </p>
            </div>
          )}
        </div>

        {/* Material Layers */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Material Layers</h2>
          
          {formData.layers.length === 0 && (
            <p className="text-center text-gray-500 mb-4">
              {manualMode ? 'No layers added yet.' : 'Select a ply type to auto-generate layers.'}
            </p>
          )}
          
          {formData.layers.map((layer, index) => (
            <div key={index} className="border p-3 rounded mb-3">
              <h3 className="font-bold mb-2">
                Layer {index + 1} - {layer.layerType || 'Not specified'}
                {layer.layerType === 'Flute' && layer.fluteType && ` (${layer.fluteType}-Flute)`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Layer Type</label>
                  <select
                    name="layerType"
                    value={layer.layerType}
                    onChange={(e) => handleLayerChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Layer Type</option>
                    <option value="Liner">Liner</option>
                    <option value="Flute">Flute</option>
                  </select>
                </div>
                {layer.layerType === 'Flute' && (
                  <div>
                    <label className="block mb-1">Flute Type</label>
                    <select
                      name="fluteType"
                      value={layer.fluteType}
                      onChange={(e) => handleLayerChange(index, e)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Flute</option>
                      <option value="A">A-Flute</option>
                      <option value="B">B-Flute</option>
                      <option value="C">C-Flute</option>
                      <option value="E">E-Flute</option>
                      <option value="F">F-Flute</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block mb-1">Shade</label>
                  <input
                    type="text"
                    name="shade"
                    value={layer.shade}
                    onChange={(e) => handleLayerChange(index, e)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">GSM</label>
                  <input
                    type="number"
                    name="gsm"
                    value={layer.gsm}
                    onChange={(e) => handleLayerChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">BF</label>
                  <select
                    name="bf"
                    value={layer.bf}
                    onChange={(e) => handleLayerChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select BF</option>
                    {BF_OPTIONS.map(bfOption => (
                      <option key={bfOption} value={bfOption}>{bfOption}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Price/Kg (INR)</label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={layer.pricePerKg}
                    onChange={(e) => handleLayerChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                    step="0.01"
                  />
                </div>
                {manualMode && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeLayer(index)}
                      className="text-red-500"
                    >
                      Remove Layer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {manualMode && (
            <button
              type="button"
              onClick={addLayer}
              className="mt-2 p-2 bg-blue-100 text-blue-600 rounded"
            >
              Add Layer
            </button>
          )}
        </div>

        {/* Costs & Margin */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Costs & Margin</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Conversion Cost per Kg (INR)</label>
              <input
                type="number"
                name="conversionCostPerKg"
                value={formData.conversionCostPerKg}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1">Process Waste (%)</label>
              <input
                type="number"
                name="processWastePercentage"
                value={formData.processWastePercentage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1">Gross Margin (%)</label>
              <input
                type="number"
                name="grossMarginPercentage"
                value={formData.grossMarginPercentage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Manufacturing Allowances */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Manufacturing Allowances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Trim Allowance Length (mm)</label>
              <input
                type="number"
              
                name="trimAllowanceLength"
                value={formData.trimAllowanceLength}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Trim Allowance Width (mm)</label>
              <input
                type="number"
                name="trimAllowanceWidth"
                value={formData.trimAllowanceWidth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || formData.layers.length === 0}
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Calculating...' : 'Calculate Quotation'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {quotationResult && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Quotation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">Board Size Required</p>
              <p className="text-lg font-bold">{quotationResult.boardSizeRequiredPerBox}</p>
            </div>
            <div className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">Board Area per Box</p>
              <p className="text-lg font-bold">{quotationResult.actualBoardAreaUsedPerBoxSqm.toFixed(4)} m²</p>
            </div>
            <div className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">Estimated Box Weight</p>
              <p className="text-lg font-bold">{quotationResult.boxWeightKg.toFixed(4)} kg</p>
            </div>
            <div className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">Total Cost Before Margin</p>
              <p className="text-lg font-bold">{quotationResult.totalCostBeforeMarginPerBox.toFixed(2)} INR</p>
            </div>
            <div className="md:col-span-2 border p-3 rounded bg-blue-100">
              <p className="text-sm text-blue-800">Final Unit Price</p>
              <p className="text-xl font-bold text-blue-900">{quotationResult.unitPrice.toFixed(2)} INR</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white border rounded">
            <h3 className="font-bold mb-2">Calculation Notes:</h3>
            <p className="text-sm">{quotationResult.calculationNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationForm;
