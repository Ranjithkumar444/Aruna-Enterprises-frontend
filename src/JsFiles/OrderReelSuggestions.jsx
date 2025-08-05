import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderReelSuggestions = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedReelType, setSelectedReelType] = useState('ALL');
  const [productionDetail, setProductionDetail] = useState(null);
  const printRef = useRef();

  const orderDetails = state?.order;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        // Fetch suggested reels
        const response = await axios.get(
          `https://arunaenterprises.azurewebsites.net/admin/order/${orderId}/suggested-reels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );
        setSuggestions(response.data);

        // Fetch production details
        const prodResponse = await axios.get(
          `https://arunaenterprises.azurewebsites.net/admin/${orderId}/production-detail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );
        setProductionDetail(prodResponse.data);

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to fetch data'
          );
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted, request canceled');
    };
  }, [orderId]);

  const handleUnitChange = (e) => setSelectedUnit(e.target.value);
  const handleReelTypeChange = (e) => setSelectedReelType(e.target.value);

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '', 'width=290,height=490');
    printWindow.document.write('<html><head><title>Print Sticker</title>');
    printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          padding: 5px;
          margin: 0;
        }
        .sticker-container {
          width: 2.90in;
          height: 4.90in;
          padding: 5px;
          box-sizing: border-box;
        }
        .sticker-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .section-title {
          text-align: center;
          font-weight: bold;
          margin-top: 2px;
          margin-bottom: 1px;
          font-size: 11px;
        }
        strong {
          font-weight: bold;
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="sticker-container">');
    printWindow.document.write('<div class="sticker-content">');
    
    printWindow.document.write('<h3 class="section-title">Production Sticker</h3>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Client:</strong> ${productionDetail.client}</span>`);
    printWindow.document.write(`<span><strong>Size:</strong> ${productionDetail.size}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Ply:</strong> ${productionDetail.ply}</span>`);
    printWindow.document.write(`<span><strong>Type:</strong> ${productionDetail.typeOfProduct}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Product:</strong> ${productionDetail.productType}</span>`);
    printWindow.document.write(`<span><strong>Boxes:</strong> ${productionDetail.quantity}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Top GSM:</strong> ${productionDetail.topGsm}</span>`);
    printWindow.document.write(`<span><strong>Liner GSM:</strong> ${productionDetail.linerGsm}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Flute GSM:</strong> ${productionDetail.fluteGsm}</span>`);
    printWindow.document.write(`<span><strong>Cut Len:</strong> ${productionDetail.cuttingLength}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Top Mat:</strong> ${productionDetail.topMaterial}</span>`);
    printWindow.document.write(`<span><strong>Liner Mat:</strong> ${productionDetail.linerMaterial}</span>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span><strong>Flute Mat:</strong> ${productionDetail.fluteMaterial}</span>`);
    printWindow.document.write('<span></span>');
    printWindow.document.write('</div>');
    
    // Dynamic UPS sections
    const minDeckle = parseFloat(productionDetail.minDeckle);
    const maxDeckle = parseFloat(productionDetail.maxDeckle);
    
    if (productionDetail.deckle >= minDeckle && productionDetail.deckle <= maxDeckle) {
      printWindow.document.write('<div class="section-title">ONE UPS</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Deckle: ${productionDetail.deckle}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.plain} | S: ${productionDetail.sheets}</span>`);
      printWindow.document.write('</div>');
    }
    
    if (productionDetail.twoUpsDeckle >= minDeckle && productionDetail.twoUpsDeckle <= maxDeckle) {
      printWindow.document.write('<div class="section-title">TWO UPS</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Deckle: ${productionDetail.twoUpsDeckle}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.twoUpsPlain} | S: ${productionDetail.twoUpsSheets}</span>`);
      printWindow.document.write('</div>');
    }
    
    if (productionDetail.threeUpsDeckle >= minDeckle && productionDetail.threeUpsDeckle <= maxDeckle) {
      printWindow.document.write('<div class="section-title">THREE UPS</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Deckle: ${productionDetail.threeUpsDeckle}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.threeUpsPlain} | S: ${productionDetail.threeUpsSheets}</span>`);
      printWindow.document.write('</div>');
    }
    
    if (productionDetail.fourUpsDeckle >= minDeckle && productionDetail.fourUpsDeckle <= maxDeckle) {
      printWindow.document.write('<div class="section-title">FOUR UPS</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Deckle: ${productionDetail.fourUpsDeckle}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.fourUpsPlain} | S: ${productionDetail.fourUpsSheets}</span>`);
      printWindow.document.write('</div>');
    }

    // Dynamic Piece sections
    const minCuttingLength = parseFloat(productionDetail.minCuttingLength);
    const maxCuttingLength = parseFloat(productionDetail.maxCuttingLength);
    
    if (productionDetail.onePieceCuttingLength >= minCuttingLength && 
        productionDetail.onePieceCuttingLength <= maxCuttingLength) {
      printWindow.document.write('<div class="section-title">ONE PIECE</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Cut Len: ${productionDetail.onePieceCuttingLength}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.onePiecePlain} | S: ${productionDetail.onePieceSheet}</span>`);
      printWindow.document.write('</div>');
    }
    
    if (productionDetail.twoPieceCuttingLength >= minCuttingLength && 
        productionDetail.twoPieceCuttingLength <= maxCuttingLength) {
      printWindow.document.write('<div class="section-title">TWO PIECE</div>');
      printWindow.document.write('<div class="row">');
      printWindow.document.write(`<span>Cut Len: ${productionDetail.twoPieceCuttingLength}</span>`);
      printWindow.document.write(`<span>P: ${productionDetail.twoPiecePlain} | S: ${productionDetail.twoPieceSheet}</span>`);
      printWindow.document.write('</div>');
    }
    
    printWindow.document.write('<div class="section-title">Material Required</div>');
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span>Top: ${productionDetail.totalTopWeightReq.toFixed(2)} kg</span>`);
    printWindow.document.write(`<span>Flute: ${productionDetail.totalFluteWeightReq.toFixed(2)} kg</span>`);
    printWindow.document.write('</div>');
    printWindow.document.write('<div class="row">');
    printWindow.document.write(`<span>Liner: ${productionDetail.totalLinerWeightReq.toFixed(2)} kg</span>`);
    printWindow.document.write('<span></span>');
    printWindow.document.write('</div>');
    
    printWindow.document.write('</div></div></body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getFilteredReels = () => {
    if (!suggestions) return [];

    let reels = [];
    if (selectedReelType === 'ALL' || selectedReelType === 'TOP') {
      reels = [...reels, ...suggestions.topGsmReels.map(r => ({ ...r, type: 'Top' }))];
    }
    if (selectedReelType === 'ALL' || selectedReelType === 'BOTTOM') {
      reels = [...reels, ...suggestions.bottomGsmReels.map(r => ({ ...r, type: 'Bottom' }))];
    }
    if (selectedReelType === 'ALL' || selectedReelType === 'FLUTE') {
      reels = [...reels, ...suggestions.fluteGsmReels.map(r => ({ ...r, type: 'Flute' }))];
    }

    if (selectedUnit !== 'ALL') {
      reels = reels.filter(reel => reel.unit === selectedUnit);
    }

    // Sort by deckle, then currentWeight
    reels.sort((a, b) => {
      const deckleA = a.deckle ?? 0;
      const deckleB = b.deckle ?? 0;
      const weightA = a.currentWeight ?? 0;
      const weightB = b.currentWeight ?? 0;

      if (deckleA === deckleB) return weightA - weightB;
      return deckleA - deckleB;
    });

    return reels;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOT_IN_USE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Not In Use</span>;
      case 'IN_USE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">In Use</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-blue-600">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const filteredReels = getFilteredReels();
  const uniqueUnits = ['ALL', ...new Set(filteredReels.map(reel => reel.unit).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Suggested Reels for Order #{orderId}
          </h2>
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Orders
          </button>
        </div>

        {orderDetails && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-gray-600">Client</p><p className="font-medium">{orderDetails.client}</p></div>
              <div><p className="text-sm text-gray-600">Size</p><p className="font-medium">{orderDetails.size}</p></div>
              <div><p className="text-sm text-gray-600">Product Type</p><p className="font-medium">{orderDetails.productType || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-600">Quantity</p><p className="font-medium">{orderDetails.quantity}</p></div>
              <div><p className="text-sm text-gray-600">Unit</p><p className="font-medium">{orderDetails.unit || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-600">Status</p><p className="font-medium">{orderDetails.status}</p></div>
              {productionDetail && (
                <>
                  <div><p className="text-sm text-gray-600">Top Weight Expected</p><p className="font-medium">{productionDetail.totalTopWeightReq} kg</p></div>
                  <div><p className="text-sm text-gray-600">Flute Weight Expected</p><p className="font-medium">{productionDetail.totalFluteWeightReq} kg</p></div>
                  <div><p className="text-sm text-gray-600">Liner Weight Expected</p><p className="font-medium">{productionDetail.totalLinerWeightReq} kg</p></div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="reel-type" className="block text-sm font-medium text-gray-700 mb-1">Filter by Reel Type</label>
            <select
              id="reel-type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
              value={selectedReelType}
              onChange={handleReelTypeChange}
            >
              <option value="ALL">All Types</option>
              <option value="TOP">Top GSM Reels</option>
              <option value="BOTTOM">Bottom GSM Reels</option>
              {suggestions?.fluteRequired && <option value="FLUTE">Flute GSM Reels</option>}
            </select>
          </div>
          <div>
            <label htmlFor="unit-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Unit</label>
            <select
              id="unit-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
              value={selectedUnit}
              onChange={handleUnitChange}
            >
              {uniqueUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit === 'ALL' ? 'All Units' : `Unit ${unit}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredReels.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            <p>No reels found matching your filters.</p>
            <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Barcode ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reel No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GSM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deckle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Current Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReels.map((reel, index) => (
                  <tr key={`${reel.type}-${index}`} className="hover:bg-blue-50 transition duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reel.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.barcodeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.reelNo || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.gsm}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.deckle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.unit || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.currentWeight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(reel.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {productionDetail && (
          <div className="mt-8 bg-white p-2 rounded shadow w-[2.90in] h-[4.90in] text-[11px] leading-snug">
            <h3 className="text-center font-bold mb-2 text-[12px]">Production Sticker</h3>

            <div ref={printRef} className="space-y-[2px]">
              <div className="flex justify-between">
                <span><strong>Client:</strong> {productionDetail.client}</span>
                <span><strong>Size:</strong> {productionDetail.size}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Ply:</strong> {productionDetail.ply}</span>
                <span><strong>Type:</strong> {productionDetail.typeOfProduct}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Product:</strong> {productionDetail.productType}</span>
                <span><strong>Boxes:</strong> {productionDetail.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Top GSM:</strong> {productionDetail.topGsm}</span>
                <span><strong>Liner GSM:</strong> {productionDetail.linerGsm}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Flute GSM:</strong> {productionDetail.fluteGsm}</span>
                <span><strong>Cut Len:</strong> {productionDetail.cuttingLength}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Top Mat:</strong> {productionDetail.topMaterial}</span>
                <span><strong>Liner Mat:</strong> {productionDetail.linerMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Flute Mat:</strong> {productionDetail.fluteMaterial}</span>
                <span></span>
              </div>

              {/* Dynamic UPS sections */}
              {productionDetail.deckle >= productionDetail.minDeckle && 
               productionDetail.deckle <= productionDetail.maxDeckle && (
                <>
                  <div className="mt-1 border-t pt-1 text-center font-semibold">ONE UPS</div>
                  <div className="flex justify-between">
                    <span>Deckle: {productionDetail.deckle}</span>
                    <span>P: {productionDetail.plain} | S: {productionDetail.sheets}</span>
                  </div>
                </>
              )}

              {productionDetail.twoUpsDeckle >= productionDetail.minDeckle && 
               productionDetail.twoUpsDeckle <= productionDetail.maxDeckle && (
                <>
                  <div className="mt-1 text-center font-semibold">TWO UPS</div>
                  <div className="flex justify-between">
                    <span>Deckle: {productionDetail.twoUpsDeckle}</span>
                    <span>P: {productionDetail.twoUpsPlain} | S: {productionDetail.twoUpsSheets}</span>
                  </div>
                </>
              )}

              {productionDetail.threeUpsDeckle >= productionDetail.minDeckle && 
               productionDetail.threeUpsDeckle <= productionDetail.maxDeckle && (
                <>
                  <div className="mt-1 text-center font-semibold">THREE UPS</div>
                  <div className="flex justify-between">
                    <span>Deckle: {productionDetail.threeUpsDeckle}</span>
                    <span>P: {productionDetail.threeUpsPlain} | S: {productionDetail.threeUpsSheets}</span>
                  </div>
                </>
              )}

              {productionDetail.fourUpsDeckle >= productionDetail.minDeckle && 
               productionDetail.fourUpsDeckle <= productionDetail.maxDeckle && (
                <>
                  <div className="mt-1 text-center font-semibold">FOUR UPS</div>
                  <div className="flex justify-between">
                    <span>Deckle: {productionDetail.fourUpsDeckle}</span>
                    <span>P: {productionDetail.fourUpsPlain} | S: {productionDetail.fourUpsSheets}</span>
                  </div>
                </>
              )}

              {/* Dynamic Piece sections */}
              {productionDetail.onePieceCuttingLength >= productionDetail.minCuttingLength && 
               productionDetail.onePieceCuttingLength <= productionDetail.maxCuttingLength && (
                <>
                  <div className="mt-1 text-center font-semibold">ONE PIECE</div>
                  <div className="flex justify-between">
                    <span>Cut Len: {productionDetail.onePieceCuttingLength}</span>
                    <span>P: {productionDetail.onePiecePlain} | S: {productionDetail.onePieceSheet}</span>
                  </div>
                </>
              )}

              {productionDetail.twoPieceCuttingLength >= productionDetail.minCuttingLength && 
               productionDetail.twoPieceCuttingLength <= productionDetail.maxCuttingLength && (
                <>
                  <div className="mt-1 text-center font-semibold">TWO PIECE</div>
                  <div className="flex justify-between">
                    <span>Cut Len: {productionDetail.twoPieceCuttingLength}</span>
                    <span>P: {productionDetail.twoPiecePlain} | S: {productionDetail.twoPieceSheet}</span>
                  </div>
                </>
              )}

              <div className="mt-1 text-center font-semibold">Material Required</div>
              <div className="flex justify-between">
                <span>Top: {productionDetail.totalTopWeightReq.toFixed(2)} kg</span>
                <span>Flute: {productionDetail.totalFluteWeightReq.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Liner: {productionDetail.totalLinerWeightReq.toFixed(2)} kg</span>
                <span></span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-2 w-full py-1 bg-green-600 text-white text-[11px] rounded font-semibold hover:bg-green-700"
            >
              Print Sticker
            </button>
          </div>
        )}

        {suggestions?.message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            {suggestions.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReelSuggestions;