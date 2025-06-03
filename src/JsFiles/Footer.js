import React from "react";
import "../CssFiles/Footer.css"
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
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h2 className="footer-title">
            <span className="highlight">Locate</span> Us
          </h2>
          <p className="unit-title">Unit 1</p>
          <p>
            Last Bus Stop, Sy. No. 10/1,<br />
            7th Cross, B.T Krishnappa Layout,<br />
            Near Abbigere, Post, Chikkabanavara,<br />
            Bengaluru, Karnataka 560090
          </p>
          <br />
          <p className="unit-title">Unit 2</p>
          <p>
            UNIT - 2<br />
            158/2,Shed No 9,Maharudreshwara Nagara,<br />
            Kempapura Main Road,<br/>
            Chikkabanavara Post Banglore,
            Karnataka 560090 
          </p>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">
            <span className="highlight">Industries</span> Served
          </h2>
          <div className="industries-list">
            {industriesServed.map((sector, index) => (
              <span key={index} className="industry-tag">
                {sector}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">
            <span className="highlight">Quick</span> Links
          </h2>
          <ul className="quick-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li className="footer-history"><Link to="/about#history">- History</Link></li>
            <li className="footer-vimi"><Link to="/about#visionmission">- Vision and Mission</Link></li>
            <li className="footer-vimi"><Link to="/about#ourteam">- Our Team</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li className="footer-vimi"><Link to="/contact/#location">- Location</Link></li>
            <li className="footer-vimi"><Link to="/contact/#contactus">- Contact</Link></li>
            <li><Link to="/products#boxsector">Box Types</Link></li>
            
          </ul>
        </div>
      </div>

      <div className="social-icons">
        <a href="https://wa.me/your-number" target="_blank" rel="noreferrer">
          <FaWhatsapp />
        </a>
        <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">
          <FaFacebook />
        </a>
        <a href="https://instagram.com/yourpage" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://x.com/yourpage" target="_blank" rel="noreferrer">
          <FaXTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
