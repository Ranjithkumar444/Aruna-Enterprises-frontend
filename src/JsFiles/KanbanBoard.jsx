import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "SHIPPED"];
const statusConfig = {
  TODO: { title: "To Do", dotClass: "bg-status-blue", cardClass: "border-status-blue" },
  IN_PROGRESS: { title: "In Progress", dotClass: "bg-status-yellow", cardClass: "border-status-yellow" },
  COMPLETED: { title: "Done", dotClass: "bg-status-green", cardClass: "border-status-green" },
  SHIPPED: { title: "Shipped", dotClass: "bg-status-purple", cardClass: "border-status-purple" },
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
    if (!transportNumber.trim()) {
      alert("Please enter a transport number");
      return;
    }
    updateOrderStatus(selectedOrderId, destinationStatus, transportNumber);
    setShowShippingModal(false);
    setSelectedOrderId(null);
    setDestinationStatus(null);
    setTransportNumber("");
  };

  const handleSplitSubmit = async () => {
    const original = orders.find(o => o.id.toString() === selectedOrderId);
    const firstQ = splitQuantity;
    const secondQ = original.quantity - firstQ;
    if (firstQ <= 0 || secondQ <= 0) {
      alert("Invalid split quantities");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("https://arunaenterprises.azurewebsites.net/admin/order/split", {
        originalOrderId: original.id,
        firstOrderQuantity: firstQ,
        secondOrderQuantity: secondQ
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowSplitModal(false);
      setSelectedOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error("Split failed:", err);
      alert(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrdersByStatus = (status) => {
    const now = new Date();
    return orders.filter(order => {
      if (status === "SHIPPED") {
        if (order.status !== "SHIPPED") return false;
        if (!order.shippedAt) return true;
        return now.getTime() - new Date(order.shippedAt).getTime() < 24 * 60 * 60 * 1000;
      }
      return order.status === status;
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Orders Dashboard</h1>
      <div className="flex gap-4 lg:gap-6 flex-col lg:flex-row">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map(status => {
            const config = statusConfig[status];
            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className="flex-1 bg-white rounded-lg p-4 shadow-md flex flex-col min-h-[300px]"
                  >
                    <h2 className="text-xl font-bold text-center mb-4 text-purple-700">
                      {config.title}
                    </h2>
                    <div className="flex flex-col gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                      {getOrdersByStatus(status).map((order, index) => (
                        <Draggable key={order.id.toString()} draggableId={order.id.toString()} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-md shadow-sm border-l-4 ${config.cardClass} cursor-grab hover:shadow-md`}
                            >
                              <div className="flex gap-3 items-start">
                                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${config.dotClass}`}></div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900 text-lg">Order #{order.id}</h3>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700">
                                      {order.productType}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 font-medium leading-snug">
                                    Client: {order.client}
                                  </p>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700">
                                    {order.typeOfProduct}
                                  </span>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm text-gray-800">
                                    <div>
                                      <span className="block text-gray-500">Size</span>
                                      <span>{order.size}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500">Quantity</span>
                                      <span>{order.quantity}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500">Unit</span>
                                      <span>{order.unit}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500">CreatedAt</span>
                                      <span>{convertToIST(order.createdAt)}</span>
                                    </div>
                                    {order.status === "SHIPPED" && order.shippedAt && (
                                      <div>
                                        <span className="block text-gray-500">Shipped At</span>
                                        <span>{new Date(order.shippedAt).toLocaleString()}</span>
                                      </div>
                                    )}
                                    {order.transportNumber && (
                                      <div className="col-span-2">
                                        <span className="block text-gray-500">Transport #</span>
                                        <span className="font-semibold text-blue-700">{order.transportNumber}</span>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    className="mt-2 text-xs text-blue-500 hover:underline"
                                    onClick={() => {
                                      setSelectedOrderId(order.id.toString());
                                      setSplitQuantity(order.quantity);
                                      setShowSplitModal(true);                                    
                                    }}
                                  >
                                    Split
                                  </button>
                                </div>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">
              Confirm Order Completion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark Order <b className="font-semibold text-blue-700">#{selectedOrderId}</b> as{" "}
              <b className="font-semibold text-green-700">Completed</b>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
            </div>
          </div>
        </div>
      )}

      {/* Confirm Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">
              Confirm Order Shipping
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark Order <b className="font-semibold text-blue-700">#{selectedOrderId}</b> as{" "}
              <b className="font-semibold text-status-purple">Shipped</b>?
            </p>
            <div className="mb-6 text-left">
              <label htmlFor="transportNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Transport Number:
              </label>
              <input
                type="text"
                id="transportNumber"
                value={transportNumber}
                onChange={(e) => setTransportNumber(e.target.value)}
                placeholder="Enter transport number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleShippingConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
            </div>
          </div>
        </div>
      )}

      {/* Split Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="mb-4 text-2xl font-semibold">Split Order #{selectedOrderId}</h3>
            <p className="text-gray-600 mb-3">
              Original quantity: <b>{orders.find(o => o.id.toString() === selectedOrderId)?.quantity}</b>
            </p>
            <div className="mb-6 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First part quantity:
              </label>
              <input
                type="number"
                min="1"
                max={orders.find(o => o.id.toString() === selectedOrderId)?.quantity - 1}
                value={splitQuantity}
                onChange={(e) => setSplitQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="mt-2 text-sm text-gray-600">
                Second part will be: <b>{orders.find(o => o.id.toString() === selectedOrderId)?.quantity - splitQuantity}</b>
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSplitSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {isLoading ? "Processing..." : "Split"}
              </button>
              <button
                onClick={() => setShowSplitModal(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KanbanBoard;
