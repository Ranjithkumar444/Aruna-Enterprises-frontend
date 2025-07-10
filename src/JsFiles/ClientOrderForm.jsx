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

    if (name === "size") {
      const upperValue = value.toUpperCase();
      const validWhileTyping = /^(\d{0,4})(X\d{0,4}){0,2}$/.test(upperValue);
      if (!validWhileTyping) return;

      setFormData({
        ...formData,
        [name]: upperValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sizePattern = /^\d{1,4}X\d{1,4}(X\d{1,4})?$/;
    if (!sizePattern.test(formData.size)) {
      alert("Size must be in format like 420X520 or 420X520X620");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "https://arunaenterprises.azurewebsites.net/admin/client/order/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          ["client", "Client Name", true],
          ["product", "Product Name", true],
          ["productType", "Product Type (Corrugated / Punching)", true],
          ["size", "Size (e.g., 420X520 or 420X520X620)", true],
          ["ply", "Ply", true],
          ["deckle", "Deckle", true],
          ["cuttingLength", "Cutting Length", true],
          ["topGsm", "Top GSM", true],
          ["linerGsm", "Liner GSM", true],
          ["fluteGsm", "Flute GSM", true],
          ["madeUpOf", "Made Up Of (Ups/Piece)", true],
          ["paperTypeTop", "Paper Type Top", true],
          ["paperTypeBottom", "Paper Type Bottom", true],
          ["paperTypeFlute", "Paper Type Flute", true],
          ["oneUps", "1 Ups", false],
          ["twoUps", "2 Ups", false],
          ["threeUps", "3 Ups", false],
          ["fourUps", "4 Ups", false],
          ["description", "Description", true],
          ["sellingPricePerBox", "Selling Price per Box", true],
          ["productionCostPerBox", "Production Cost per Box", true],
        ].map(([name, label, required]) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
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
