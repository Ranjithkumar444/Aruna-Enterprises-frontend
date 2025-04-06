import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Link } from "react-router-dom";

const Headers = () => {
    return (
        <nav className="nav-bar">
            <div className="nav-bar-div">
                
                {/* Logo */}
                <div>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                        className="header-logo"
                        alt="logo"
                    />
                </div>

                {/* Nav Items */}
                <div className="nav-items">
                    <Link to="/">Home</Link>

                    <div className="dropdown">
                        <Link to="/products">Products/Services</Link>
                        <div className="dropdown-content">
                            <Link to="/products/item1">CardBoard Box</Link>
                            <Link to="/products/item2"></Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <Link to="/industries">Industries We Serve</Link>
                        <div className="dropdown-content">
                            <Link to="/industries/auto">Bosch</Link>
                            <Link to="/industries/food">Cutting Edge</Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <Link to="/infrastructure">Infrastructure/Units</Link>
                        <div className="dropdown-content">
                            <Link to="/infrastructure/unit1">Unit 1</Link>
                            <Link to="/infrastructure/unit2">Unit 2</Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <Link to="/quality">Quality & Certification</Link>
                        <div className="dropdown-content">
                            <Link to="/quality/iso">ISO</Link>
                            <Link to="/quality/testing">Testing</Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <Link to="/about">About Us</Link>
                        <div className="dropdown-content">
                            <Link to="/about/history">About AE</Link>
                            <Link to="/about/team">Our Team</Link>
                            <Link to="/about/history">Our History</Link>
                        </div>
                    </div>

                    <div className="dropdown">
                        <Link to="/contact">Contact Us</Link>
                        <div className="dropdown-content">
                            <Link to="/contact/email">Email</Link>
                            <Link to="/contact/phone">Phone</Link>
                        </div>
                    </div>
                </div>

                {/* Admin Button */}
                <div>
                    <Link to="/admin" className="admin-button">Admin</Link>
                </div>
            </div>
        </nav>
    );
};


export default Headers;