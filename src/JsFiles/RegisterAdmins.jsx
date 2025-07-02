import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterAdmins = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-6 font-sans">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">Admin Management</h2>
                <p className="text-lg text-gray-600 mb-10">Manage administrative accounts for the dashboard.</p>

                <div className="flex flex-col sm:flex-row justify-center gap-6"> 
                    <button
                        onClick={() => navigate("/admin/admins/register")}
                        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md
                                   hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
                                   w-full sm:w-auto"
                    >
                        Create Admin
                    </button>
                    
                    <button 
                        onClick={() => navigate("/admin/admins/get-all-admins")}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                                   hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
                                   w-full sm:w-auto"
                    >
                        Get All Admins
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterAdmins;