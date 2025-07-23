import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    client: "",
    productType: "",
    unit: "",
    typeOfProduct: ""
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("https://arunaenterprises.azurewebsites.net/admin/order/getInStockCompletedOrders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      (filters.client === "" || order.client.toLowerCase().includes(filters.client.toLowerCase())) &&
      (filters.productType === "" || order.productType.toLowerCase().includes(filters.productType.toLowerCase())) &&
      (filters.unit === "" || order.unit.toLowerCase().includes(filters.unit.toLowerCase())) &&
      (filters.typeOfProduct === "" || order.typeOfProduct.toLowerCase().includes(filters.typeOfProduct.toLowerCase()))
    );
    setFilteredOrders(filtered);
  }, [filters, orders]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📦 Completed Orders In Stock</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Client"
          className="px-4 py-2 border rounded-lg"
          value={filters.client}
          onChange={e => setFilters({ ...filters, client: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Product Type"
          className="px-4 py-2 border rounded-lg"
          value={filters.productType}
          onChange={e => setFilters({ ...filters, productType: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Unit"
          className="px-4 py-2 border rounded-lg"
          value={filters.unit}
          onChange={e => setFilters({ ...filters, unit: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Type of Product"
          className="px-4 py-2 border rounded-lg"
          value={filters.typeOfProduct}
          onChange={e => setFilters({ ...filters, typeOfProduct: e.target.value })}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Product Type</th>
              <th className="px-4 py-3">Type of Product</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Material Grade</th>
              <th className="px-4 py-3">Delivery Address</th>
              <th className="px-4 py-3">Expected Completion</th>
              <th className="px-4 py-3">Completed At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order.client}</td>
                  <td className="px-4 py-2">{order.productType}</td>
                  <td className="px-4 py-2">{order.typeOfProduct}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.unit}</td>
                  <td className="px-4 py-2">{order.size}</td>
                  <td className="px-4 py-2">{order.materialGrade}</td>
                  <td className="px-4 py-2">{order.deliveryAddress}</td>
                  <td className="px-4 py-2">
                    {order.expectedCompletionDate
                      ? new Date(order.expectedCompletionDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {order.completedAt
                      ? new Date(order.completedAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedOrders;
