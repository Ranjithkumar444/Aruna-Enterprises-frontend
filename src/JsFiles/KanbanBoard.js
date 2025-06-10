import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../CssFiles/KanbanBoard.css";

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "SHIPPED"];

const statusConfig = {
  TODO: {
    title: "To Do",
    dotClass: "dot-blue",
    cardClass: "border-blue",
  },
  IN_PROGRESS: {
    title: "In Progress",
    dotClass: "dot-yellow",
    cardClass: "border-yellow",
  },
  COMPLETED: {
    title: "Done",
    dotClass: "dot-green",
    cardClass: "border-green",
  },
  SHIPPED: {
    title: "Shipped",
    dotClass: "dot-darkgreen",
    cardClass: "border-darkgreen",
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

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://arunaenterprises.azurewebsites.net/admin/order/getOrdersByActiveStatus",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const orderId = draggableId;
    const status = destination.droppableId;

    if (status === "COMPLETED") {
      setSelectedOrderId(orderId);
      setDestinationStatus(status);
      setShowConfirmModal(true);
    } else if (status === "SHIPPED" && source.droppableId === "COMPLETED") {
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
        status: status === "IN_PROGRESS" ? "IN_PROGRESS" : status 
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
  };

  const getOrdersByStatus = (status) => {
    const now = new Date();

    if (status === "SHIPPED") {
      return orders.filter((order) => {
        if (order.status !== "SHIPPED") return false;
        if (!order.shippedAt) return false;

        const shippedTime = new Date(order.shippedAt);
        const diffMs = now - shippedTime;

        return diffMs < 24 * 60 * 60 * 1000;
      });
    }

    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="kanban-container">
      <h1 className="kanban-title">Orders Dashboard</h1>
      <div className="kanban-board">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => {
            const config = statusConfig[status];
            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="kanban-column"
                  >
                    <h2 className="kanban-column-title">{config.title}</h2>
                    <div className="kanban-column-content">
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
                              className={`kanban-card ${config.cardClass}`}
                            >
                              <div className="card-header">
                                <div className={`dot ${config.dotClass}`}></div>
                                <div className="card-info">
                                  <div className="card-top">
                                    <h3 className="card-title">
                                      Order #{order.id}
                                    </h3>
                                    <span className="card-chip">
                                      {order.productType}
                                    </span>
                                  </div>
                                  <p className="card-client">{order.client}</p>
                                  <div className="card-details">
                                    <div>
                                      <span className="card-label">Size</span>
                                      <span>{order.size}</span>
                                    </div>
                                    <div>
                                      <span className="card-label">
                                        Quantity
                                      </span>
                                      <span>{order.quantity}</span>
                                    </div>
                                    <div>
                                      <span className="card-label">
                                        Unit
                                      </span>
                                      <span>{order.unit}</span>
                                    </div>
                                    {order.transportNumber && (
                                      <div>
                                        <span className="card-label">
                                          Transport #
                                        </span>
                                        <span>{order.transportNumber}</span>
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

      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Order Completion</h3>
            <p>
              Are you sure you want to mark Order #{selectedOrderId} as{" "}
              <b>Completed</b>?
            </p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button className="btn-cancel" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showShippingModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Order Shipping</h3>
            <p>
              Are you sure you want to mark Order #{selectedOrderId} as{" "}
              <b>Shipped</b>?
            </p>
            <div className="form-group">
              <label htmlFor="transportNumber">Transport Number:</label>
              <input
                type="text"
                id="transportNumber"
                value={transportNumber}
                onChange={(e) => setTransportNumber(e.target.value)}
                placeholder="Enter transport number"
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={handleShippingConfirm} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm"}
              </button>
              <button className="btn-cancel" onClick={handleCancel} disabled={isLoading}>
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