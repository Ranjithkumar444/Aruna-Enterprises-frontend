import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CorrugatedClientOrderForm from "./CorrugatedClientOrderForm";
import PunchingClientOrderForm from "./PunchingClientOrderForm";


const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formType, setFormType] = useState(""); // "corrugated" or "punching"
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

  const exportToExcel = () => {
    const filteredClients = clients.map(({ productionCostPerBox, sellingPricePerBox, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredClients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
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
        <div className="mb-6 flex gap-4">
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
              {clients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{client.client}</td>
                  <td className="px-4 py-2">{client.product}</td>
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
              {clients.length === 0 && (
                <tr>
                  <td
                    colSpan="20"
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    No clients found.
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
