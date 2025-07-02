import React, { useEffect, useState } from 'react';

const IndustryWeServe = () => {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetch("https://arunaenterprises.azurewebsites.net/public/getAllIndustry")
      .then((response) => response.json())
      .then((data) => setIndustries(data))
      .catch((error) => console.error('Error fetching industries:', error));
  }, []);

  return (
    <div className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Industries We Serve</h2>

        <p className="text-center text-gray-600 text-lg max-w-4xl mx-auto mb-12 leading-relaxed">
          At Aruna Enterprises Corrugation Box Factory, we take pride in being a trusted packaging partner across a wide range of industries. From manufacturing and textiles to food processing and logistics, our corrugated solutions are designed to meet the unique demands of every sector. We believe that quality packaging not only protects a product but also reflects the value behind it. With a strong commitment to durability, sustainability, and precision, we ensure every box we craft becomes a symbol of trust, strength, and excellence. Our mission is simple — to empower businesses by delivering packaging that performs as reliably as the products it carries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group transform hover:-translate-y-1"
            >
              <img
                src={industry.url}
                alt={industry.industryName}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4">
                <p className="text-center text-gray-700 font-semibold text-lg">{industry.sector}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryWeServe;
