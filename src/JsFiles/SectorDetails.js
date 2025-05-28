import React from "react";
import { useLocation } from "react-router-dom";
import "../CssFiles/SectorDetails.css";

const SectorDetails = () => {
  const location = useLocation();
  const { boxes } = location.state || { boxes: [] };

  if (boxes.length === 0) {
    return <p>No box details available.</p>;
  }

  return (
    <div className="sector-details-container">
      <h2 className="sector-title">{boxes[0]?.boxSector}</h2>

      <div className="boxes-grid">
        {boxes.map((box, index) => (
          <div key={index} className="box-detail-wrapper">
            <div className="image-section">
              <img src={box.url} alt={box.heading} className="box-image" />
            </div>

            <div className="info-section">
              <h3>{box.heading}</h3>
              <p><strong>Capacity:</strong> {box.capacity}</p>
              <p><strong>No of Ply:</strong> {box.noOfPly}</p>
              <p><strong>Shape:</strong> {box.shape}</p>
              <p><strong>Printing Type:</strong> {box.printingType}</p>
              <p><strong>Application:</strong> {box.application}</p>
              <p><strong>Paper Grade:</strong> {box.paperGrade}</p>
              <p><strong>GSM:</strong> {box.gsm}</p>
              <p><strong>Color:</strong> {box.color}</p>
              <p><strong>Properties:</strong> {box.property}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorDetails;