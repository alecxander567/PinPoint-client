import { useForgotPassword } from "../hooks/auth";

function ForgotPasswordPage() {
  const { forgotPassword, loading, sent, error } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    await forgotPassword(email);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "8px",
            }}>
            Check your email
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
            If that email is registered, we've sent a password reset link. Click
            the link in the email to reset your password.
          </p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              marginTop: "24px",
              fontSize: "14px",
              color: "#2563eb",
              fontWeight: 600,
            }}>
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div style={{ width: "100%", maxWidth: "400px", padding: "32px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px",
          }}>
          Forgot your password?
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
          Enter your email and we'll send you a reset link.
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              color: "#dc2626",
              fontSize: "13px",
              marginBottom: "16px",
            }}>
            {error}
          </div>
        )}

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
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="juan@email.com"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              height: "48px",
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
            marginTop: "24px",
          }}>
          Remember your password?{" "}
          <a href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
