import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Link } from "react-router-dom";
import "../CssFiles/header.css"
const Headers = () => {
    return (
        <nav className="nav-bar">
            <div className="nav-bar-div">

                <div>
                    <img
                        src="https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/refs/heads/main/AE%20Logo.jpeg"
                        className="header-logo"
                        alt="logo"
                    />
                </div>

                <div className="nav-items">
                    <div className="home"><Link to="/">Home</Link></div>

                    <div className="dropdown">
                        <div className="products"><Link to="/products">Products/Services</Link></div>
                        <div className="dropdown-content">
                            <Link to="/products/item1">CardBoard Box</Link>
                            <Link to="/products/item2"></Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <div className="industry"><Link to="/industries">Industries We Serve</Link></div>
                    </div>

                    <div className="dropdown">
                        <div className="infra"><Link to="/infrastructure">Infrastructure/Units</Link></div>
                        <div className="dropdown-content">
                            <Link to="/infrastructure/unit1">Unit 1</Link>
                            <Link to="/infrastructure/unit2">Unit 2</Link>
                        </div>
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
                    <Link to="/admin" className="admin-button">Admin</Link>
                </div>
            </div>
        </nav>
    );
};


export default Headers;