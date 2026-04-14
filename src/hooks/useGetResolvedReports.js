import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_REPORTS_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function useGetResolvedReports() {
  const [resolvedReports, setResolvedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResolvedReports = useCallback(async (ownerId) => {
    if (!ownerId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/resolved/", {
        params: { owner_id: ownerId },
      });
      setResolvedReports(response.data.reports || []);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch resolved reports.",
      );
      setResolvedReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resolvedReports,
    setResolvedReports,
    fetchResolvedReports,
    loading,
    error,
  };
}
