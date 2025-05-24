import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import KanbanBoard from './KanbanBoard';

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

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminDetails");
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

            <div
                style={{
                    width: isMenuOpen ? "200px" : "60px",
                    backgroundColor: "#343a40",
                    color: "white",
                    transition: "width 0.3s",
                    position: "relative",
                    overflow: "hidden"
                }}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <div style={{ padding: "1rem", fontSize: "1.5rem", cursor: "pointer" }}>
                    ☰
                </div>
                <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                    <li
                        onClick={() => handleMenuClick("admin/employee")}
                        style={{ padding: "1rem", cursor: "pointer", borderBottom: "1px solid #555" ,whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",}}
                    >
                        Employee
                    </li>
                    <li
                        onClick={() => handleMenuClick("admin/attendance")}
                        style={{ padding: "1rem", cursor: "pointer", borderBottom: "1px solid #555",whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis", }}
                    >
                        Attendance
                    </li>
                    <li
                        onClick={() => handleMenuClick("admin/inventory")}
                        style={{ padding: "1rem", cursor: "pointer", borderBottom: "1px solid #555",whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis", }}
                    >
                        Inventory
                    </li>
                    <li
                        onClick={() => handleMenuClick("admin/salary")}
                        style={{ padding: "1rem", cursor: "pointer", borderBottom: "1px solid #555" ,whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",}}
                    >
                        salary
                    </li>
                    <li
                        onClick={() => handleMenuClick("admin/admins")}
                        style={{ padding: "1rem", cursor: "pointer", borderBottom: "1px solid #555",whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis", }}
                    >
                        Admins
                    </li>
                </ul>
            </div>

            <div style={{ flex: 1, padding: "2rem", position: "relative" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1.5rem",
                        padding: "0.5rem 1.2rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
                <h1 style={{ textAlign: "center", marginTop: "4rem" }}>
                    Hello, Welcome <span style={{ color: "#007bff" }}>{adminName}</span>
                </h1>

                <div>
                    <KanbanBoard/>
                </div>

                <div className="buttons-container">
                    <div className="buttons-box">
                        <div className="add-industry-btn">
                            <button onClick={() => navigate("admin/register-industry")}>Add Industry</button>
                        </div>
                        <div className="create-order-btn">
                            <button onClick={() => navigate("admin/order-create")}>Create Order</button>
                        </div>
                        <div className="contact-request-btn">
                            <button onClick={() => navigate("admin/contact/contactDetails")}>Contact Request</button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default AdminDashboard; 