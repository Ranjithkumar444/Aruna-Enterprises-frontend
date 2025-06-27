import React from "react";
import {
  FaWhatsapp,
  FaFacebook, 
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";


const industriesServed = [
  "Textiles",
  "Building Materials",
  "HomeWare,TableWare,Microwave,CookWare",
  "Chemical/Household Cleaning",
  "MotorCycle Accessories",
  "Packaging Machinery/Batch coding printer",
  "Animal Food Package",
  "Furnitures Packaging",
  "Fashion and Apparel",
  "Organic Food Industries",
  "Beverage",
  "Plastics Industry",
  "Paint Industry",
  "Footware Rubber",
  "Quartz Silica",
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-gray-700 pb-10 mb-10">
        
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="text-purple-400">Locate</span> Us
          </h2>
          <p className="text-lg font-semibold text-gray-200">Unit 1</p>
          <address className="not-italic text-gray-400 text-base leading-relaxed">
            Last Bus Stop, Sy. No. 10/1,<br />
            7th Cross, B.T Krishnappa Layout,<br />
            Near Abbigere, Post, Chikkabanavara,<br />
            Bengaluru, Karnataka 560090
          </address>
          <br />
          <p className="text-lg font-semibold text-gray-200">Unit 2</p>
          <address className="not-italic text-gray-400 text-base leading-relaxed">
            UNIT - 2<br />
            158/2,Shed No 9,Maharudreshwara Nagara,<br />
            Kempapura Main Road,<br/>
            Chikkabanavara Post Banglore,<br/>
            Karnataka 560090
          </address>
        </div>

        
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="text-purple-400">Industries</span> Served
          </h2>
          <div className="flex flex-wrap gap-2">
            {industriesServed.map((sector, index) => (
              <span key={index} className="bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-full hover:bg-purple-600 transition duration-300 cursor-default">
                {sector}
              </span>
            ))}
          </div>
        </div>

        
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="text-purple-400">Quick</span> Links
          </h2>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition duration-200 text-base font-medium">Home</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-200 text-base font-medium">About Us</Link></li>
            <li className="ml-4"><Link to="/about#history" className="text-gray-500 hover:text-gray-300 transition duration-200 text-sm">- History</Link></li>
            <li className="ml-4"><Link to="/about#visionmission" className="text-gray-500 hover:text-gray-300 transition duration-200 text-sm">- Vision and Mission</Link></li>
            <li className="ml-4"><Link to="/about#ourteam" className="text-gray-500 hover:text-gray-300 transition duration-200 text-sm">- Our Team</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-200 text-base font-medium">Contact Us</Link></li>
            <li className="ml-4"><Link to="/contact/#location" className="text-gray-500 hover:text-gray-300 transition duration-200 text-sm">- Location</Link></li>
            <li className="ml-4"><Link to="/contact/#contactus" className="text-gray-500 hover:text-gray-300 transition duration-200 text-sm">- Contact</Link></li>
            <li><Link to="/products#boxsector" className="text-gray-400 hover:text-white transition duration-200 text-base font-medium">Box Types</Link></li>
          </ul>
        </div>
      </div>

      
      <div className="flex justify-center space-x-6 pt-10">
        <a href="https://wa.me/9538033119" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition duration-300 text-3xl">
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/arunaenterprisesblr/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition duration-300 text-3xl">
          <FaInstagram />
        </a>
        <a href="https://x.com/arunaenterprise" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition duration-300 text-3xl">
          <FaXTwitter />
        </a>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} Aruna Enterprises. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;