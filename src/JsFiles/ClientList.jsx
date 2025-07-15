import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientOrderForm from "./ClientOrderForm"; 
import * as XLSX from "xlsx";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/getAllClients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleExport = () => {
    const exportData = clients.map(({ id, clientNormalizer, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "Client_List.xlsx");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClient(null);
    fetchClients(); 
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div className="p-8">
      {showForm ? (
        <div>
          <button
            className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
            onClick={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
          >
            Cancel
          </button>
          <ClientOrderForm 
            onSuccess={handleFormSuccess} 
            clientData={editingClient}
            isEditMode={!!editingClient}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Client List</h1>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                onClick={() => setShowForm(true)}
              >
                + Create Client
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                onClick={handleExport}
              >
                ⬇ Export to Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 border">Actions</th>
                  <th className="px-4 py-2 border">Client</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Product Type</th>
                  <th className="px-4 py-2 border">Size</th>
                  <th className="px-4 py-2 border">Ply</th>
                  <th className="px-4 py-2 border">Deckle</th>
                  <th className="px-4 py-2 border">Cutting Length</th>
                  <th className="px-4 py-2 border">Top GSM</th>
                  <th className="px-4 py-2 border">Liner GSM</th>
                  <th className="px-4 py-2 border">Flute GSM</th>
                  <th className="px-4 py-2 border">Made Up Of</th>
                  <th className="px-4 py-2 border">Paper Top</th>
                  <th className="px-4 py-2 border">Paper Bottom</th>
                  <th className="px-4 py-2 border">Paper Flute</th>
                  <th className="px-4 py-2 border">1 Ups</th>
                  <th className="px-4 py-2 border">2 Ups</th>
                  <th className="px-4 py-2 border">3 Ups</th>
                  <th className="px-4 py-2 border">4 Ups</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Selling Price</th>
                  <th className="px-4 py-2 border">Production Cost</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index} className="text-center bg-white border-t">
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(client)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-2 border">{client.client}</td>
                    <td className="px-4 py-2 border">{client.product}</td>
                    <td className="px-4 py-2 border">{client.productType}</td>
                    <td className="px-4 py-2 border">{client.size}</td>
                    <td className="px-4 py-2 border">{client.ply}</td>
                    <td className="px-4 py-2 border">{client.deckle}</td>
                    <td className="px-4 py-2 border">{client.cuttingLength}</td>
                    <td className="px-4 py-2 border">{client.topGsm}</td>
                    <td className="px-4 py-2 border">{client.linerGsm}</td>
                    <td className="px-4 py-2 border">{client.fluteGsm}</td>
                    <td className="px-4 py-2 border">{client.madeUpOf}</td>
                    <td className="px-4 py-2 border">{client.paperTypeTop}</td>
                    <td className="px-4 py-2 border">{client.paperTypeBottom}</td>
                    <td className="px-4 py-2 border">{client.paperTypeFlute}</td>
                    <td className="px-4 py-2 border">{client.oneUps}</td>
                    <td className="px-4 py-2 border">{client.twoUps}</td>
                    <td className="px-4 py-2 border">{client.threeUps}</td>
                    <td className="px-4 py-2 border">{client.fourUps}</td>
                    <td className="px-4 py-2 border">{client.description}</td>
                    <td className="px-4 py-2 border">₹{client.sellingPricePerBox.toFixed(2)}</td>
                    <td className="px-4 py-2 border">₹{client.productionCostPerBox.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientList;