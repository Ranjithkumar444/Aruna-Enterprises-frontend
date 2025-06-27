import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BoxGallery = () => {
  const [boxes, setBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchBoxDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get("https://arunaenterprises.azurewebsites.net/public/box/getAllBoxDetails");
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
    <div className="py-16 px-5 bg-gray-50 max-w-screen-xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-10 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[2px] after:bg-gray-300">
        A Glimpse into Our Manufacturing Brilliance
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['All', 'Punching', 'RSC'].map((type) => (
          <button
            key={type}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition duration-300 ${
              activeFilter === type
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBoxes.map((box, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <img
              src={box.boxUrl}
              alt={box.boxType}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-center transition-opacity duration-300 p-4">
              <h4 className="text-lg font-medium">{box.box}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxGallery;