import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PunchingClientOrderForm from "./PunchingClientOrderForm";
import CorrugatedClientOrderForm from "./CorrugatedClientOrderForm";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formType, setFormType] = useState(""); // "corrugated" or "punching"
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all", "corrugated", "punching"
  const token = localStorage.getItem("adminToken");

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "https://arunaenterprises.azurewebsites.net/admin/getAllClients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFormSuccess = () => {
    fetchClients();
    setShowForm(false);
    setEditingClient(null);
    setFormType("");
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    if (client.productType === "punching") {
      setFormType("punching");
    } else {
      setFormType("corrugated");
    }
    setShowForm(true);
  };

  // Filter clients based on selected filter
  const filteredClients = clients.filter(client => {
    if (selectedFilter === "all") return true;
    return client.productType === selectedFilter;
  });

  // Separate clients by type
  const corrugatedClients = clients.filter(client => client.productType === "corrugated");
  const punchingClients = clients.filter(client => client.productType === "punching");

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Prepare data for export (remove sensitive fields)
    const prepareDataForExport = (clientList) => {
      return clientList.map(({ productionCostPerBox, sellingPricePerBox, ...rest }) => rest);
    };

    // Add All Clients sheet
    const allClientsData = prepareDataForExport(clients);
    const allClientsSheet = XLSX.utils.json_to_sheet(allClientsData);
    XLSX.utils.book_append_sheet(workbook, allClientsSheet, "All Clients");

    // Add Corrugated Clients sheet
    if (corrugatedClients.length > 0) {
      const corrugatedData = prepareDataForExport(corrugatedClients);
      const corrugatedSheet = XLSX.utils.json_to_sheet(corrugatedData);
      XLSX.utils.book_append_sheet(workbook, corrugatedSheet, "Corrugated Clients");
    }

    // Add Punching Clients sheet
    if (punchingClients.length > 0) {
      const punchingData = prepareDataForExport(punchingClients);
      const punchingSheet = XLSX.utils.json_to_sheet(punchingData);
      XLSX.utils.book_append_sheet(workbook, punchingSheet, "Punching Clients");
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "clients.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Client Management</h1>

      {!showForm && (
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setShowForm(true);
                setFormType("corrugated");
              }}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700"
            >
              + Corrugated Client
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setFormType("punching");
              }}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700"
            >
              + Punching Client
            </button>
            <button
              onClick={exportToExcel}
              className="ml-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
            >
              Export to Excel
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Clients ({clients.length})
            </button>
            <button
              onClick={() => setSelectedFilter("corrugated")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedFilter === "corrugated"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Corrugated ({corrugatedClients.length})
            </button>
            <button
              onClick={() => setSelectedFilter("punching")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                selectedFilter === "punching"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Punching ({punchingClients.length})
            </button>
          </div>
        </div>
      )}

      {showForm ? (
        <div>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingClient(null);
              setFormType("");
            }}
            className="mb-6 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
          >
            Cancel
          </button>

          {formType === "corrugated" && (
            <CorrugatedClientOrderForm
              onSuccess={handleFormSuccess}
              clientData={editingClient}
              isEditMode={!!editingClient}
            />
          )}
          {formType === "punching" && (
            <PunchingClientOrderForm
              onSuccess={handleFormSuccess}
              clientData={editingClient}
              isEditMode={!!editingClient}
            />
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Client",
                  "Product",
                  "Product Type",
                  "Size",
                  "Ply",
                  "Cutting Length",
                  "Deckle",
                  "Top GSM",
                  "Flute GSM",
                  "Bottom GSM",
                  "Top Paper",
                  "Flute Paper",
                  "Bottom Paper",
                  "Made Of",
                  "One Ups",
                  "Two Ups",
                  "Three Ups",
                  "Four Ups",
                  "Five Ups",
                  "Six Ups",
                  "Description",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left font-medium text-gray-600 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{client.client}</td>
                  <td className="px-4 py-2">{client.product}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.productType === "corrugated" 
                        ? "bg-indigo-100 text-indigo-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {client.productType}
                    </span>
                  </td>
                  <td className="px-4 py-2">{client.size}</td>
                  <td className="px-4 py-2">{client.ply}</td>
                  <td className="px-4 py-2">{client.cuttingLength}</td>
                  <td className="px-4 py-2">{client.deckle}</td>
                  <td className="px-4 py-2">{client.topGsm}</td>
                  <td className="px-4 py-2">{client.fluteGsm}</td>
                  <td className="px-4 py-2">{client.bottomGsm}</td>
                  <td className="px-4 py-2">{client.paperTypeTop}</td>
                  <td className="px-4 py-2">{client.paperTypeFlute}</td>
                  <td className="px-4 py-2">{client.paperTypeBottom}</td>
                  <td className="px-4 py-2">{client.madeUpOf}</td>
                  <td className="px-4 py-2">{client.oneUps}</td>
                  <td className="px-4 py-2">{client.twoUps}</td>
                  <td className="px-4 py-2">{client.threeUps}</td>
                  <td className="px-4 py-2">{client.fourUps}</td>
                  <td className="px-4 py-2">{client.fiveUps}</td>
                  <td className="px-4 py-2">{client.sixUps}</td>
                  <td className="px-4 py-2">{client.description}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan="21"
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    No clients found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientList;
