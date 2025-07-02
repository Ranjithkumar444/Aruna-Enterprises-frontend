import React, { useEffect, useState } from "react";

const LatestSuggestedReels = () => {
  const [data, setData] = useState(null);
  const [unitFilter, setUnitFilter] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lastSuggestedReels");
    if (stored) {
      const parsed = JSON.parse(stored);
      const createdAt = new Date(parsed.timestamp || parsed.createdAt || Date.now());
      const now = new Date();

      const diffHours = Math.abs(now - createdAt) / 36e5;
      if (diffHours <= 24) {
        setData(parsed);
      } else {
        localStorage.removeItem("lastSuggestedReels");
      }
    }
  }, []);

  if (!data) return null;

  const { response, client, size, typeOfProduct, productType } = data;

  const filterReels = (reels) =>
    unitFilter === "All" ? reels : reels.filter((r) => r.unit === unitFilter);

  const renderReels = (title, reels) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterReels(reels).length > 0 ? (
            filterReels(reels).map((reel, index) => (
            <div
                key={index}
                className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 transition-all duration-300 ease-in-out hover:shadow-xl hover:border-blue-300"
            >
                <p className="text-lg font-semibold text-blue-600 mb-2">Barcode: <span className="font-normal text-gray-800">{reel.barcodeId}</span></p>
                <p className="text-sm text-gray-700"><strong>Reel No:</strong> {reel.reelNo}</p>
                <p className="text-sm text-gray-700"><strong>Unit:</strong> {reel.unit}</p>
                <p className="text-sm text-gray-700"><strong>GSM:</strong> {reel.gsm}</p> {/* Added GSM */}
                <p className="text-sm text-gray-700"><strong>Deckle:</strong> {reel.deckle}</p> {/* Added Deckle */}
                <p className="text-sm text-gray-700"><strong>Cutting Length:</strong> {reel.cuttingLength}</p>
                <p className="text-sm text-gray-700"><strong>Current Weight:</strong> <span className="font-medium text-green-700">{reel.currentWeight} kg</span></p>
                <p className="text-sm text-gray-700"><strong>Status:</strong> <span className={`font-semibold ${reel.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{reel.status}</span></p>
            </div>
            ))
        ) : (
            <p className="text-gray-500 italic col-span-full text-center py-4">No reels for the selected unit in this category.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
      <div className="text-center text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
        <h2 >Suggested Reels For Orders</h2>
      </div >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Suggested Reels <span className="text-base font-normal text-gray-500">(within 24 Hours)</span>
          </h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Client:</span> {client} | <span className="font-medium text-gray-800">Size:</span> {size} |{" "}
            <span className="font-medium text-gray-800">Product Type:</span> {typeOfProduct} | <span className="font-medium text-gray-800">Ply:</span>{" "}
            {productType}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-base px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out shadow-md"
        >
          {isExpanded ? "Hide Details ▼" : "Show Details ▲"}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="flex justify-end mb-6">
            <div className="relative">
                <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-base"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                >
                <option value="All">All Units</option>
                <option value="A">Unit A</option>
                <option value="B">Unit B</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          {renderReels("Top GSM Reels", response.topGsmReels)}
          {renderReels("Bottom GSM Reels", response.bottomGsmReels)}
        </>
      )}
    </div>
  );
};

export default LatestSuggestedReels;