import React from "react";

function SyncButton({ onSync }) {
  const handleSync = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        onSync();
      } else {
        console.error("Sync failed:", response.status);
      }
    } catch (error) {
      console.error("Error syncing contacts:", error);
    }
  };

  return (
    <button
      onClick={handleSync}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Sincronizează Contactele
    </button>
  );
}

export default SyncButton;
