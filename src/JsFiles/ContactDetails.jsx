import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactDetails = () => {
  const [contactDetail, setContactDetail] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get("https://arunaenterprises.azurewebsites.net/admin/contact/contactDetails", {
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
        `https://arunaenterprises.azurewebsites.net/admin/contact/updateReplyStatus/${id}`,
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
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Contact Details</h2>

        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Phone Number</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Message</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Replied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {contactDetail.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-800">{contact.name}</td>
                <td className="px-4 py-3 text-gray-800">{contact.phone}</td>
                <td className="px-4 py-3 text-gray-800">{contact.email || "N/A"}</td>
                <td className="px-4 py-3 text-gray-800">{contact.message}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={contact.replyStatus || false}
                    onChange={() => handleReplyStatusChange(contact.id, contact.replyStatus)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
            {contactDetail.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No contact details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactDetails;
