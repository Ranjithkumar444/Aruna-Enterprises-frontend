import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CssFiles/ContactDetails.css"

const ContactDetails = () => {
  const [contactDetail, setContactDetail] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/contact/contactDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setContactDetail(response.data);
      } catch (error) {
        console.error("Failed to fetch contact details:", error);
      }
    };

    fetchContactDetails();
  }, []);

  const handleReplyStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/contact/updateReplyStatus/${id}`,
        { replyStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setContactDetail(contactDetail.map(contact => 
        contact.id === id ? { ...contact, replyStatus: newStatus } : contact
      ));
    } catch (error) {
      console.error("Failed to update reply status:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title"> Contact Details</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Message</th>
            <th>Replied</th>
          </tr>
        </thead>
        <tbody>
          {contactDetail.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>{contact.email || "N/A"}</td>
              <td>{contact.message}</td>
              <td>
                <input
                  type="checkbox"
                  checked={contact.replyStatus || false}
                  onChange={() => handleReplyStatusChange(contact.id, contact.replyStatus)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactDetails;