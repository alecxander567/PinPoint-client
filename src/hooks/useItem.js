import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function useAddItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = async ({
    owner_id,
    name,
    description,
    owner_fb_account_url,
    image,
  }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("owner_id", owner_id);
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("owner_fb_account_url", owner_fb_account_url || "");
      formData.append("image", image);
      const response = await api.post("/items/add/", formData);
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
      const response = await api.get("/items/list/", {
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

  return { items, setItems, fetchUserItems, loading, error };
}

export function useEditItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editItem = async (
    item_id,
    { name, description, owner_fb_account_url, image },
  ) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (description !== undefined)
        formData.append("description", description);
      if (owner_fb_account_url !== undefined)
        formData.append("owner_fb_account_url", owner_fb_account_url);
      if (image) formData.append("image", image);

      const response = await api.put(`/items/${item_id}/update/`, formData);
      return { data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to update item.";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { editItem, loading, error };
}

export function useDeleteItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteItem = async (item_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/items/${item_id}/delete/`);
      return { data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete item.";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}
