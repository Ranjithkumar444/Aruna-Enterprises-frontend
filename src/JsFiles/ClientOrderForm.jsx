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
=======
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
              required
              type={["deckle", "cuttingLength", "oneUps", "twoUps", "threeUps", "fourUps", "sellingPricePerBox", "productionCostPerBox"].includes(name) ? "number" : "text"}
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              step={["deckle", "cuttingLength", "oneUps", "twoUps", "threeUps", "fourUps", "sellingPricePerBox", "productionCostPerBox"].includes(name) ? "0.01" : undefined}
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