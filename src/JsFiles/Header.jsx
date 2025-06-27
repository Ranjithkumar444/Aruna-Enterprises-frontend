import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminModal = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-80 transform transition duration-300 scale-95 hover:scale-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 bg-gradient-to-tr from-cyan-800 to-sky-700 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Admin Access</h3>
          <div className="w-full space-y-3">
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-cyan-700 to-sky-600 hover:from-cyan-800 hover:to-sky-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition duration-300 hover:scale-[1.02]"
            >
              Go to Admin
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium shadow-sm transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Headers = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        setShowAdminModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(".nav-wrapper") && !e.target.closest(".mobile-menu")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  let pressTimer;
  const handleLogoTouchStart = () => {
    pressTimer = setTimeout(() => setShowAdminModal(true), 2000);
  };
  const handleLogoTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-900 via-sky-800 to-indigo-900 shadow-2xl z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between nav-wrapper">
        <div className="flex items-center space-x-3">
          <img
            onClick={() => navigate("/")}
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
            src="https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/refs/heads/main/AE%20Logo.jpeg"
            alt="logo"
            className="w-14 h-14 md:w-16 md:h-16 cursor-pointer rounded-full border-2 border-white shadow-xl hover:scale-105 transition-transform duration-300"
          />
          <span className="hidden sm:block text-white font-semibold text-xl md:text-2xl tracking-wide font-serif">
            Aruna Enterprises
          </span>
        </div>

        
        <div className="hidden md:flex flex-grow justify-center space-x-5 lg:space-x-8">
          {[
            { path: "/", name: "Home" },
            { path: "/products", name: "Products/Services" },
            { path: "/industries", name: "Industries" },
            { path: "/about", name: "About Us" },
            { path: "/contact", name: "Contact Us" }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative group text-white font-medium px-4 py-2 transition-all duration-300 rounded-lg"
            >
              <span className="z-10 relative">{item.name}</span>
              <span className="absolute inset-0 bg-white bg-opacity-10 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></span>
              <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-amber-300 group-hover:w-4/5 group-hover:left-1/10 transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-cyan-900 to-sky-800 shadow-lg py-5 mobile-menu animate-fadeIn">
          <div className="flex flex-col items-center space-y-4 px-6">
            {[
              { path: "/", name: "Home" },
              { path: "/products", name: "Products/Services" },
              { path: "/industries", name: "Industries We Serve" },
              { path: "/about", name: "About Us" },
              { path: "/contact", name: "Contact Us" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-white font-medium py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      
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
