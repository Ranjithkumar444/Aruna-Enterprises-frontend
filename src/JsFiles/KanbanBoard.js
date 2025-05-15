import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../CssFiles/KanbanBoard.css";

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED"];

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
};

const KanbanBoard = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [destinationStatus, setDestinationStatus] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();

    // Optional: Refresh orders every 5 mins
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5 * 60 * 1000); // 5 mins

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/admin/order/getAllOrders",
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
    } else {
      updateOrderStatus(orderId, status);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/admin/order/${orderId}/status`,
        null,
        {
          params: { status },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleConfirm = () => {
    updateOrderStatus(selectedOrderId, destinationStatus);
    setShowConfirmModal(false);
    setSelectedOrderId(null);
    setDestinationStatus(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setSelectedOrderId(null);
    setDestinationStatus(null);
  };

  const getOrdersByStatus = (status) => {
    const now = new Date();

    if (status === "COMPLETED") {
      return orders.filter((order) => {
        if (order.status !== "COMPLETED") return false;
        if (!order.completedAt) return false;

        const completedTime = new Date(order.completedAt);
        const diffMs = now - completedTime;

        return diffMs < 24 * 60 * 60 * 1000; // Less than 24 hours
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
              <button className="btn-confirm" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
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
