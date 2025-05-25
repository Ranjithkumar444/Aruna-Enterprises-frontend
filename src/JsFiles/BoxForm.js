import React, { useState } from 'react';
import axios from 'axios';
import "../CssFiles/BoxForm.css"; 

const BoxForm = () => {
    const [formData, setFormData] = useState({
        boxType: '',
        box: '',
        boxDescription: '',
        boxUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/box/create-box`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert("Box created successfully!");
            setFormData({
                boxType: '',
                box: '',
                boxDescription: '',
                boxUrl: ''
            });
        } catch (error) {
            console.error("Error creating box:", error);
            alert("Failed to create box. Please try again.");
        }
    };

    return (
        <div className="box-form-container">
            <h2>Create New Box</h2>
            <form onSubmit={handleSubmit} className="box-form">
                {[
                    ['boxType', 'Box Type'],
                    ['box', 'Box Name'],
                    ['boxDescription', 'Box Description'],
                    ['boxUrl', 'Box URL'],
                ].map(([name, label]) => (
                    <div className="form-group" key={name}>
                        <label>{label}</label>
                        <input
                            type="text"
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="submit-button">Create Box</button>
            </form>
        </div>
    );
};

export default BoxForm;
