import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CssFiles/IndustryList.css";

const IndustryList = () => {
  const [industriesBySector, setIndustriesBySector] = useState({});

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/public/getAllIndustry`);
        const industries = response.data;

        console.log(response)

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
    <div className="industry-container">
      <h2 className="industry-heading">Industrial Sectors We Serve</h2>
      <div className="slider-wrapper">
        <div className="sliding-track">
          {duplicatedSectors.map((sector, index) => (
            <div key={index} className="sector-card">
              {sector}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryList;
