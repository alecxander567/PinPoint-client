import { useState, useCallback } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

export function useGetProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/users/profile/", {
        headers: authHeader(),
      });
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, setProfile, fetchProfile, loading, error };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);

  const updateProfile = async ({ name, messenger_link }) => {
    setLoading(true);
    try {
      const { data } = await api.patch(
        "/users/profile/update/",
        { name, messenger_link },
        { headers: authHeader() },
      );
      return { data };
    } catch (err) {
      return { error: err.response?.data?.error || "Update failed" };
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (newPassword) => {
    setLoading(true);
    try {
      const { data } = await api.patch(
        "/users/profile/update/",
        { password: newPassword },
        { headers: authHeader() },
      );
      return { data };
    } catch (err) {
      return { error: err.response?.data?.error || "Update failed" };
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading };
}

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const { data } = await api.delete("/users/profile/delete/", {
        headers: authHeader(),
      });
      return { data };
    } catch (err) {
      return { error: err.response?.data?.error || "Failed to delete account" };
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccount, loading };
}

export function useReportBug() {
  const [loading, setLoading] = useState(false);

  const reportBug = async (message) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        "/users/bug-report/",
        { message },
        { headers: authHeader() },
      );
      return { data };
    } catch (err) {
      return { error: err.response?.data?.error || "Failed to submit report" };
    } finally {
      setLoading(false);
    }
  };

  return { reportBug, loading };
}
