import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import "../CssFiles/BoxSectors.css";

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
      .get("http://localhost:8080/public/box/getBoxDetails")
      .then((response) => {
        setBoxData(response.data);
        console.log(response);
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
    <div className="container">
      <section id="boxsector">
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
      <h2 className="heading">HSN Codes</h2>
      <div className="box-sector-image">
        
        <img src="https://github.com/Ranjithkumar444/ArunaEnterprisesImage/blob/main/Hsncode.png?raw=true"></img>
      </div>
      </section>
    </div>
  );
};

export default BoxSectors;