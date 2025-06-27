import React, { useEffect, useState } from "react";
import axios from "axios";

const ReelsInStock = () => {
  const [reels, setReels] = useState([]);
  const [filteredReels, setFilteredReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ barcodeId: "", supplierName: "" });
  const [filters, setFilters] = useState({
    status: "",
    gsm: "",
    burstFactor: "",
    deckle: "",
    unit: "",
    paperType: "",
    createdDate: ""
  });

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await axios.get(
          "https://arunaenterprises.azurewebsites.net/admin/inventory/getReelStocks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sorted = response.data.sort((a, b) => {
          if (a.status === "IN_USE" && b.status !== "IN_USE") return -1;
          if (a.status !== "IN_USE" && b.status === "IN_USE") return 1;
          return 0;
        });

        setReels(sorted);
        setFilteredReels(sorted);
      } catch (error) {
        console.error("Error fetching reel stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  useEffect(() => {
    
    applyFilters();
  }, [search, filters, reels]); 

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let result = [...reels];

    if (search.barcodeId) {
      result = result.filter((r) =>
        r.barcodeId?.toLowerCase().includes(search.barcodeId.toLowerCase())
      );
    }

    if (search.supplierName) {
      result = result.filter((r) =>
        r.supplierName?.toLowerCase().includes(search.supplierName.toLowerCase())
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === "createdDate") {
          
          result = result.filter((r) =>
            r.createdAt?.startsWith(value)
          );
        } else if (key === "status") {
            result = result.filter((r) => r.status?.toLowerCase() === value.toLowerCase());
        }
        else {
          result = result.filter((r) => r[key]?.toString() === value);
        }
      }
    });

    setFilteredReels(result);
  };

  
  const totalCurrentWeight = filteredReels.reduce((sum, reel) => sum + reel.currentWeight, 0).toFixed(2); 
  const reelCount = filteredReels.length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <p className="text-xl font-semibold text-gray-700">Loading reels...</p>
    </div>
  );

  const getUniqueValues = (key) => [...new Set(reels.map((r) => r[key]?.toString()).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-10 font-sans">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight md:text-5xl">
        Reel Stock Information
      </h2>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Total Reels</h3>
          <p className="text-5xl font-extrabold text-blue-600">{reelCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Total Current Weight</h3>
          <p className="text-5xl font-extrabold text-green-600">{totalCurrentWeight} <span className="text-3xl">Kg</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-10 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b-2 border-blue-200">Search & Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <input
            type="text"
            name="barcodeId"
            value={search.barcodeId}
            onChange={handleSearchChange}
            placeholder="Search by Barcode ID"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm"
          />
          <input
            type="text"
            name="supplierName"
            value={search.supplierName}
            onChange={handleSearchChange}
            placeholder="Search by Supplier Name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm"
          />

          <input
            type="date"
            name="createdDate"
            value={filters.createdDate}
            onChange={handleFilterChange}
            placeholder="Filter by Created Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm"
          />

          <select name="status" onChange={handleFilterChange} value={filters.status}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All Status</option>
            {getUniqueValues("status").map((val) => (
              <option key={val} value={val}>{val.replace(/_/g, ' ')}</option> 
            ))}
          </select>

          <select name="gsm" onChange={handleFilterChange} value={filters.gsm}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All GSM</option>
            {getUniqueValues("gsm").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          <select name="burstFactor" onChange={handleFilterChange} value={filters.burstFactor}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All BF</option>
            {getUniqueValues("burstFactor").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          <select name="deckle" onChange={handleFilterChange} value={filters.deckle}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All Deckle</option>
            {getUniqueValues("deckle").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          <select name="unit" onChange={handleFilterChange} value={filters.unit}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All Units</option>
            {getUniqueValues("unit").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          <select name="paperType" onChange={handleFilterChange} value={filters.paperType}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm bg-white"
          >
            <option value="">All Paper Types</option>
            {getUniqueValues("paperType").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          
          <div className="col-span-full flex justify-center mt-4">
            <button onClick={applyFilters}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Barcode ID</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reel No</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">GSM</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">BF</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Deckle</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Initial Weight</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Current Weight</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prev Weight</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reel Used For</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Paper Type</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supplier Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredReels.length > 0 ? (
              filteredReels.map((reel) => (
                <tr key={reel.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reel.barcodeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.reelNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.gsm}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.burstFactor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.deckle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{reel.initialWeight} Kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-bold">{reel.currentWeight} Kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-semibold">{reel.previousWeight} Kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reel.status === "IN_USE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {reel.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.reelSet || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.paperType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reel.supplierName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="px-6 py-8 text-center text-gray-500 text-base">
                  No matching reels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReelsInStock;