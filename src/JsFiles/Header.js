import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CssFiles/header.css";
import { useNavigate } from "react-router-dom";
const Headers = () => {
    const [showAdmin, setShowAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
                setShowAdmin(true);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (
        <nav className="nav-bar">
            <div className="nav-bar-div">

                <div>
                    <img 
                        onClick={() => {navigate("/")}}
                        src="https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/refs/heads/main/AE%20Logo.jpeg"
                        className="header-logo"
                        alt="logo"
                    />
                </div>

                <div className="nav-items">
                    <div className="home"><Link to="/">Home</Link></div>

                    <div className="dropdown">
                        <div className="products"><Link to="/products">Products/Services</Link></div>
                    </div>

                    <div className="dropdown">
                        <div className="industry"><Link to="/industries">Industries We Serve</Link></div>
                    </div>

                    <div className="dropdown">
                        <div className="aboutus"><Link to="/about">About Us</Link></div>
                        <div className="dropdown-content">
                        </div>
                    </div>

                    <div className="dropdown">
                        <div className="contact"><Link to="/contact">Contact Us</Link></div>
                        <div className="dropdown-content">
                        </div>
                    </div>
                </div>

                <div>
                    {showAdmin && (
                        <Link to="/admin" className="admin-button">Admin</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Headers;