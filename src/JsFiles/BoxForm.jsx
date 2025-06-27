import React, { useState } from 'react';
import axios from 'axios';

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
            await axios.post("https://arunaenterprises.azurewebsites.net/admin/box/create-box", formData, {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 drop-shadow-sm">Create New Box</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        ['boxType', 'Box Type'],
                        ['box', 'Box Name'],
                        ['boxDescription', 'Box Description'],
                        ['boxUrl', 'Box URL'],
                    ].map(([name, label]) => (
                        <div className="space-y-1.5" key={name}>
                            <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
                                {label}
                            </label>
                            <input
                                id={name}
                                type="text"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out placeholder-gray-400"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        Create Box
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BoxForm;