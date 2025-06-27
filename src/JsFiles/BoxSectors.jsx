import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const BoxSectors = () => {
  const [boxData, setBoxData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    axios
      .get("https://arunaenterprises.azurewebsites.net/public/box/getBoxDetails")
      .then((response) => {
        setBoxData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching box data:", error);
      });
  }, [location]);

  const uniqueSectors = Array.from(
    new Map(boxData.map((box) => [box.boxSector, box])).values()
  );

  const handleSectorClick = (sector) => {
    navigate(`/sector/${encodeURIComponent(sector)}`, {
      state: { boxes: boxData.filter(box => box.boxSector === sector) }
    });
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-8 lg:px-16">
      <section id="boxsector">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
          Box Sectors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in-up-slow">
          {uniqueSectors.map((box) => (
            <div
              key={box.boxSector}
              onClick={() => handleSectorClick(box.boxSector)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center p-4 border border-gray-100"
            >
              <img
                src={box.url}
                alt={box.boxSector}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 animate-fade-in-scale">
                {box.boxSector}
              </h3>
            </div>
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mt-20 mb-6 animate-fade-in-down">
          HSN Codes
        </h2>

        <div className="flex justify-center animate-fade-in">
          <img
            src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/Hsncode.png?raw=true"
            alt="HSN Codes"
            className="max-w-full md:max-w-2xl rounded-xl shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default BoxSectors;