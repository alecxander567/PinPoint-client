import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useAddItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = async ({ owner_id, name, description, image }) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("owner_id", owner_id);
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("image", image);

      const response = await api.post("/api/items/add/", formData);

      return { data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to add item.";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error };
}

export function useGetUserItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserItems = async (owner_id) => {
    if (!owner_id) {
      setError("owner_id is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/items/list/", {
        params: { owner_id },
      });

      setItems(response.data.items || []);
      return { data: response.data.items };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to fetch items.";
      setError(message);
      setItems([]);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { items, fetchUserItems, loading, error };
}
