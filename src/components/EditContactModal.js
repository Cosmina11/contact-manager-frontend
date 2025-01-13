import React, { useState } from "react";

function EditContactModal({ contact, onClose, onContactUpdated }) {
  const [formData, setFormData] = useState({
    id: contact._id,
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    email: contact.email || "",
    phone: contact.phone || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactId = contact._id;
    if (!contactId) {
      console.error("No contact ID available");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      if (response.ok) {
        onContactUpdated();
        onClose();
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Failed to update contact:", errorData);
        alert(
          "Eroare la actualizarea contactului. Verificați datele introduse."
        );
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Eroare la actualizarea contactului.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Editează Contact</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prenume
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditContactModal;
