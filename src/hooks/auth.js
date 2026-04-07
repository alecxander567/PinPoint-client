import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/users";

export function useSignup() {
  const [loading, setLoading] = useState(false);

  const signup = async (form) => {
    if (form.password !== form.confirm_password) {
      return { error: "Passwords do not match" };
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/signup/`, {
        name: `${form.first_name} ${form.last_name}`,
        email: form.email,
        password: form.password,
      });
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.error || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
}

export function useLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (form) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/login/`, {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("name", res.data.name);
      navigate("/home");
      return { success: true };
    } catch (err) {
      return {
        error: err.response?.data?.error || "Invalid email or password",
      };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return { logout };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/forgot-password/`, { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, sent, error };
}

export function useResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPassword = async (token, password) => {
    setLoading(true);
    setError("");

    if (!token) {
      const msg = "Missing reset token.";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }

    let cleanToken = token.trim();

    if (cleanToken.startsWith("3D")) {
      cleanToken = cleanToken.substring(2);
    }
    cleanToken = cleanToken.replace(/=3D/g, "=");
    cleanToken = cleanToken.replace(/=/g, "");

    try {
      await axios.post(`${API_URL}/reset-password/`, {
        token: cleanToken,
        password,
      });

      navigate("/login", {
        state: {
          message:
            "Password reset successful. Please log in with your new password.",
        },
      });
      return { success: true };
    } catch (err) {
      console.error("Reset failed - Full server response:", err.response?.data);
      console.error("Status:", err.response?.status);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Something went wrong. Please try again.";

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
}
