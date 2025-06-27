import React from "react";

const Solution = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 relative after:content-[''] after:block after:mx-auto after:mt-4 after:w-24 after:h-[3px] after:bg-green-600">
        Our Solutions
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300">
          <img
            src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/boxStockImage.jpg?raw=true"
            alt="Quality"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Top-notch Quality
          </h2>
          <p className="text-gray-600 text-sm">
            Our offerings are recognized for their stiffness, maximum strength, longer life, heavy load-bearing capacity, dimensional accuracy, high tear strength and other superior qualities.
          </p>
        </div>

        
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt="Craftsmanship"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Crafted to perfection
          </h2>
          <p className="text-gray-600 text-sm">
            Products are being made carefully with exceptional skills, attention to details, and precision that it reaches the highest possible standards over 2 decades.
          </p>
        </div>

        
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt="Planning"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Visionary Planning
          </h2>
          <p className="text-gray-600 text-sm">
            To redefine packaging excellence through visionary planning, eco-conscious design, and customer-first innovation.
          </p>
        </div>

        
        <div className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300">
          <img
            src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/pexels-photo-414837.jpeg?raw=true"
            alt="Eco-Friendly Commitment"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Eco-Friendly Commitment
          </h2>
          <p className="text-gray-600 text-sm">
            Committed to sustainable packaging that protects both your product and the planet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Solution;
