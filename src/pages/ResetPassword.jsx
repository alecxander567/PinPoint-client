import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResetPassword } from "../hooks/auth";
import Alert from "../components/Alert"; 

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 1l22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, loading, error: hookError } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setAlert({
        message: "Missing reset token. Please request a new link.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match.", type: "error" });
      return;
    }

    if (password.length < 8) {
      setAlert({
        message: "Password must be at least 8 characters.",
        type: "error",
      });
      return;
    }

    const result = await resetPassword(token, password);

    if (result.success) {
      setIsSuccess(true);
      setAlert({
        message: "Password reset successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    } else {
      setAlert({
        message:
          hookError || "Failed to reset password. The link may have expired.",
        type: "error",
      });
    }
  };

  const clearAlert = () => {
    setAlert({ message: "", type: "" });
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "8px",
            }}>
            Invalid reset link
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            This password reset link is missing or malformed. Please request a
            new one.
          </p>
          <a
            href="/forgot-password"
            style={{
              color: "#2563eb",
              marginTop: "20px",
              display: "inline-block",
            }}>
            Request new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* Your Alert Component */}
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      <div style={{ width: "100%", maxWidth: "400px", padding: "32px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px",
          }}>
          Set a new password
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
          Choose a strong password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}>
              New password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearAlert();
                }}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 44px 0 14px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}>
                {showPassword ?
                  <EyeOffIcon />
                : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}>
              Confirm new password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearAlert();
                }}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 44px 0 14px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}>
                {showConfirmPassword ?
                  <EyeOffIcon />
                : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isSuccess}
            style={{
              height: "48px",
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading || isSuccess ? "not-allowed" : "pointer",
              marginTop: "8px",
              opacity: loading || isSuccess ? 0.7 : 1,
            }}>
            {loading ?
              "Updating..."
            : isSuccess ?
              "Success!"
            : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
