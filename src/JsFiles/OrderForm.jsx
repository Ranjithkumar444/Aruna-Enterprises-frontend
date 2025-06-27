import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
    const [formData, setFormData] = useState({
        client: '',
        productType: '',
        quantity: '',
        size: '',
        materialGrade: '',
        deliveryAddress: '',
        expectedCompletionDate: '',
        unit: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            
            expectedCompletionDate: formData.expectedCompletionDate ? new Date(formData.expectedCompletionDate).toISOString() : null 
        };

        try {
            await axios.post("https://arunaenterprises.azurewebsites.net/admin/order/create-order", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert("Order created successfully!");
            
            setFormData({
                client: '',
                productType: '',
                quantity: '',
                size: '',
                materialGrade: '',
                deliveryAddress: '',
                expectedCompletionDate: '',
                unit: ''
            });
        } catch (error) {
            console.error("Error creating order:", error);
            
            if (error.response) {
                alert(`Failed to create order: ${error.response.data.message || error.response.data || "Server error"}`);
            } else if (error.request) {
                alert("Failed to create order: No response from server. Please check your network connection.");
            } else {
                alert("Failed to create order: An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 drop-shadow-sm">
                    Create New Order
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        ['client', 'Client Name', 'text'],
                        ['productType', 'Product Type', 'text'],
                        ['quantity', 'Quantity', 'number'],
                        ['size', 'Size', 'text'],
                        ['materialGrade', 'Material Grade', 'text'],
                        ['deliveryAddress', 'Delivery Address', 'text'],
                        ['expectedCompletionDate', 'Expected Completion Date', 'date'],
                        ['unit', 'Unit', 'text'],
                    ].map(([name, label, type = 'text']) => (
                        <div className="space-y-1.5" key={name}>
                            <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                id={name}
                                value={formData[name]}
                                onChange={handleChange}
                                
                                required={name !== 'materialGrade'} 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        Create Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;