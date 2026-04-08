import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

      const token = localStorage.getItem("access");

      const response = await fetch(`${BASE_URL}/api/items/add/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — fetch sets it automatically with the correct boundary for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || data?.detail || "Failed to add item.";
        setError(message);
        return { error: message };
      }

      return { data };
    } catch {
      const message = "Network error. Please check your connection.";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error };
}
