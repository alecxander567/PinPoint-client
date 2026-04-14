import { useEffect, useState } from "react";
import axios from "axios";

const REPORTS_URL = import.meta.env.VITE_API_REPORTS_URL;
const ITEMS_URL = import.meta.env.VITE_API_ITEMS_URL;

const reportsApi = axios.create({ baseURL: REPORTS_URL });
const itemsApi = axios.create({ baseURL: ITEMS_URL });

const initialForm = {
  landmarkImage: null,
  location: "",
  message: "",
};

export function useFoundItemReport(itemId) {
  const [item, setItem] = useState(null);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    const response = await itemsApi.get(`/${itemId}/`);
    setItem(response.data);
    return response.data;
  };

  const fetchReports = async () => {
    const response = await reportsApi.get(`/${itemId}/list/`);
    setReports(response.data.reports || []);
    return response.data.reports || [];
  };

  const load = async () => {
    if (!itemId) {
      setError("Item ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchItem(), fetchReports()]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to load the item report page.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [itemId]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const fillCurrentLocation = async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return { error: "Location access is not available in this browser." };
    }

    setLocating(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      const locationValue = `GPS coordinates: ${latitude}, ${longitude}\nMap: ${mapsUrl}`;

      setForm((current) => ({ ...current, location: locationValue }));
      return { ok: true, location: locationValue };
    } catch (err) {
      let message = "Unable to get your current location.";
      if (err?.code === 1) message = "Location permission was denied.";
      if (err?.code === 2) message = "Your location could not be determined.";
      if (err?.code === 3) message = "Location request timed out.";
      return { error: message };
    } finally {
      setLocating(false);
    }
  };

  const submitReport = async () => {
    const trimmedLocation = form.location.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedLocation || !trimmedMessage) {
      return { error: "Location and message are required." };
    }

    if (!form.landmarkImage) {
      return { error: "Upload a landmark image before submitting." };
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("item_id", itemId);
      payload.append("location", trimmedLocation);
      payload.append("message", trimmedMessage);
      payload.append("landmark_image", form.landmarkImage);

      const response = await api.post("/submit/", payload);
      setForm(initialForm);
      await fetchReports();
      return { ok: true, data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to submit the report.";
      return { error: message };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    item,
    reports,
    form,
    loading,
    submitting,
    locating,
    error,
    updateField,
    fillCurrentLocation,
    submitReport,
    reload: load,
  };
}

export function usePublicReport(token) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        setError("Missing report link.");
        setReport(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/reports/public/${encodeURIComponent(token)}/`,
        );
        if (!cancelled) {
          setReport(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.error ||
            err.response?.data?.detail ||
            err.message ||
            "Unable to load this report.";
          setError(message);
          setReport(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { report, loading, error };
}

export function useGetOwnerReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchOwnerReports = async (ownerId) => {
    if (!ownerId) {
      setError("owner_id is required");
      setReports([]);
      return { error: "owner_id is required" };
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/list/", {
        params: { owner_id: ownerId },
      });
      setReports(response.data.reports || []);
      return { data: response.data.reports || [] };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to load reports.";
      setError(message);
      setReports([]);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteOwnerReports = async (ownerId, reportIds) => {
    if (!ownerId) {
      return { error: "owner_id is required" };
    }

    if (!reportIds?.length) {
      return { error: "Select at least one report to delete." };
    }

    setDeleting(true);
    try {
      const response = await api.delete("/delete/", {
        data: {
          owner_id: ownerId,
          report_ids: reportIds,
        },
      });
      setReports((current) =>
        current.filter((report) => !reportIds.includes(report.id)),
      );
      return { data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to delete reports.";
      return { error: message };
    } finally {
      setDeleting(false);
    }
  };

  return {
    reports,
    setReports,
    loading,
    deleting,
    error,
    fetchOwnerReports,
    deleteOwnerReports,
  };
}
