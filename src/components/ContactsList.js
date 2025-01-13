import React, { useState } from "react";
import EditContactModal from "./EditContactModal";

function ContactsList({ contacts, onContactDeleted }) {
  const [editingContact, setEditingContact] = useState(null);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("No contact ID provided");
      return;
    }

    if (window.confirm("Sigur doriți să ștergeți acest contact?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5001/api/contacts/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          onContactDeleted();
        } else {
          console.error("Failed to delete contact:", response.status);
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => {
        return (
          <div key={contact._id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {contact.firstName} {contact.lastName}
                </h3>
                {contact.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Telefon:</span>{" "}
                    {contact.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingContact({
                    ...contact,
                    id: contact._id,
                  });
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Editează
              </button>
              <button
                onClick={() => handleDelete(contact._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Șterge
              </button>
            </div>
          </div>
        );
      })}

      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onContactUpdated={onContactDeleted}
        />
      )}
    </div>
  );
}

export default ContactsList;
