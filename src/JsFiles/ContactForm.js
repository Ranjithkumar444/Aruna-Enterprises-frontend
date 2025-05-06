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
      alert('Contact info submitted successfully');
    } catch (error) {
      
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('There was an error submitting your contact info');
    }
  };

  return (
    <div className="contact-page-container" style={{ padding: '2rem' }}>
      <section style={{ marginBottom: '60px' }}>
        <h2 className="our-location" style={{ textAlign: 'center', marginBottom: '30px' }}>Our Locations</h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: '1 1 48%' }}>
            <h3 className="ae-unit1" style={{ marginBottom: '10px' }}>Aruna Enterprises (Unit 1)</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d313.45830577488255!2d77.52763724424513!3d13.076125922781513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae232b292fda39%3A0x19ef89c94a560108!2sAruna%20Enterprises!5e0!3m2!1sen!2sin!4v1746253045657!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aruna Enterprises Unit 1"
            ></iframe>
          </div>

          <div style={{ flex: '1 1 48%' }}>
            <h3 className="ae-unit2" style={{ marginBottom: '10px' }}>Aruna Enterprises (Unit 2)</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1145593874594!2d77.50260717687732!3d13.09192546415105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae230048f2f4c7%3A0x54cdcae335d40859!2sAruna%20enterprises%20unit%202!5e0!3m2!1sen!2sin!4v1746253388860!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aruna Enterprises Unit 2"
            ></iframe>
          </div>
        </div>
      </section>

      <div className="address-icon">
        <FaHome
          style={{
            fontSize: '24px',
            color: 'purple',
            width: '70px',
            height: '70px',
            marginLeft: '650px',
            marginTop: '30px',
            borderRadius: '40px',
          }}
        />
        <p
          style={{
            marginLeft: '650px',
            fontSize: '25px',
            fontFamily: 'sans-serif',
            color: 'purple',
          }}
        >
          Address
        </p>
      </div>

      <div className="add-box" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div className="add-1" style={{ flex: 1, lineHeight: '1.6' }}>
          Last Bus Stop,<br />
          Sy. No. 10/1,<br />
          7th Cross,<br />
          B.T Krishnappa Layout<br />
          Near Abbigere, Post,<br />
          Chikkabanavara,<br />
          Bengaluru,<br />
          Karnataka 560090
        </div>

        <div className="add-2" style={{ flex: 1, lineHeight: '1.6' }}>
          3GR2+RX8,<br />
          Bengaluru,<br />
          Karnataka 560090
        </div>
      </div>

      <div className="contact-form-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="form-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
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
  
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };
  
  const textareaStyle = {
    ...inputStyle,
    height: "120px",
    resize: "vertical",
  };
  
  const buttonStyle = {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };
  
  export default ContactForm;
  