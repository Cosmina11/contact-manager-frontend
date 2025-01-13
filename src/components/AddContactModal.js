import React, { useState } from "react";

function AddContactModal({ isOpen, onClose, onContactAdded }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddresses: [{ value: "" }],
    phoneNumbers: [{ value: "" }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddresses: formData.emailAddresses[0].value
          ? [{ value: formData.emailAddresses[0].value }]
          : [],
        phoneNumbers: formData.phoneNumbers[0].value
          ? [{ value: formData.phoneNumbers[0].value }]
          : [],
      };

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        onContactAdded();
        onClose();
        setFormData({
          firstName: "",
          lastName: "",
          emailAddresses: [{ value: "" }],
          phoneNumbers: [{ value: "" }],
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to add contact:", errorData);
        alert("Eroare la adăugarea contactului. Verificați datele introduse.");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Eroare la adăugarea contactului.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Adaugă Contact Nou</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Prenume"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nume"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.emailAddresses[0].value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emailAddresses: [{ value: e.target.value }],
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              placeholder="Telefon"
              value={formData.phoneNumbers[0].value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumbers: [{ value: e.target.value }],
                })
              }
              className="w-full p-2 border rounded"
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

export default AddContactModal;
