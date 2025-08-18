import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const navigate = useNavigate();
  const printRef = useRef();

  const [formData, setFormData] = useState({
    client: '',
    productName: '',
    typeOfProduct: '',
    productType: '',
    quantity: '',
    size: '',
    deliveryAddress: '',
    expectedCompletionDate: '',
    unit: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productionDetail, setProductionDetail] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          "https://arunaenterprises.azurewebsites.net/admin/getAllClients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'size') {
      const formatted = value.toUpperCase();
      const allowed = /^[0-9X]*$/;
      if (!allowed.test(formatted)) return;

      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    if (name === 'client') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        productName: '',
        size: '',
        productType: '',
        typeOfProduct: ''
      }));

      const filtered = clients.filter(client =>
        client.client.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowClientDropdown(true);
      return;
    }

    if (name === 'productName') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (formData.client) {
        const clientProducts = clients.filter(
          client => client.client === formData.client
        );
        const filtered = clientProducts.filter(product =>
          product.product.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered.map(p => p.product));
        setShowProductDropdown(true);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      client,
      productName: '',
      size: '',
      productType: '',
      typeOfProduct: ''
    }));
    setShowClientDropdown(false);
  };

  const selectProduct = (productName) => {
    const clientProduct = clients.find(
      client => client.client === formData.client && client.product === productName
    );

    if (clientProduct) {
      setFormData(prev => ({
        ...prev,
        productName,
        size: clientProduct.size || '',
        productType: clientProduct.ply || '',
        typeOfProduct: clientProduct.productType || '',
        materialGrade: clientProduct.madeUpOf || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productName
      }));
    }
    setShowProductDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('adminToken');
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    const createdBy = adminDetails?.email || 'Unknown';

    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity, 10),
      status: 'TODO',
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expectedCompletionDate: formData.expectedCompletionDate
        ? new Date(formData.expectedCompletionDate).toISOString()
        : null
    };

    try {
      const res = await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/order/create-order",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const orderId = res.data.orderid;

      const existingOrders = JSON.parse(localStorage.getItem("suggestedReelsOrders")) || [];
      const newOrder = {
        response: res.data,
        orderDetails: {
          ...formData,
          orderId
        },
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(
        "suggestedReelsOrders",
        JSON.stringify([...existingOrders, newOrder])
      );

      const prodRes = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/${orderId}/production-detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProductionDetail(prodRes.data);
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      let errorMsg = "An unexpected error occurred. Please try again.";

      if (error.response) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (typeof data === 'object') {
          errorMsg = data.error || JSON.stringify(data);
        }
      } else if (error.request) {
        errorMsg = "No response from server. Please check your network connection.";
      }

      alert("Failed to create order: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create New Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-semibold">Client Name</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
              autoComplete="off"
            />
            {showClientDropdown && filteredClients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredClients.map((client, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectClient(client.client)}
                  >
                    {client.client}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g. It,Tile 400 X 400"
              required
              className="w-full px-4 py-2 border rounded"
              autoComplete="off"
              disabled={!formData.client}
            />
            {showProductDropdown && filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectProduct(product)}
                  >
                    {product}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Product Type</label>
            <input
              type="text"
              name="typeOfProduct"
              value={formData.typeOfProduct}
              onChange={handleChange}
              placeholder="e.g. Corrugated, Punching"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Ply</label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              placeholder="e.g. 3-ply, 5-ply"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 1000"
              required
              min="1"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g. 625X430X520 (Use capital X)"
              required
              pattern="^(\d+X){1,2}\d+$"
              title="Enter in format like 625X430X520 with capital X only"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Delivery Address</label>
            <input
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Expected Completion Date</label>
            <input
              type="date"
              name="expectedCompletionDate"
              value={formData.expectedCompletionDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. A or B"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-lg font-bold transition ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </form>
      </div>

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
    </div>
  );
};

export default OrderForm;
