import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";

import { useLocation } from "react-router-dom";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const location = useLocation();

  
  const contactInfoRef = useRef(null);
  const mapSectionRef = useRef(null);
  const contactFormRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            
            entry.target.classList.add("animate-fade-in-up"); 
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } 
    );

    
    [contactInfoRef, mapSectionRef, contactFormRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      [contactInfoRef, mapSectionRef, contactFormRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [location]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        "https://arunaenterprises.azurewebsites.net/public/contact-details",
        formData
      );
      
      setSubmitMessage(response.data.message || 'Thank you for your message!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="font-sans text-gray-700 leading-relaxed bg-gradient-to-br from-blue-50 via-white to-gray-50 min-h-screen">
      
      <section
        className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://raw.githubusercontent.com/Ranjithkumar444/ArunaEnterprisesImage/main/contact%20us.jpg')",
        }}
      >
        
        <div className="absolute inset-0 bg-blue-900 opacity-20"></div> 
        <div className="relative z-10 max-w-4xl p-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 text-shadow-lg animate-fade-in-down">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light animate-fade-in-up-slow">
            We're here to help and answer any question you might have.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <section id="location" ref={contactInfoRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 opacity-0 animate-delay-200">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-md">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Locations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">UNIT - 1</h4>
                <p className="text-base text-gray-600 mb-4">
                  Last Bus Stop, Sy. No. 10/1,<br />
                  7th Cross, B.T Krishnappa Layout<br />
                  Near Abbigere, Post,<br />
                  Chikkabanavara,<br />
                  Bengaluru, Karnataka 560090
                </p>
                <a 
                  href="https://maps.google.com/?q=Aruna+Enterprises+Unit+1+Bangalore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> View on Map
                </a>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">UNIT - 2</h4>
                <p className="text-base text-gray-600 mb-4">
                  158/2,Shed No 9,Maharudreshwara Nagara,<br />
                  Kempapura Main Road,<br/>
                  Chikkabanavara Post Banglore,<br/>
                  Karnataka 560090 
                </p>
                <a 
                  href="https://maps.google.com/?q=Aruna+Enterprises+Unit+2+Bangalore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> View on Map
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-md">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Contact Details</h3>
            <ul className="list-none p-0 text-xl text-gray-700 space-y-4">
              <li>
                <strong className="text-gray-900">Phone:</strong>{" "}
                <a href="tel:+919538033119" className="text-blue-600 hover:text-blue-800 transition-colors">+91 9538033119</a>
              </li>
              <li>
                <strong className="text-gray-900">Email:</strong>{" "}
                <a href="mailto:sales@arunaenterprises.com" className="text-blue-600 hover:text-blue-800 transition-colors">sales@arunaenterprises.com</a>
              </li>
              <li className="flex flex-col items-center">
                <strong className="text-gray-900">WhatsApp:</strong> +91 9538033119
                <a 
                  href="https://wa.me/9538033119" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-5 py-2 mt-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  <FaWhatsapp className="mr-3 text-2xl" /> Chat Now
                </a>
              </li>
            </ul>
          </div>
        </section>

        
        <section ref={mapSectionRef} className="mb-20 opacity-0 animate-delay-400">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 relative pb-4">
            Find Us On Map
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Unit 1</h4>
              <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d313.45830577488255!2d77.52763724424513!3d13.076125922781513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae232b292fda39%3A0x19ef89c94a560108!2sAruna%20Enterprises!5e0!3m2!1sen!2sin!4v1746253045657!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="Aruna Enterprises Unit 1"
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Unit 2</h4>
              <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1145593874594!2d77.50260717687732!3d13.09192546415105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae230048f2f4c7%3A0x54cdcae335d40859!2sAruna%20enterprises%20unit%202!5e0!3m2!1sen!2sin!4v1746253388860!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="Aruna Enterprises Unit 2"
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        
        <section id="contactus" ref={contactFormRef} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-3xl mx-auto opacity-0 animate-delay-600">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-md">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you soon</p>
          </div>
          
          {submitMessage && (
            <div className={`py-3 px-6 rounded-lg text-center mb-6 text-lg font-medium ${
              submitMessage.includes('error') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
            } animate-fade-in`}>
              {submitMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
              />
            </div>
            
            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg resize-y"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactForm;