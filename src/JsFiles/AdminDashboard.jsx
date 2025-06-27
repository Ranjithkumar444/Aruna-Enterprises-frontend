import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"; 
import KanbanBoard from './KanbanBoard';
import InUseReelsTable from './InUseReelsTable';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");
    const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
    const [adminName, setAdminName] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        navigate("/admin"); 
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    return (
        <div className="flex min-h-screen font-sans bg-gray-50">
            <div
                className={`relative bg-gray-900 text-white transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "w-60" : "w-16"
                } flex-shrink-0 z-10`}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <div className="p-4 text-2xl cursor-pointer text-center"
                     onClick={() => setIsMenuOpen(!isMenuOpen)} 
                >
                    {isMenuOpen ? (
                        <span className="block transition-transform duration-300 ease-in-out rotate-0">✕</span> 
                    ) : (
                        <span className="block transition-transform duration-300 ease-in-out rotate-0">☰</span>
                    )}
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
            <div className="flex-1 p-8 relative overflow-y-auto bg-gray-100">
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-6 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                    Logout
                </button>
                
                <h1 className="text-3xl md:text-4xl font-bold text-center mt-4 mb-8 text-gray-800">
                    Hello, Welcome <span className="text-blue-600">{adminName}</span>!
                </h1>

                <div className="mb-12">
                    <KanbanBoard/>
                </div>

                <div className="mb-12">
                    <InUseReelsTable/>
                </div>

                <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-12">
                    <div className="w-full md:w-auto"> 
                        <button 
                            onClick={() => navigate("admin/register-industry")}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transform hover:-translate-y-1"
                        >
                            Add Industry
                        </button>
                    </div>
                    <div className="w-full md:w-auto">
                        <button 
                            onClick={() => navigate("admin/order-create")}
                            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transform hover:-translate-y-1"
                        >
                            Create Order
                        </button>
                    </div>
                    <div className="w-full md:w-auto">
                        <button 
                            onClick={() => navigate("admin/contact/contactDetails")}
                            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transform hover:-translate-y-1"
                        >
                            Contact Request
                        </button>
                    </div>
                    <div className="w-full md:w-auto">
                        <button 
                            onClick={() => navigate("admin/box/boxCreate")}
                            className="w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 transform hover:-translate-y-1"
                        >
                            Create Box
                        </button>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default AdminDashboard;