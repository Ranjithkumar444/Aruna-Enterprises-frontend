import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "SHIPPED"];

const statusConfig = {
  TODO: {
    title: "To Do",
    dotClass: "bg-status-blue",      
    cardClass: "border-status-blue",  
  },
  IN_PROGRESS: {
    title: "In Progress",
    dotClass: "bg-status-yellow",     
    cardClass: "border-status-yellow", 
  },
  COMPLETED: {
    title: "Done",
    dotClass: "bg-status-green",     
    cardClass: "border-status-green",  
  },
  SHIPPED: {
    title: "Shipped",
    dotClass: "bg-status-purple",     
    cardClass: "border-status-purple", 
  },
};

const KanbanBoard = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [destinationStatus, setDestinationStatus] = useState(null);
  const [transportNumber, setTransportNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5 * 60 * 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  function convertToIST(utcDateString) {
  const utcDate = new Date(utcDateString);
  const istDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return istDate.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://arunaenterprises.azurewebsites.net/admin/order/getOrdersByActiveStatus",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched orders:", res.data);
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
      console.warn("Cannot drag orders out of the Shipped column.");
      fetchOrders();
      return;
    }
    if (destination.droppableId === "SHIPPED" && source.droppableId !== "COMPLETED") {
        console.warn("Orders can only be dragged to 'Shipped' from 'Completed'.");
        fetchOrders(); 
        return;
    }
    
    const orderId = draggableId;
    const status = destination.droppableId;

    if (status === "COMPLETED") {
      setSelectedOrderId(orderId);
      setDestinationStatus(status);
      setShowConfirmModal(true);
    } else if (status === "SHIPPED") {
      setSelectedOrderId(orderId);
      setDestinationStatus(status);
      setShowShippingModal(true);
    } else {
      updateOrderStatus(orderId, status);
    }
  };

  const updateOrderStatus = async (orderId, status, transportNumber = null) => {
    try {
      setIsLoading(true);
      const payload = {
        status: status
      };
      
      if (transportNumber) {
        payload.transportNumber = transportNumber;
      }
  
      await axios.put(
        `https://arunaenterprises.azurewebsites.net/admin/order/${orderId}/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
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

  const handleCancel = () => {
    setShowConfirmModal(false);
    setShowShippingModal(false);
    setSelectedOrderId(null);
    setDestinationStatus(null);
    setTransportNumber("");
    fetchOrders(); 
  };

  const getOrdersByStatus = (status) => {
    const now = new Date();

    if (status === "SHIPPED") {
      return orders.filter((order) => {
        if (order.status !== "SHIPPED") return false;
        
        if (!order.shippedAt) {
          console.warn(`Order ${order.id} is SHIPPED but missing shippedAt timestamp.`);
          return true; 
        }

        const shippedTime = new Date(order.shippedAt);
        const diffMs = now.getTime() - shippedTime.getTime();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        return diffMs < twentyFourHoursInMs;
      });
    }

    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
        Orders Dashboard
      </h1>
      <div className="flex gap-4 lg:gap-6 flex-col lg:flex-row">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => {
            const config = statusConfig[status];
            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 bg-white rounded-lg p-4 shadow-md flex flex-col min-h-[300px]" // min-h added for better visual
                  >
                    <h2 className="text-xl font-bold text-center mb-4 text-purple-700">
                      {config.title}
                    </h2>
                    <div className="flex flex-col gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom scrollbar class */}
                      {getOrdersByStatus(status).map((order, index) => (
                        <Draggable
                          key={order.id.toString()}
                          draggableId={order.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-md shadow-sm border-l-4 ${config.cardClass} cursor-grab active:cursor-grabbing transform transition-all duration-150 ease-in-out hover:shadow-md`} // Added border-l-4
                            >
                              <div className="flex gap-3 items-start">
                                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${config.dotClass}`}></div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900 text-lg">
                                      Order #{order.id}
                                    </h3>
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
                                      <span className="block text-gray-500 font-normal">Size</span>
                                      <span>{order.size}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500 font-normal">Quantity</span>
                                      <span>{order.quantity}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500 font-normal">Unit</span>
                                      <span>{order.unit}</span>
                                    </div>
                                    <div>
                                      <span className="block text-gray-500 font-normal">CreatedAt</span>
                                      <span>{convertToIST(order.createdAt)}</span>
                                    </div>

                                    {order.status === "SHIPPED" && order.shippedAt && (
                                      <div>
                                          <span className="block text-gray-500 font-normal">Shipped At</span>
                                          <span>{new Date(order.shippedAt).toLocaleString()}</span>
                                      </div>
                                    )}
                                    {order.transportNumber && (
                                      <div className="col-span-2"> {/* Span across both columns */}
                                        <span className="block text-gray-500 font-normal">
                                          Transport #
                                        </span>
                                        <span className="font-semibold text-blue-700">
                                          {order.transportNumber}
                                        </span>
                                      </div>
                                    )}
                                  </div>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-modal-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Confirm Order Completion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark Order <b className="font-semibold text-blue-700">#{selectedOrderId}</b> as{" "}
              <b className="font-semibold text-green-700">Completed</b>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 text-base rounded-lg cursor-pointer transition-colors duration-300 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="px-6 py-2 text-base rounded-lg cursor-pointer transition-colors duration-300 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-modal-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Confirm Order Shipping</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark Order <b className="font-semibold text-blue-700">#{selectedOrderId}</b> as{" "}
              <b className="font-semibold text-status-purple">Shipped</b>?
            </p>
            <div className="mb-6 text-left"> {/* Aligned to left for input */}
              <label htmlFor="transportNumber" className="block text-sm font-medium text-gray-700 mb-1">Transport Number:</label>
              <input
                type="text"
                id="transportNumber"
                value={transportNumber}
                onChange={(e) => setTransportNumber(e.target.value)}
                placeholder="Enter transport number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 text-base rounded-lg cursor-pointer transition-colors duration-300 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleShippingConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="px-6 py-2 text-base rounded-lg cursor-pointer transition-colors duration-300 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={isLoading}
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