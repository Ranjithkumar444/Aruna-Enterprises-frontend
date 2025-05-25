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
        'http://localhost:8080/admin/box/getAllBoxDetails',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <div className="gallery-container">
      <h2 className="gallery-title">A Glimpse into Our Manufacturing brilliance</h2>

      <div className="filter-buttons">
        {['All', 'Punching', 'RSC'].map((type) => (
          <button
            key={type}
            className={`filter-button ${activeFilter === type ? 'active' : ''}`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="box-grid">
        {filteredBoxes.map((box, index) => (
          <div className="box-card" key={index}>
            <img src={box.boxUrl} alt={box.boxType} className="box-image" />
            <div className="overlay">
              <div className="overlay-text">
                <h4>{box.box}</h4>
                <p>{box.boxDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxGallery;
