import React, { useEffect, useState } from 'react';
import "../CssFiles/IndustryWeServe.css"

const IndustryWeServe = () => {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/public/getAllIndustry`)
      .then((response) => response.json())
      .then((data) => setIndustries(data))
      .catch((error) => console.error('Error fetching industries:', error));
  }, []);

  return (
    <div className="industry-container">
      <h2 className="industry-title">Industries We Serve</h2>

      <p className="industry-description">
        At Aruna Enterprises Corrugation Box Factory, we take pride in being a trusted packaging partner across a wide range of industries. From manufacturing and textiles to food processing and logistics, our corrugated solutions are designed to meet the unique demands of every sector. We believe that quality packaging not only protects a product but also reflects the value behind it. With a strong commitment to durability, sustainability, and precision, we ensure every box we craft becomes a symbol of trust, strength, and excellence. Our mission is simple — to empower businesses by delivering packaging that performs as reliably as the products it carries.
      </p>

      <div className="industry-grid">
        {industries.map((industry) => (
          <div key={industry.id} className="industry-card">
            <img src={industry.url} alt={industry.industryName} className="industry-image" />
            <div className="industry-info">
              
              <p className="industry-sector">{industry.sector}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryWeServe;
