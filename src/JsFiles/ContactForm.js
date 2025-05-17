import React ,{ useState }from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const contactInfo = {
      name,
      phone,
      email,
      message,
    };

    try {
      const response = await axios.post('http://localhost:8080/public/contact-details', contactInfo);

      console.log('Response:', response.data);
      alert(response.data);
    } catch (error) {
      
      console.error('Error:', error.response ? error.response.data : error.message);
      alert(response.data);
    }
  };

  return (
    <div className="contact-page-container" style={contactPageStyle}>
      <section style={sectionStyle}>
        <h2 className="our-location" style={{...headingStyle, ':after': headingAfterStyle}}>Our Locations</h2>

        <div style={locationContainerStyle}>
          <div style={locationBoxStyle}>
            <h3 className="ae-unit1" style={locationTitleStyle}>Aruna Enterprises (Unit 1)</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d313.45830577488255!2d77.52763724424513!3d13.076125922781513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae232b292fda39%3A0x19ef89c94a560108!2sAruna%20Enterprises!5e0!3m2!1sen!2sin!4v1746253045657!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '6px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aruna Enterprises Unit 1"
            ></iframe>
          </div>

          <div style={locationBoxStyle}>
            <h3 className="ae-unit2" style={locationTitleStyle}>Aruna Enterprises (Unit 2)</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1145593874594!2d77.50260717687732!3d13.09192546415105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae230048f2f4c7%3A0x54cdcae335d40859!2sAruna%20enterprises%20unit%202!5e0!3m2!1sen!2sin!4v1746253388860!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '6px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aruna Enterprises Unit 2"
            ></iframe>
          </div>
        </div>
      </section>

      <div className="address-icon" style={addressIconStyle}>
        <FaHome style={iconStyle} />
        <p style={addressTitleStyle}>Address</p>
      </div>

      <div className="add-box" style={addressBoxStyle}>
        <div className="add-1" style={addressStyle}>
          <div>
            <h3>UNIT - 1</h3>
          </div>
          Last Bus Stop,<br />
          Sy. No. 10/1,<br />
          7th Cross,<br />
          B.T Krishnappa Layout<br />
          Near Abbigere, Post,<br />
          Chikkabanavara,<br />
          Bengaluru,<br />
          Karnataka 560090
        </div>

        <div className="add-2" style={addressStyle}>
          <div>
            <h3>UNIT - 2</h3>
          </div>
          3GR2+RX8,<br />
          Bengaluru,<br />
          Karnataka 560090
        </div>
      </div>

      <div className="contact-form-wrapper" style={formWrapperStyle}>
        <h2 className="form-title" style={formTitleStyle}>
          <FontAwesomeIcon icon={faEnvelope} style={formIconStyle} />
          Contact Form
        </h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="form-input"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone*"
            className="form-input"
            style={inputStyle}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email*"
            className="form-input"
            style={inputStyle}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Message"
            className="form-textarea"
            style={textareaStyle}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit" className="submit-button" style={buttonStyle}>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
  };

  const contactPageStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333'
  };
  
  const sectionStyle = {
    marginBottom: '60px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const headingStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#4a2c82',
    fontSize: '2.2rem',
    fontWeight: '600',
    position: 'relative',
    paddingBottom: '15px'
  };
  
  const headingAfterStyle = {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(to right, #8e44ad,rgb(119, 179, 219))',
    borderRadius: '2px'
  };
  
  const locationContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between'
  };
  
  const locationBoxStyle = {
    flex: '1 1 48%',
    minWidth: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };
  
  const locationTitleStyle = {
    marginLeft: '430px',
    marginBottom: '15px',
    color: '#4a2c82',
    fontSize: '1.3rem',
    fontWeight: '500'
  };
  
  const addressIconStyle = {
    textAlign: 'center',
    margin: '40px 0 20px',
    position: 'relative'
  };
  
  const iconStyle = {
    fontSize: '30px',
    color: 'white',
    width: '90px',
    height: '90px',
    margin: '0 auto',
    borderRadius: '50px',
    background: 'linear-gradient(135deg,rgb(83, 158, 211),rgb(164, 112, 227))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };
  
  const addressTitleStyle = {
    fontSize: '25px',
    fontFamily: 'sans-serif',
    color: '#4a2c82',
    fontWeight: '600',
    marginTop: '15px'
  };
  
  const addressBoxStyle = {
    display: 'flex',
    gap: '20px',
    margin: '30px 0',
    justifyContent: 'center'
  };
  
  const addressStyle = {
    flex: '0 1 auto',      
    lineHeight: '1.6',
    maxWidth: '400px',
    minWidth: '300px',     
    backgroundColor: '#f2e6ff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #8e44ad',
    textAlign: 'center',    
    margin: '0 auto'      
  };
  
  const formWrapperStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
  };
  
  const formTitleStyle = {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4a2c82',
    fontSize: '1.8rem',
    fontWeight: '600'
  };
  
  const formIconStyle = {
    marginRight: '15px',
    color: '#8e44ad'
  };
  
  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "#f9f9f9",
    ":focus": {
      borderColor: "#8e44ad",
      boxShadow: "0 0 0 2px rgba(142, 68, 173, 0.2)",
      outline: "none",
      backgroundColor: "white"
    }
  };
  
  const textareaStyle = {
    ...inputStyle,
    height: "150px",
    resize: "vertical"
  };
  
  const buttonStyle = {
    padding: "14px 25px",
    backgroundColor: "#8e44ad",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    width: "100%",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    ":hover": {
      backgroundColor: "#732d91",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
    },
    ":active": {
      transform: "translateY(0)"
    }
  };
  
  export default ContactForm;
  