import React from "react";
import { useLocation } from "react-router-dom";

const SectorDetails = () => {
  const location = useLocation();
  const { boxes } = location.state || { boxes: [] };

  if (boxes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 p-6">
        <p className="text-xl font-medium text-gray-600 bg-white p-6 rounded-lg shadow-md">
          No box details available for this sector.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-12 drop-shadow-md">
          {boxes[0]?.boxSector} Boxes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boxes.map((box, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="w-full h-64 overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={box.url}
                  alt={box.heading}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{box.heading}</h3>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Capacity:</strong> {box.capacity}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">No of Ply:</strong> {box.noOfPly}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Shape:</strong> {box.shape}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Printing Type:</strong> {box.printingType}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Application:</strong> {box.application}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Paper Grade:</strong> {box.paperGrade}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">GSM:</strong> {box.gsm}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Color:</strong> {box.color}
                </p>
                <p className="text-gray-700 text-base">
                  <strong className="font-semibold text-gray-800">Properties:</strong> {box.property}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorDetails;