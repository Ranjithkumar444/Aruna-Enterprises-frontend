import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const source = axios.CancelToken.source();

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/admin/order/getOrdersToDoAndInProgress",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            cancelToken: source.token
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      source.cancel("Component unmounted, request canceled");
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'TODO':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 animate-pulse">To Do</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">{status}</span>;
    }
  };

  const uniqueUnits = useMemo(() => {
    const units = new Set(orders.map(order => order.unit).filter(Boolean));
    return ['ALL', ...Array.from(units).sort()];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedUnit === 'ALL') {
      return orders;
    }
    return orders.filter(order => order.unit === selectedUnit);
  }, [orders, selectedUnit]);

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleRowClick = (order) => {
    navigate(`/admin/dashboard/orders/${order.id}/suggested-reels`, { 
      state: { order } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span role="img" aria-label="package" className="mr-3 text-4xl">📦</span>
          Orders To Do & In Progress
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-blue-600">Loading orders, please wait...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-end mb-4">
              <label htmlFor="unit-filter" className="sr-only">Filter by Unit</label>
              <div className="relative">
                <select
                  id="unit-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none bg-white border"
                  value={selectedUnit}
                  onChange={handleUnitChange}
                >
                  {uniqueUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit === 'ALL' ? 'All Units' : `Unit ${unit}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                <p>No orders to display for the selected unit.</p>
                <p className="text-sm mt-2">Try selecting a different unit or add new orders.</p>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Client</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer"
                        onClick={() => handleRowClick(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.productType || <span className="text-gray-400 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.unit || <span className="text-gray-400 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;