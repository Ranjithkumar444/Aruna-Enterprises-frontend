import React, { useState } from 'react';
import axios from 'axios';
import "../CssFiles/OrderForm.css";

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
            quantity: parseInt(formData.quantity),
            status: 'TODO',
            createdBy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expectedCompletionDate: new Date(formData.expectedCompletionDate).toISOString()
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/order/create-order`, payload, {
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
            alert("Failed to create order. Please try again.");
        }
    };

    return (
        <div className="order-form-container">
            <h2>Create Order</h2>
            <form onSubmit={handleSubmit} className="order-form">
                {[
                    ['client', 'Client Name'],
                    ['productType', 'Product Type'],
                    ['quantity', 'Quantity', 'number'],
                    ['size', 'Size'],
                    ['materialGrade', 'Material Grade'],
                    ['deliveryAddress', 'Delivery Address'],
                    ['expectedCompletionDate', 'Expected Completion Date', 'date'],
                    ['unit', 'Unit'],
                ].map(([name, label, type = 'text']) => (
                    <div className="form-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            id={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required={name !== 'materialGrade'}
                        />
                    </div>
                ))}

                <button type="submit" className="submit-button">Create Order</button>
            </form>
        </div>
    );
};

export default OrderForm;
