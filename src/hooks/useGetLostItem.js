import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function useGetLostItems() {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLostItems = useCallback(async (ownerId) => {
    if (!ownerId) return;
    setLoading(true);
    console.log("ownerId passed:", ownerId);

    setError(null);
    try {
      const response = await api.get("/items/filter/", {
        params: { owner_id: ownerId, status: "lost" },
      });
      setLostItems(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch lost items.");
      setLostItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { lostItems, setLostItems, fetchLostItems, loading, error };
}
