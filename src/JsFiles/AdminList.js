import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/get-admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        alert("Failed to fetch admin data");
      }
    };

    fetchAdmins();
  }, [token]);

  return (
    <div className="admin-list-container">
      <h2>Admin List</h2>

      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.userName}</td>
                <td>{admin.firstName}</td>
                <td>{admin.lastName}</td>
                <td>{admin.email}</td>
                <td>{admin.phoneNumber}</td>
                <td>{admin.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;
