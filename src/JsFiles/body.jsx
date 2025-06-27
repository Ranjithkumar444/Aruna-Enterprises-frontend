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
    <div className="relative overflow-hidden">
      
      <div className="fixed top-1/2 left-0 transform -translate-y-1/2 flex flex-col gap-3 z-50">
        
        <button
          className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-12 h-12 rounded-r-full shadow-lg hover:w-14 hover:h-14 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
          title="Contact Us" 
          onClick={handleContactClick}
        >
          <FontAwesomeIcon icon={faEnvelope} className="text-xl group-hover:animate-bounce-icon" />
        </button>

        
        <a
          href="https://www.instagram.com/arunaenterprisesblr/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-center items-center bg-gradient-to-tr from-pink-500 via-purple-500 to-red-500 text-white w-12 h-12 rounded-r-full shadow-lg hover:w-14 hover:h-14 hover:bg-gradient-to-br transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
          title="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-xl group-hover:rotate-6 transition-transform" />
        </a>

        
        <a
          href="https://x.com/arunaenterprise"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-center items-center bg-gray-800 text-white w-12 h-12 rounded-r-full shadow-lg hover:w-14 hover:h-14 hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
          title="X"
        >
          <FontAwesomeIcon icon={faXTwitter} className="text-xl group-hover:rotate-6 transition-transform" />
        </a>

        
        <a
          href="https://wa.me/9538033119"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-center items-center bg-gradient-to-br from-green-500 to-teal-600 text-white w-12 h-12 rounded-r-full shadow-lg hover:w-14 hover:h-14 hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
          title="WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-xl group-hover:rotate-6 transition-transform" />
        </a>
      </div>

      
      <div>
        
        <iframe
          src="https://www.youtube.com/embed/E7z7zQdhXpQ?autoplay=1&mute=1&loop=1&playlist=E7z7zQdhXpQ"
          title="Aruna Enterprises Introduction" 
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
          className="w-full h-[400px] sm:h-[500px] lg:h-[600px]"
        ></iframe>
        
        
        <WhoWeAre />
        <IndustryList />
        <BoxGallery />
        <Solution />
        <ArunaEnterprises />
      </div>
    </div>
  );
};

export default Body;