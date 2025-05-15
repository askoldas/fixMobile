import { useState, useEffect } from "react";
import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocuments,
} from "@/lib/firebaseUtils";
import slugify from "slugify";

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all devices from Firestore
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const data = await fetchDocuments("Devices");
        setDevices(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError("Failed to fetch devices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const addDevice = async (device) => {
    if (!device.name?.trim() || !device.type) {
      throw new Error("Name and type are required.");
    }

    try {
      const id = slugify(device.name, { lower: true });
      const newDevice = await addDocument("Devices", { ...device, id }, id);
      setDevices((prev) => [...prev, newDevice]);
    } catch (err) {
      console.error("Error adding device:", err);
      throw err;
    }
  };

  const updateDevice = async (id, updatedData) => {
    try {
      await updateDocument("Devices", id, updatedData);
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d))
      );
    } catch (err) {
      console.error("Error updating device:", err);
      throw err;
    }
  };

  const deleteDevice = async (id) => {
    try {
      await deleteDocument("Devices", id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting device:", err);
      throw err;
    }
  };

  return { devices, loading, error, addDevice, updateDevice, deleteDevice, setDevices };
};
