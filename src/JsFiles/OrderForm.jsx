import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const navigate = useNavigate();
  const printRef = useRef();

  const [formData, setFormData] = useState({
    client: '',
    typeOfProduct: '',
    productType: '',
    quantity: '',
    size: '',
    materialGrade: '',
    deliveryAddress: '',
    expectedCompletionDate: '',
    unit: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productionDetail, setProductionDetail] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'size') {
      const formatted = value.toUpperCase();
      const allowed = /^[0-9X]*$/;
      if (!allowed.test(formatted)) return;
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
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
      localStorage.setItem("suggestedReelsOrders", JSON.stringify([...existingOrders, newOrder]));

      const prodRes = await axios.get(
        `https://arunaenterprises.azurewebsites.net/admin/${orderId}/production-detail`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProductionDetail(prodRes.data);
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error.response) {
        const data = error.response.data;
        if (typeof data === 'string') errorMsg = data;
        else if (typeof data === 'object') errorMsg = data.error || JSON.stringify(data);
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
        }
        .label {
          width: 2.90in;
          height: 4.90in;
        }
        .label h3 {
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }
        .section {
          text-align: center;
          font-weight: bold;
          margin-top: 4px;
          border-top: 1px solid #000;
          padding-top: 2px;
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="label">');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</div></body></html>');
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
          {/* FORM FIELDS */}
          {[
            { label: "Client Name", name: "client", type: "text" },
            { label: "Product Type", name: "typeOfProduct", type: "text", placeholder: "e.g. Corrugated, Punching" },
            { label: "Ply", name: "productType", type: "text", placeholder: "e.g. 3-ply, 5-ply" },
            { label: "Quantity", name: "quantity", type: "number", placeholder: "e.g. 1000", min: 1 },
            { label: "Size", name: "size", type: "text", placeholder: "e.g. 625X430X520 (Use capital X)", pattern: "^(\d+X){1,2}\d+$" },
            { label: "Material Grade", name: "materialGrade", type: "text", placeholder: "e.g. Natural, Kraft" },
            { label: "Delivery Address", name: "deliveryAddress", type: "text" },
            { label: "Expected Completion Date", name: "expectedCompletionDate", type: "date" },
            { label: "Unit", name: "unit", type: "text", placeholder: "e.g. A or B" },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold">{field.label}</label>
              <input
                {...field}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-lg font-bold transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </form>
      </div>

      {productionDetail && (
        <div className="mt-8 bg-white p-2 rounded shadow w-[2.90in] h-[4.90in] text-[11px] leading-snug">
          <h3 className="text-center font-bold mb-2 text-[12px]">Production Sticker</h3>
          <div ref={printRef} className="space-y-[2px]">
            {/* Compact layout */}
            {[
              ['Client', productionDetail.client, 'Size', productionDetail.size],
              ['Ply', productionDetail.ply, 'Type', productionDetail.typeOfProduct],
              ['Product', productionDetail.productType, 'Boxes', productionDetail.quantity],
              ['Top GSM', productionDetail.topGsm, 'Liner GSM', productionDetail.linerGsm],
              ['Flute GSM', productionDetail.fluteGsm, 'Cut Len', productionDetail.cuttingLength],
              ['Top Mat', productionDetail.topMaterial, 'Liner Mat', productionDetail.linerMaterial],
              ['Flute Mat', productionDetail.fluteMaterial, '', ''],
            ].map(([label1, value1, label2, value2], idx) => (
              <div className="flex justify-between" key={idx}>
                <span><strong>{label1}:</strong> {value1}</span>
                <span><strong>{label2}:</strong> {value2}</span>
              </div>
            ))}

            {[
              ['ONE UPS', productionDetail.deckle, productionDetail.plain, productionDetail.sheets],
              ['TWO UPS', productionDetail.twoUpsDeckle, productionDetail.twoUpsPlain, productionDetail.twoUpsSheets],
              ['THREE UPS', productionDetail.threeUpsDeckle, productionDetail.threeUpsPlain, productionDetail.threeUpsSheets],
              ['FOUR UPS', productionDetail.fourUpsDeckle, productionDetail.fourUpsPlain, productionDetail.fourUpsSheets],
            ].map(([label, deckle, plain, sheets]) => (
              <div key={label}>
                <div className="text-center font-semibold mt-1 border-t pt-1">{label}</div>
                <div className="flex justify-between">
                  <span>Deckle: {deckle}</span>
                  <span>P: {plain} | S: {sheets}</span>
                </div>
              </div>
            ))}

            <div className="text-center font-semibold mt-1 border-t pt-1">Material Required</div>
            <div className="flex justify-between">
              <span>Top: {productionDetail.totalTopWeightReq} kg</span>
              <span>Flute: {productionDetail.totalFluteWeightReq} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Liner: {productionDetail.totalLinerWeightReq} kg</span>
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
