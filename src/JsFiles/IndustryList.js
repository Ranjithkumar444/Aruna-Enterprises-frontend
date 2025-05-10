import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryList = () => {
  const [industriesBySector, setIndustriesBySector] = useState({});

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/public/getAllIndustry");
        const industries = response.data;

        // Group industries by sector
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
      <h2 className="industry-heading">Industries We Serve</h2>

      <div className="sectors-container">
        {/* Loop through each sector and display industries */}
        {Object.entries(industriesBySector).map(([sector, industries]) => (
          <div key={sector} className="sector-column">
            <h3 className="sector-heading">{sector}</h3>
            <ul className="industry-list">
              {industries.map((industry) => (
                <li key={industry.id} className="industry-item">
                  {/* Display the industry image */}
                  {industry.industryImage && (
                    <img
                      src={`data:image/jpeg;base64,${industry.industryImage}`}
                      alt={industry.industryName}
                      className="industry-image"
                    />
                  )}
                  <p className="industry-name">{industry.industryName}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryList;
