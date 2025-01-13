import React, { useState, useEffect } from "react";
import LoginButton from "./components/LoginButton";
import ContactsList from "./components/ContactsList";
import AddContactModal from "./components/AddContactModal";
import SyncButton from "./components/SyncButton";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-10">
      <nav className="bg-white shadow-lg px-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-800 px-10">
                Contact Manager
              </h1>
            </div>
            {isAuthenticated && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    setContacts([]);
                  }}
                  className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Deconectare
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bine ați venit!
              </h2>
              <p className="text-gray-600 mb-8">
                Conectați-vă pentru a vă gestiona contactele.
              </p>
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SyncButton onSync={loadContacts} />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Adaugă Contact Nou
                  </button>
                </div>
              </div>
            </div>
            {contacts.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nu există contacte
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Apăsați butonul "Sincronizează Contactele" pentru a încărca
                  contactele dvs.
                </p>
              </div>
            ) : (
              <ContactsList
                contacts={contacts}
                onContactDeleted={loadContacts}
              />
            )}
            <AddContactModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onContactAdded={loadContacts}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
