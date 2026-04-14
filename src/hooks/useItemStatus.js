import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export function useToggleItemLost() {
  const [togglingId, setTogglingId] = useState(null);

  const toggleItemLost = async (itemId) => {
    setTogglingId(itemId);
    try {
      const { data } = await axios.patch(
        `${API_BASE}/api/items/${itemId}/toggle-lost/`,
      );
      return { status: data.status };
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to toggle item status";
      return { error: message };
    } finally {
      setTogglingId(null);
    }
  };

  return { toggleItemLost, togglingId };
}
