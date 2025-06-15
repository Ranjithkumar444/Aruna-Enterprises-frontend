import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CssFiles/header.css";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminModal = ({ onClose, onLogin }) => {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal">
                <h3>Admin Access</h3>
                <button onClick={onLogin} className="admin-login-btn">Go to Admin</button>
                <button onClick={onClose} className="admin-close-btn">Close</button>
            </div>
        </div>
    );
};

const Headers = () => {
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Desktop shortcut: Ctrl + Shift + A
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
                setShowAdminModal(true);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    // Click outside to close mobile menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.nav-bar-div')) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Long press on logo (mobile) to show Admin modal
    let pressTimer;
    const handleLogoTouchStart = () => {
        pressTimer = setTimeout(() => setShowAdminModal(true), 2000); 
    };
    const handleLogoTouchEnd = () => {
        clearTimeout(pressTimer);
    };

    return (
        <nav className="nav-bar">
            <div className="nav-bar-div">
                <img
                    onClick={() => navigate("/")}
                    onTouchStart={handleLogoTouchStart}
                    onTouchEnd={handleLogoTouchEnd}
                    src="https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/refs/heads/main/AE%20Logo.jpeg"
                    className="header-logo"
                    alt="logo"
                />

                <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                <div className={`nav-items ${mobileMenuOpen ? "mobile-active" : ""}`}>
                    <div><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></div>
                    <div><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products/Services</Link></div>
                    <div><Link to="/industries" onClick={() => setMobileMenuOpen(false)}>Industries We Serve</Link></div>
                    <div><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></div>
                    <div><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></div>
                </div>
            </div>

            {showAdminModal && (
                <AdminModal
                    onClose={() => setShowAdminModal(false)}
                    onLogin={() => {
                        setShowAdminModal(false);
                        navigate("/admin");
                    }}
                />
            )}
        </nav>
    );
};

export default Headers;
