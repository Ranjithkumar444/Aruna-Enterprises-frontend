import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientOrderForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client: "",
    product: "",
    productType: "",
    size: "",
    ply: "",
    deckle: "",
    cuttingLength: "",
    topGsm: "",
    linerGsm: "",
    fluteGsm: "",
    madeUpOf: "",
    paperTypeTop: "",
    paperTypeBottom: "",
    paperTypeFlute: "",
    oneUps: "",
    twoUps: "",
    threeUps: "",
    fourUps: "",
    description: "",
    sellingPricePerBox: "",
    productionCostPerBox: "",
  });

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (
    name === "size" &&
    value &&
    !/^\d{1,4}(X\d{1,4}){0,2}$/.test(value.toUpperCase())
  ) {
    return;
  }

  setFormData({
    ...formData,
    [name]: name === "size" ? value.toUpperCase() : value,
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("https://arunaenterprises.azurewebsites.net/admin/client/order/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      alert("Client order created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 shadow-xl rounded-xl mt-10 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">Create Client Order</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["client", "Client Name"],
          ["product", "Product Name"],
          ["productType", "Product Type (Corrugated / Punching)"],
          ["size", "Size (e.g., 321X373X193)"],
          ["ply", "Ply"],
          ["deckle", "Deckle"],
          ["cuttingLength", "Cutting Length"],
          ["topGsm", "Top GSM"],
          ["linerGsm", "Liner GSM"],
          ["fluteGsm", "Flute GSM"],
          ["madeUpOf", "Made Up Of (Ups/Piece)"],
          ["paperTypeTop", "Paper Type Top"],
          ["paperTypeBottom", "Paper Type Bottom"],
          ["paperTypeFlute" , "Paper Type Flute"],
          ["oneUps", "1 Ups"],
          ["twoUps", "2 Ups"],
          ["threeUps", "3 Ups"],
          ["fourUps", "4 Ups"],
          ["description", "Description"],
          ["sellingPricePerBox", "Selling Price per Box"],
          ["productionCostPerBox", "Production Cost per Box"],
        ].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              required
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientOrderForm;
