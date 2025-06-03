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
import BoxGallery from "./BoxGallery";
import WhoWeAre from "./WhoWeAre";
import Solution from "./Solution";
import ArunaEnterprises from "./ArunaEnterprises";

const Body = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="main-container">
      

      <div className="social-toolbar">
        <button className="contact-button" title="Contact Us" onClick={handleContactClick}>
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <span className="button-text">Contact Us</span>
        </button>
        <a href="https://www.instagram.com/arunaenterprisesblr/" target="_blank" rel="noopener noreferrer" className="social-button instagram" title="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-button twitter" title="X">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <a href="https://wa.me/9538033119" target="_blank" rel="noopener noreferrer" className="social-button whatsapp" title="WhatsApp">
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </div>

      <div>
        <iframe
          src="https://www.youtube.com/embed/E7z7zQdhXpQ?autoplay=1&mute=1&loop=1&playlist=E7z7zQdhXpQ"
          title="YouTube video player"
          allowFullScreen
          className="video-frame"
        ></iframe>
        
        <WhoWeAre/>

        <IndustryList />

        <BoxGallery/>

        <Solution/>

        <ArunaEnterprises/>

      </div>
    </div>
  );
};

export default Body;
