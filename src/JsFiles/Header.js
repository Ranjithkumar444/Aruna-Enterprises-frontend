import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CssFiles/header.css";
import { FaBars, FaTimes } from "react-icons/fa"; // For hamburger & close icons

const Headers = () => {
    const [showAdmin, setShowAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
                setShowAdmin(true);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <nav className="nav-bar">
            <div className="nav-bar-div">
                <img 
                    onClick={() => navigate("/")}
                    src="https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/refs/heads/main/AE%20Logo.jpeg"
                    className="header-logo"
                    alt="logo"
                />

                {/* Hamburger Icon for Mobile */}
                <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                {/* Desktop Menu */}
                <div className={`nav-items ${mobileMenuOpen ? "mobile-active" : ""}`}>
                    <div><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></div>
                    <div><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products/Services</Link></div>
                    <div><Link to="/industries" onClick={() => setMobileMenuOpen(false)}>Industries We Serve</Link></div>
                    <div><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></div>
                    <div><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></div>
                    {showAdmin && (
                        <div><Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="admin-button">Admin</Link></div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Headers;
