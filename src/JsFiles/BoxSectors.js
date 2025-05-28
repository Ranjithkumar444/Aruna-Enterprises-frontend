import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssFiles/BoxSectors.css";

const BoxSectors = () => {
  const [boxData, setBoxData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/public/box/getBoxDetails")
      .then((response) => {
        setBoxData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching box data:", error);
      });
  }, []);

  const uniqueSectors = Array.from(
    new Map(boxData.map((box) => [box.boxSector, box])).values()
  );

  const handleSectorClick = (sector) => {
    navigate(`/sector/${encodeURIComponent(sector)}`, {
      state: { boxes: boxData.filter(box => box.boxSector === sector) }
    });
  };

  return (
    <div className="container">
      <h2 className="heading">Box Sectors</h2>

      <div className="sector-grid">
        {uniqueSectors.map((box) => (
          <div
            key={box.boxSector}
            className="sector-card"
            onClick={() => handleSectorClick(box.boxSector)}
          >
            <img src={box.url} alt={box.boxSector} className="sector-img" />
            <h3 className="sector-name">{box.boxSector}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxSectors;