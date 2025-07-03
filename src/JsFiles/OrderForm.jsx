import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'size') {
      // Convert lowercase x to uppercase X
      const formatted = value.toUpperCase();

      // Only allow digits and uppercase X
      const allowed = /^[0-9X]*$/;
      if (!allowed.test(formatted)) return;

      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      const existingOrders = JSON.parse(localStorage.getItem("suggestedReelsOrders")) || [];
      const newOrder = {
        response: res.data,
        orderDetails: { 
          ...formData,
          orderId: res.data.orderId
        },
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(
        "suggestedReelsOrders",
        JSON.stringify([...existingOrders, newOrder])
      );

      alert("Order created successfully!");
      navigate('/admin/dashboard');
      
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create New Order
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Client Name</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
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
            <label className="block text-sm font-semibold">Material Grade</label>
            <input
              type="text"
              name="materialGrade"
              value={formData.materialGrade}
              onChange={handleChange}
              placeholder="e.g. Natural, Kraft"
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
    </div>
  );
};

export default OrderForm;
