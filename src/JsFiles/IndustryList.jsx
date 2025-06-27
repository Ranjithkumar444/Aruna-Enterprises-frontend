import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryList = () => {
  const [industriesBySector, setIndustriesBySector] = useState({});

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/public/getAllIndustry");
        const industries = response.data;

        const groupedBySector = industries.reduce((acc, industry) => {
          const { sector } = industry;
          if (!acc[sector]) {
            acc[sector] = [];
          }
          acc[sector].push(industry);
          return acc;
        }, {});

        setIndustriesBySector(groupedBySector);
      } catch (error) {
        console.error("Error fetching industry list:", error);
        alert("Failed to load industries.");
      }
    };

    fetchIndustries();
  }, []);

  const sectors = Object.keys(industriesBySector);
  const duplicatedSectors = [...sectors, ...sectors]; 

  return (
    <div className="relative max-w-screen-xl mx-auto p-6 sm:p-10 md:p-16 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 to-white opacity-60 z-0"></div>

      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-12 relative z-10">
        <span className="relative inline-block pb-3">
          Industrial Sectors We Serve
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse-light"></span>
        </span>
      </h2>

      
      <div className="overflow-hidden w-full py-6 relative z-10">
        <div className="flex w-max animate-scroll-left will-change-transform">
          {duplicatedSectors.map((sector, index) => (
            <div
              key={index}
              className="min-w-[240px] md:min-w-[280px] mr-8 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 p-7 rounded-2xl shadow-lg text-xl font-semibold text-blue-800 text-center transition-all duration-300 relative z-10 border border-blue-200 cursor-pointer
              hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:from-blue-200 hover:to-purple-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-2xl -z-10"></div>
              {sector}
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex flex-wrap gap-4 md:gap-5 justify-center mt-16 relative z-10">
        {sectors.map((sector, index) => (
          <div
            key={index}
            className="group relative bg-white border border-gray-200 rounded-full px-7 py-3 text-base font-medium text-gray-800 shadow-sm transition-all duration-300 transform-gpu cursor-pointer
            hover:shadow-lg hover:border-blue-300 hover:scale-[1.03]"
          >
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <span className="relative z-10 group-hover:text-blue-800 transition-colors duration-300">
              {sector}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryList;