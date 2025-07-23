import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PunchingClientOrderForm = ({ onSuccess, clientData = null, isEditMode = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client: "",
    product: "",
    size: "",
    ply: "",
    cuttingLength: "",
    deckle: "",
    topGsm: "",
    linerGsm: "",
    fluteGsm: "",
    bottomGsm: "",
    madeUpOf: "",
    paperTypeTop: "",
    paperTypeBottom: "",
    paperTypeFlute: "",
    description: "",
    sellingPricePerBox: "",
    productionCostPerBox: ""
  });

  useEffect(() => {
    if (isEditMode && clientData) {
      setFormData({ ...clientData });
    }
  }, [isEditMode, clientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "size" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const payload = {
      ...formData,
      cuttingLength: parseFloat(formData.cuttingLength),
      deckle: parseFloat(formData.deckle),
      topGsm: parseInt(formData.topGsm),
      linerGsm: parseInt(formData.linerGsm),
      fluteGsm: parseInt(formData.fluteGsm),
      bottomGsm: parseInt(formData.bottomGsm),
      sellingPricePerBox: parseFloat(formData.sellingPricePerBox),
      productionCostPerBox: parseFloat(formData.productionCostPerBox),
    };

    try {
      if (isEditMode) {
        await axios.put(
          `https://arunaenterprises.azurewebsites.net/admin/client/punching/order/update/${clientData.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Punching Client updated successfully!");
      } else {
        await axios.post(
          "https://arunaenterprises.azurewebsites.net/admin/client/punching/order/create",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Punching Client created successfully!");
      }

      onSuccess();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to submit punching client.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 shadow-xl rounded-xl bg-white">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">
        {isEditMode ? "Edit Punching Client Order" : "Create Punching Client Order"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["client", "Client Name"],
          ["product", "Product Name"],
          ["size", "Size (e.g., 321X373)"],
          ["ply", "Ply (e.g., 3-PLY)"],
          ["deckle", "Deckle"],
          ["cuttingLength", "Cutting Length"],
          ["topGsm", "Top GSM"],
          ["linerGsm", "Liner GSM"],
          ["fluteGsm", "Flute GSM"],
          ["bottomGsm", "Bottom GSM"],
          ["madeUpOf", "Made Up Of (e.g., UPS/Piece)"],
          ["paperTypeTop", "Paper Type Top"],
          ["paperTypeBottom", "Paper Type Bottom"],
          ["paperTypeFlute", "Paper Type Flute"],
          ["description", "Description"],
          ["sellingPricePerBox", "Selling Price per Box"],
          ["productionCostPerBox", "Production Cost per Box"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              required
              type={["deckle", "cuttingLength", "topGsm", "linerGsm", "fluteGsm", "bottomGsm", "sellingPricePerBox", "productionCostPerBox"].includes(name) ? "number" : "text"}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              step="0.01"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all">
            {isEditMode ? "Update Punching Order" : "Submit Punching Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PunchingClientOrderForm;
