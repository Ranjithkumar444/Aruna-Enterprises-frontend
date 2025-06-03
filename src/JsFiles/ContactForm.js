import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import "../CssFiles/ContactForm.css"
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
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/public/contact-details`,
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
    <div className="contact-container">
      <section className="contact-hero">
        <div className="hero-overlay">
        </div>
      </section>

      <div className="contact-content">
        <section id="location" className="contact-info-section">
          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h3>Our Locations</h3>
            
            <div className="location-cards">
              <div className="location-card">
                <h4>UNIT - 1</h4>
                <p>
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
                  className="map-link"
                >
                  View on Map
                </a>
              </div>
              
              <div className="location-card">
                <h4>UNIT - 2</h4>
                <p>
                  UNIT - 2<br />
                  158/2,Shed No 9,Maharudreshwara Nagara,<br />
                  Kempapura Main Road,<br/>
                  Chikkabanavara Post Banglore,
                  Karnataka 560090 
                </p>
                <a 
                  href="https://maps.google.com/?q=Aruna+Enterprises+Unit+2+Bangalore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <h3>Contact Details</h3>
            <ul className="contact-details">
              <li>
                <strong>Phone:</strong> +91 9538033119
              </li>
              <li>
                <strong>Email:</strong> info@arunaenterprises.com
              </li>
              <li>
                <strong>WhatsApp:</strong> +91 9538033119
                <a 
                  href="https://wa.me/9538033119" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  <FaWhatsapp /> Chat Now
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="map-section">
          <h2>Find Us On Map</h2>
          <div className="map-container">
            <div className="map-iframe">
              <h4>Unit 1</h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d313.45830577488255!2d77.52763724424513!3d13.076125922781513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae232b292fda39%3A0x19ef89c94a560108!2sAruna%20Enterprises!5e0!3m2!1sen!2sin!4v1746253045657!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                title="Aruna Enterprises Unit 1"
              ></iframe>
            </div>
            <div className="map-iframe">
              <h4>Unit 2</h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1145593874594!2d77.50260717687732!3d13.09192546415105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae230048f2f4c7%3A0x54cdcae335d40859!2sAruna%20enterprises%20unit%202!5e0!3m2!1sen!2sin!4v1746253388860!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                title="Aruna Enterprises Unit 2"
              ></iframe>
            </div>
          </div>
        </section>

        <section id="contactus" className="contact-form-section">
          <div className="form-header">
            <div className="form-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you soon</p>
          </div>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
              ></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactForm;