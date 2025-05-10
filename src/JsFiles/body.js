
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
    <div className="relative">

      <div className="w-full px-4 py-6 ml-10">
        <iframe
          width="90%"
          height="500"
          src="https://www.youtube.com/embed/V08-xaBooRY?start=5"
          title="YouTube video player"
          allowFullScreen
          className="rounded-xl shadow-xl"
          style={{ marginLeft: '50px', marginTop : '20px' }}
        ></iframe>
      </div>

      <div className="fixed top-1/3 left-0 z-50 flex flex-col items-center gap-4 p-2 bg-white shadow-xl rounded-r-lg" style={{marginTop: '50px'}}>
      <button className="contact-button" title="Contact Us" onClick={handleContactClick}>
        <FontAwesomeIcon icon={faEnvelope} className="icon" />
        <span className="button-text">Contact Us</span>
      </button>


        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button instagram"
          title="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button twitter"
          title="X"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button whatsapp"
          title="WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </div>

      {/* <div className="mt-20">
        <h2 className="text-3xl font-bold text-center my-6 text-gray-800">Industries We Serve</h2>
        <IndustryList/>
      </div> */}

      <IndustryList/>
    </div>
  );
};

export default Body;
