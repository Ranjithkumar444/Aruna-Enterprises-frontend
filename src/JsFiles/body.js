// components/Body.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Body = () => {
  return (
    <div className="relative">

      <div className="w-full px-4 py-6">
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/V08-xaBooRY?start=5"
          title="YouTube video player"
          allowFullScreen
          className="rounded-xl shadow-xl"
        ></iframe>
      </div>

      <div className="fixed top-1/3 left-0 z-50 flex flex-col items-center gap-4 p-2 bg-white shadow-xl rounded-r-lg">
        <Link to="/contact">
          <button className="contact-button" title="Contact Us">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <span className="button-text">Contact Us</span>
          </button>
        </Link>

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
    </div>
  );
};

export default Body;
