import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CssFiles/ReelStockTable.css";

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

        console.log(response);

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
        r.barcodeId.toLowerCase().includes(search.barcodeId.toLowerCase())
      );
    }

    if (search.supplierName) {
      result = result.filter((r) =>
        r.supplierName.toLowerCase().includes(search.supplierName.toLowerCase())
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) result = result.filter((r) => r[key]?.toString() === value);
    });

    setFilteredReels(result);
  };

  if (loading) return <p>Loading reels...</p>;

  const getUniqueValues = (key) => [...new Set(reels.map((r) => r[key]?.toString()).filter(Boolean))];

  return (
    <div className="reel-container">
      <h2 className="reel-title">Reel Stock Information</h2>

      <div className="search-filter-section">
        <input
          type="text"
          name="barcodeId"
          value={search.barcodeId}
          onChange={handleSearchChange}
          placeholder="Search by Barcode ID"
        />
        <input
          type="text"
          name="supplierName"
          value={search.supplierName}
          onChange={handleSearchChange}
          placeholder="Search by Supplier Name"
        />

        <select name="status" onChange={handleFilterChange} value={filters.status}>
          <option value="">All Status</option>
          {getUniqueValues("status").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="gsm" onChange={handleFilterChange} value={filters.gsm}>
          <option value="">All GSM</option>
          {getUniqueValues("gsm").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="burstFactor" onChange={handleFilterChange} value={filters.burstFactor}>
          <option value="">All BF</option>
          {getUniqueValues("burstFactor").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="deckle" onChange={handleFilterChange} value={filters.deckle}>
          <option value="">All Deckle</option>
          {getUniqueValues("deckle").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="unit" onChange={handleFilterChange} value={filters.unit}>
          <option value="">All Units</option>
          {getUniqueValues("unit").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="paperType" onChange={handleFilterChange} value={filters.paperType}>
          <option value="">All Paper Types</option>
          {getUniqueValues("paperType").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="table-wrapper">
        <table className="reel-table">
          <thead>
            <tr>
              <th>Barcode ID</th>
              <th>Reel No</th>
              <th>GSM</th>
              <th>BF</th>
              <th>Deckle</th>
              <th>Initial Weight</th>
              <th>Current Weight</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Paper Type</th>
              <th>Supplier Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredReels.map((reel) => (
              <tr key={reel.id}>
                <td>{reel.barcodeId}</td>
                <td>{reel.reelNo}</td>
                <td>{reel.gsm}</td>
                <td>{reel.burstFactor}</td>
                <td>{reel.deckle}</td>
                <td>{reel.initialWeight} Kg</td>
                <td>{reel.currentWeight} Kg</td>
                <td>{reel.unit}</td>
                <td>
                  <span
                    className={`status ${
                      reel.status === "IN_USE" ? "in-use" : "not-in-use"
                    }`}
                  >
                    {reel.status}
                  </span>
                </td>
                <td>{reel.paperType}</td>
                <td>{reel.supplierName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReelsInStock;
