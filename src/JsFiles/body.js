import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import IndustryList from "./IndustryList";

const Body = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="main-container">
      {/* Floating Toolbar */}
      <div className="social-toolbar">
        <button className="contact-button" title="Contact Us" onClick={handleContactClick}>
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <span className="button-text">Contact Us</span>
        </button>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-button instagram" title="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-button twitter" title="X">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <a href="https://wa.me/918123120809" target="_blank" rel="noopener noreferrer" className="social-button whatsapp" title="WhatsApp">
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </div>

      <div className="content-container">
        <iframe
          src="https://www.youtube.com/embed/V08-xaBooRY?start=5"
          title="YouTube video player"
          allowFullScreen
          className="video-frame"
        ></iframe>

        <IndustryList />
      </div>
    </div>
  );
};

export default Body;
