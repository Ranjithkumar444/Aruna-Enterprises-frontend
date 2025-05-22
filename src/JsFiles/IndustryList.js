import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryList = () => {
  const [industriesBySector, setIndustriesBySector] = useState({});

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/public/getAllIndustry`);
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

  return (
    <div className="industry-container">
      <h2 className="industry-heading">Industrial Sectors We Serve</h2>

      <div className="sectors-container">
        {Object.keys(industriesBySector).map((sector, index) => (
          <div key={index} className="sector-card">
            {sector}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryList;

