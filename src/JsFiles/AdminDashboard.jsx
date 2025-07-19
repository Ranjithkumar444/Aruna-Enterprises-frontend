import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import KanbanBoard from './KanbanBoard';
import InUseReelsTable from './InUseReelsTable';
import OrderList from './OrderList';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");
    const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
    const [adminName, setAdminName] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        const remaining = Math.max(0, 5 * 60 * 1000 - elapsed); // ms

        const timer = setTimeout(() => {
            setAlerts([]);
        }, remaining);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen font-sans bg-gray-50">

            {/* ✅ Floating Alert Banner */}
            {alerts.length > 0 && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-fit max-w-4xl bg-yellow-100 border border-yellow-400 text-yellow-900 px-4 py-2 rounded shadow z-50">
                    <p className="font-semibold mb-1 text-center">⚠️ Low Stock Alerts</p>
                    <ul className="text-sm list-disc list-inside">
                        {alerts.map((alert, idx) => (
                            <li key={idx}>
                                Deckle: <strong>{alert.deckle}</strong>, GSM: <strong>{alert.gsm}</strong>, Unit: <strong>{alert.unit}</strong>, Current: <strong>{alert.totalWeight}kg</strong>, Min: <strong>{alert.threshold}kg</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`relative bg-gray-900 text-white transition-all duration-300 ease-in-out ${isMenuOpen ? "w-60" : "w-16"} flex-shrink-0 z-10`}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <div className="p-4 text-2xl cursor-pointer text-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? "✕" : "☰"}
                </div>

                {isMenuOpen && (
                    <div className="px-4 py-2 mb-4 text-center border-b border-gray-700">
                        <span className="text-lg font-semibold truncate block">{adminName}</span>
                    </div>
                )}

                <ul className="list-none p-0 mt-4">
                    {[
                        { name: "Employee", path: "admin/employee" },
                        { name: "Attendance", path: "admin/attendance" },
                        { name: "Inventory", path: "admin/inventory" },
                        { name: "Salary", path: "admin/salary" },
                        { name: "Admins", path: "admin/admins" },
                        { name: "Clients", path: "admin/clients" },
                        {name: "OrderSummary", path: "admin/ordersummary"},
                        {name: "Dashboard/Analytics", path: "admin/analytics"},
                        {name: "Completed Orders" , path: "admin/completedOrders"}
                    ].map((item) => (
                        <li
                            key={item.name}
                            onClick={() => handleMenuClick(item.path)}
                            className="py-3 px-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <span className={`${isMenuOpen ? 'inline' : 'hidden'} lg:inline`}>{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Dashboard */}
            <div className="flex-1 p-8 relative overflow-y-auto bg-gray-100">

                <button
                        onClick={() => navigate("admin/order-create")}
                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                    >
                        Create Order
                </button>

                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-6 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200"
                >
                    Logout
                </button>

                <h1 className="text-3xl md:text-4xl font-bold text-center mt-4 mb-8 text-gray-800">
                    Hello, Welcome <span className="text-blue-600">{adminName}</span>!
                </h1>

                <div className="mb-12">
                    <KanbanBoard />
                </div>

                <div className="mb-12">
                    <InUseReelsTable />
                </div>

                <div className="mb-12">
                    <OrderList />
                </div>

                <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-12">
                    <button
                        onClick={() => navigate("admin/register-industry")}
                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Add Industry
                    </button>
                    
                    <button
                        onClick={() => navigate("admin/contact/contactDetails")}
                        className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700"
                    >
                        Contact Request
                    </button>
                    <button
                        onClick={() => navigate("admin/box/boxCreate")}
                        className="w-full md:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700"
                    >
                        Create Box
                    </button>

                    <div className="w-full md:w-auto">
    <button
        onClick={async () => {
            try {
                const response = await fetch("http://localhost:8080/admin/reel/stock/alert/trigger", {
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
        className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transform hover:-translate-y-1"
    >
        ⚠️ Trigger Stock Alert
    </button>
</div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
