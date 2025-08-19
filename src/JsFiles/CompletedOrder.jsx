import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientOrderForm = ({ onSuccess, clientData, isEditMode }) => {
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

  useEffect(() => {
    if (isEditMode && clientData) {
      setFormData({
        ...clientData,
        // Convert numbers to strings for the form
        deckle: clientData.deckle.toString(),
        cuttingLength: clientData.cuttingLength.toString(),
        topGsm: clientData.topGsm.toString(),
        linerGsm: clientData.linerGsm.toString(),
        fluteGsm: clientData.fluteGsm.toString(),
        oneUps: clientData.oneUps.toString(),
        twoUps: clientData.twoUps.toString(),
        threeUps: clientData.threeUps.toString(),
        fourUps: clientData.fourUps.toString(),
        sellingPricePerBox: clientData.sellingPricePerBox.toString(),
        productionCostPerBox: clientData.productionCostPerBox.toString(),
      });
    }
  }, [isEditMode, clientData]);

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
      
      // Convert string values back to numbers where needed
      const payload = {
        ...formData,
        deckle: parseFloat(formData.deckle),
        cuttingLength: parseFloat(formData.cuttingLength),
        topGsm: parseInt(formData.topGsm),
        linerGsm: parseInt(formData.linerGsm),
        fluteGsm: parseInt(formData.fluteGsm),
        oneUps: parseFloat(formData.oneUps),
        twoUps: parseFloat(formData.twoUps),
        threeUps: parseFloat(formData.threeUps),
        fourUps: parseFloat(formData.fourUps),
        sellingPricePerBox: parseFloat(formData.sellingPricePerBox),
        productionCostPerBox: parseFloat(formData.productionCostPerBox),
      };

      if (isEditMode) {
        payload.id = clientData.id;
        await axios.put(
          `https://arunaenterprises.azurewebsites.net/admin/updateClientAndReel/${clientData.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://arunaenterprises.azurewebsites.net/admin/client/order/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert(`Client ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSuccess();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  // List of numeric fields that should have the spinner removed
  const numericFields = [
    "deckle", 
    "cuttingLength", 
    "topGsm", 
    "linerGsm", 
    "fluteGsm", 
    "oneUps", 
    "twoUps", 
    "threeUps", 
    "fourUps", 
    "sellingPricePerBox", 
    "productionCostPerBox"
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 shadow-xl rounded-xl mt-10 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">
        {isEditMode ? "Edit Client" : "Create Client Order"}
      </h1>
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
          ["paperTypeFlute", "Paper Type Flute"],
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
              type={numericFields.includes(name) ? "text" : "text"} // All fields as text type
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              inputMode={numericFields.includes(name) ? "numeric" : "text"} // Show numeric keyboard for numeric fields
              pattern={numericFields.includes(name) ? "[0-9.]*" : undefined} // Allow numbers and decimal points
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all"
          >
            {isEditMode ? "Update Client" : "Submit Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientOrderForm;