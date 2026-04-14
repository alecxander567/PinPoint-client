import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export function useResolveReport() {
  const [resolvingId, setResolvingId] = useState(null);

  const resolveReport = async (reportId) => {
    setResolvingId(reportId);
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}/resolve/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || "Failed to resolve report" };
      }

      const data = await response.json();
      return { item_status: data.item_status, message: data.message };
    } catch {
      return { error: "Network error. Please try again." };
    } finally {
      setResolvingId(null);
    }
  };

  return { resolveReport, resolvingId };
}
