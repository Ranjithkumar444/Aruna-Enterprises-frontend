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
        orderDetails: { ...formData, orderId },
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
      navigate('/admin/dashboard');
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
    const content = printRef.current;
    const printWindow = window.open('', '', 'width=290,height=490');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write('<style>body{font-family:Arial;font-size:11px;padding:5px}.row{display:flex;justify-content:space-between}.section-title{text-align:center;font-weight:bold;margin-top:5px;margin-bottom:2px}</style>');
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center">Create New Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Client Name", name: "client", type: "text", required: true },
            { label: "Product Type", name: "typeOfProduct", type: "text", placeholder: "e.g. Corrugated", required: true },
            { label: "Ply", name: "productType", type: "text", placeholder: "e.g. 3-ply", required: true },
            { label: "Quantity", name: "quantity", type: "number", required: true, min: 1 },
            { label: "Size", name: "size", type: "text", placeholder: "e.g. 625X430X520", required: true },
            { label: "Material Grade", name: "materialGrade", type: "text", placeholder: "e.g. Kraft" },
            { label: "Delivery Address", name: "deliveryAddress", type: "text", required: true },
            { label: "Expected Completion Date", name: "expectedCompletionDate", type: "date", required: true },
            { label: "Unit", name: "unit", type: "text", placeholder: "e.g. A", required: true }
          ].map(({ label, name, ...rest }) => (
            <div key={name}>
              <label className="block text-sm font-semibold">{label}</label>
              <input
                {...rest}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          ))}

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
          <div ref={printRef}>
            <div className="text-center font-bold mb-1 text-[12px]">Production Sticker</div>

            <div className="flex justify-between"><span><strong>Client:</strong> {productionDetail.client}</span><span><strong>Size:</strong> {productionDetail.size}</span></div>
            <div className="flex justify-between"><span><strong>Ply:</strong> {productionDetail.ply}</span><span><strong>Type:</strong> {productionDetail.typeOfProduct}</span></div>
            <div className="flex justify-between"><span><strong>Product:</strong> {productionDetail.productType}</span><span><strong>Boxes:</strong> {productionDetail.quantity}</span></div>
            <div className="flex justify-between"><span><strong>Top GSM:</strong> {productionDetail.topGsm}</span><span><strong>Liner GSM:</strong> {productionDetail.linerGsm}</span></div>
            <div className="flex justify-between"><span><strong>Flute GSM:</strong> {productionDetail.fluteGsm}</span><span><strong>Cut Len:</strong> {productionDetail.cuttingLength}</span></div>
            <div className="flex justify-between"><span><strong>Top Mat:</strong> {productionDetail.topMaterial}</span><span><strong>Liner Mat:</strong> {productionDetail.linerMaterial}</span></div>
            <div className="flex justify-between"><span><strong>Flute Mat:</strong> {productionDetail.fluteMaterial}</span><span></span></div>

            <div className="section-title">ONE UPS</div>
            <div className="flex justify-between"><span>Deckle: {productionDetail.deckle}</span><span>P: {productionDetail.plain} | S: {productionDetail.sheets}</span></div>

            <div className="section-title">TWO UPS</div>
            <div className="flex justify-between"><span>Deckle: {productionDetail.twoUpsDeckle}</span><span>P: {productionDetail.twoUpsPlain} | S: {productionDetail.twoUpsSheets}</span></div>

            <div className="section-title">THREE UPS</div>
            <div className="flex justify-between"><span>Deckle: {productionDetail.threeUpsDeckle}</span><span>P: {productionDetail.threeUpsPlain} | S: {productionDetail.threeUpsSheets}</span></div>

            <div className="section-title">FOUR UPS</div>
            <div className="flex justify-between"><span>Deckle: {productionDetail.fourUpsDeckle}</span><span>P: {productionDetail.fourUpsPlain} | S: {productionDetail.fourUpsSheets}</span></div>

            <div className="section-title">Material Required</div>
            <div className="flex justify-between"><span>Top: {productionDetail.totalTopWeightReq.toFixed(2)} kg</span><span>Flute: {productionDetail.totalFluteWeightReq.toFixed(2)} kg</span></div>
            <div className="flex justify-between"><span>Liner: {productionDetail.totalLinerWeightReq.toFixed(2)} kg</span><span></span></div>
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
