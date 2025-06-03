import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CssFiles/BoxGallery.css";

const BoxGallery = () => {
  const [boxes, setBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchBoxDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:8080/public/box/getAllBoxDetails');
      setBoxes(response.data);
      setFilteredBoxes(response.data);
    } catch (error) {
      console.error('Error fetching box details:', error);
    }
  };

  useEffect(() => {
    fetchBoxDetails();
  }, []);

  const handleFilterChange = (type) => {
    setActiveFilter(type);
    if (type === 'All') {
      setFilteredBoxes(boxes);
    } else {
      setFilteredBoxes(boxes.filter((box) => box.boxType === type));
    }
  };

  return (
    <div className="manufacturing-gallery-container">
      <h2 className="manufacturing-gallery-title">A Glimpse into Our Manufacturing Brilliance</h2>

      <div className="manufacturing-filter-buttons">
        {['All', 'Punching', 'RSC'].map((type) => (
          <button
            key={type}
            className={`manufacturing-filter-btn ${activeFilter === type ? 'manufacturing-active' : ''}`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="manufacturing-box-grid">
        {filteredBoxes.map((box, index) => (
          <div className="manufacturing-box-card" key={index}>
            <img src={box.boxUrl} alt={box.boxType} className="manufacturing-box-img" />
            <div className="manufacturing-overlay">
              <div className="manufacturing-overlay-content">
                <h4>{box.box}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxGallery;