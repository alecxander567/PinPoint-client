import { useState, useCallback } from "react";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export function useReportByToken(token) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/view/${token}/`);
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.error || "Report not found");
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { report, loading, error, fetchReport };
}
