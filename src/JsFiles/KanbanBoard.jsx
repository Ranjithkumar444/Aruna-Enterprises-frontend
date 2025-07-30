import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "SHIPPED"];
const statusConfig = {
  TODO: { 
    title: "To Do", 
    dotClass: "bg-blue-500", 
    cardClass: "border-l-blue-500",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700"
  },
  IN_PROGRESS: { 
    title: "In Progress", 
    dotClass: "bg-amber-500", 
    cardClass: "border-l-amber-500",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700"
  },
  COMPLETED: { 
    title: "Done", 
    dotClass: "bg-green-500", 
    cardClass: "border-l-green-500",
    bgClass: "bg-green-50",
    textClass: "text-green-700"
  },
  SHIPPED: { 
    title: "Shipped", 
    dotClass: "bg-purple-500", 
    cardClass: "border-l-purple-500",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700"
  },
};

const KanbanBoard = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [destinationStatus, setDestinationStatus] = useState(null);
  const [transportNumber, setTransportNumber] = useState("");
  
  // Split feature state
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitQuantity, setSplitQuantity] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  function convertToIST(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    return istDate.toLocaleString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
    });
  }

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://arunaenterprises.azurewebsites.net/admin/order/getOrdersByActiveStatus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    if (source.droppableId === "SHIPPED") {
      fetchOrders();
      return;
    }
    if (destination.droppableId === "SHIPPED" && source.droppableId !== "COMPLETED") {
      fetchOrders();
      return;
    }
    setSelectedOrderId(draggableId);
    setDestinationStatus(destination.droppableId);
    if (destination.droppableId === "COMPLETED") {
      setShowConfirmModal(true);
    } else if (destination.droppableId === "SHIPPED") {
      setShowShippingModal(true);
    } else {
      updateOrderStatus(draggableId, destination.droppableId);
    }
  };

  const updateOrderStatus = async (orderId, status, transportNumber = null) => {
    setIsLoading(true);
    try {
      const payload = { status };
      if (transportNumber) payload.transportNumber = transportNumber;
      await axios.put(`https://arunaenterprises.azurewebsites.net/admin/order/${orderId}/status`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    updateOrderStatus(selectedOrderId, destinationStatus);
    setShowConfirmModal(false);
    setSelectedOrderId(null);
    setDestinationStatus(null);
  };

  const handleShippingConfirm = () => {
    updateOrderStatus(selectedOrderId, destinationStatus, transportNumber);
    setShowShippingModal(false);
    setSelectedOrderId(null);
    setTransportNumber("");
  };

  const handleSplitSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post(`https://arunaenterprises.azurewebsites.net/admin/order/${selectedOrderId}/split`, {
        firstPartQuantity: splitQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSplitModal(false);
      setSelectedOrderId(null);
      setSplitQuantity(0);
      fetchOrders();
    } catch (err) {
      console.error("Error splitting order:", err);
      alert(`Failed to split order: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => {
      if (status === "TODO") {
        return order.status === "TODO" || order.status === "PENDING";
      }
      return order.status === status;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Orders Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>To Do</span>
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>In Progress</span>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Done</span>
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Shipped</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map(status => {
            const config = statusConfig[status];
            const ordersInStatus = getOrdersByStatus(status);
            
            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className={`px-4 py-3 border-b border-gray-200 ${config.bgClass}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${config.textClass}`}>
                          {config.title}
                        </h3>
                        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                          {ordersInStatus.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {ordersInStatus.map((order, index) => (
                        <Draggable key={order.id.toString()} draggableId={order.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-grab hover:shadow-md transition-shadow duration-200 ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              } ${config.cardClass}`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${config.dotClass}`}></div>
                                    <h4 className="font-semibold text-slate-800">#{order.id}</h4>
                                  </div>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-600">
                                    {order.productType}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-slate-700">
                                    {order.client} - {order.productName}
                                  </p> 
                                  <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded font-medium text-gray-600">
                                    {order.typeOfProduct}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">Size</span>
                                    <p className="font-medium text-slate-700">{order.size}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Quantity</span>
                                    <p className="font-medium text-slate-700">{order.quantity}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Unit</span>
                                    <p className="font-medium text-slate-700">{order.unit}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Created</span>
                                    <p className="font-medium text-slate-700 text-xs">
                                      {convertToIST(order.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                
                                {order.status === "SHIPPED" && order.shippedAt && (
                                  <div className="text-xs">
                                    <span className="text-gray-500">Shipped At</span>
                                    <p className="font-medium text-slate-700">
                                      {new Date(order.shippedAt).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                                
                                {order.transportNumber && (
                                  <div className="text-xs">
                                    <span className="text-gray-500">Transport #</span>
                                    <p className="font-semibold text-blue-600">{order.transportNumber}</p>
                                  </div>
                                )}
                                
                                <button
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  onClick={() => {
                                    setSelectedOrderId(order.id.toString());
                                    setSplitQuantity(order.quantity);
                                    setShowSplitModal(true);                                    
                                  }}
                                >
                                  Split Order
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>

      {/* Confirm Completion Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Confirm Order Completion</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark Order <span className="font-semibold text-blue-600">#{selectedOrderId}</span> as completed?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedOrderId(null);
                    setDestinationStatus(null);
                    fetchOrders();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Confirm Order Shipping</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to mark Order <span className="font-semibold text-blue-600">#{selectedOrderId}</span> as shipped?
              </p>
              <div className="mb-6">
                <label htmlFor="transportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Number
                </label>
                <input
                  type="text"
                  id="transportNumber"
                  value={transportNumber}
                  onChange={(e) => setTransportNumber(e.target.value)}
                  placeholder="Enter transport number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    setShowShippingModal(false);
                    setSelectedOrderId(null);
                    setTransportNumber("");
                    fetchOrders();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  onClick={handleShippingConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Split Order #{selectedOrderId}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Original quantity: <span className="font-semibold">{orders.find(o => o.id.toString() === selectedOrderId)?.quantity}</span>
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First part quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={orders.find(o => o.id.toString() === selectedOrderId)?.quantity - 1}
                  value={splitQuantity}
                  onChange={(e) => setSplitQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Second part will be: <span className="font-semibold">{orders.find(o => o.id.toString() === selectedOrderId)?.quantity - splitQuantity}</span>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSplitModal(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSplitSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {isLoading ? "Processing..." : "Split"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;