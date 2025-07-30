import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import KanbanBoard from './KanbanBoard';
import InUseReelsTable from './InUseReelsTable';
import OrderList from './OrderList';
import OrderSummaryDashboard from './OrderSummaryDashboard';
import react from 'react';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");
    const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
    const [adminName, setAdminName] = useState("");
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (!token || !adminDetails) {
            navigate("/admin");
        } else {
            setAdminName(`${adminDetails.firstName} ${adminDetails.lastName}`);
        }
    }, [token, adminDetails, navigate]);

    console.log(token);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminDetails");
        localStorage.removeItem("adminLoginTime");
        navigate("/admin");
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    // Fetch stock alerts only if login is within 5 minutes
    useEffect(() => {
        const fetchAlerts = async () => {
            const loginTimeStr = localStorage.getItem("adminLoginTime");
            if (!loginTimeStr) return;

            const loginTime = new Date(loginTimeStr);
            const now = new Date();
            const diffInMinutes = (now - loginTime) / (1000 * 60);

            if (diffInMinutes > 5) {
                setAlerts([]);
                return;
            }

            try {
                const response = await fetch("https://arunaenterprises.azurewebsites.net/admin/reel/stock/alert/view", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    // Optional: keep only alerts within 24 hours
                    const recentAlerts = data.filter(alert => {
                        const alertTime = new Date(alert.alertTime);
                        const hoursDiff = (now - alertTime) / (1000 * 60 * 60);
                        return hoursDiff <= 24;
                    });

                    setAlerts(recentAlerts);
                }
            } catch (error) {
                console.error("Error fetching stock alerts", error);
            }
        };

        if (token) fetchAlerts();
    }, [token]);

    // Auto-hide alerts after 5 minutes of login
    useEffect(() => {
        const loginTimeStr = localStorage.getItem("adminLoginTime");
        if (!loginTimeStr) return;

        const loginTime = new Date(loginTimeStr);
        const now = new Date();
        const elapsed = now - loginTime;
        const remaining = Math.max(0, 1 * 60 * 1000 - elapsed); // ms

        const timer = setTimeout(() => {
            setAlerts([]);
        }, remaining);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-gray-50">

            {/* ✅ Floating Alert Banner */}
            {alerts.length > 0 && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-fit max-w-4xl bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="font-semibold text-center">Low Stock Alerts</p>
                    </div>
                    <ul className="text-sm space-y-1">
                        {alerts.map((alert, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white/50 px-3 py-2 rounded">
                                <span className="font-medium">Deckle: {alert.deckle}</span>
                                <span className="text-gray-600">GSM: {alert.gsm}</span>
                                <span className="text-gray-600">Unit: {alert.unit}</span>
                                <span className="text-red-600 font-medium">Current: {alert.totalWeight}kg</span>
                                <span className="text-amber-600 font-medium">Min: {alert.threshold}kg</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Header */}
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{adminName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Toolbar */}
                    <div className="flex items-center space-x-1 py-3 border-t border-gray-100">
                        {[
                            { name: "Employee", path: "admin/employee", icon: "👥" },
                            { name: "Attendance", path: "admin/attendance", icon: "📅" },
                            { name: "Inventory", path: "admin/inventory", icon: "📦" },
                            { name: "Salary", path: "admin/salary", icon: "💰" },
                            { name: "Admins", path: "admin/admins", icon: "👨‍💼" },
                            { name: "Clients", path: "admin/clients", icon: "👥" },
                            { name: "OrderSummary", path: "admin/ordersummary", icon: "📊" },
                            { name: "Analytics", path: "admin/analytics", icon: "📈" },
                            { name: "Completed Orders", path: "admin/completedOrders", icon: "✅" }
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleMenuClick(item.path)}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Welcome back, <span className="text-blue-600">{adminName}</span>
                    </h2>
                    <p className="text-gray-600">Manage your operations and monitor key metrics</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate("admin/order-create")}
                            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Order
                        </button>
                        
                        <button
                            onClick={() => navigate("admin/register-industry")}
                            className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Add Industry
                        </button>
                        
                        <button
                            onClick={() => navigate("admin/contact/contactDetails")}
                            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Requests
                        </button>
                        
                        <button
                            onClick={() => navigate("admin/box/boxCreate")}
                            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Create Box
                        </button>
                    </div>
                </div>

                {/* System Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">System Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate("admin/machine/config")}
                            className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Machine Config
                        </button>

                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch("https://arunaenterprises.azurewebsites.net/admin/reel/stock/alert/trigger", {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });

                                    if (response.ok) {
                                        alert("✅ Stock check triggered manually!");
                                    } else {
                                        alert("❌ Failed to trigger stock alert.");
                                    }
                                } catch (error) {
                                    console.error("Trigger error:", error);
                                    alert("❌ Error occurred while triggering alert.");
                                }
                            }}
                            className="flex items-center justify-center px-4 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Trigger Stock Alert
                        </button>
                    </div>
                </div>

                {/* Dashboard Components */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Kanban Board</h3>
                        <KanbanBoard />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">In-Use Reels</h3>
                        <InUseReelsTable />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Order List</h3>
                        <OrderList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
