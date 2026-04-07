import { useState } from "react";
import { useLogin } from "../hooks/auth";
import Alert from "../components/Alert";
import "../css/LoginPage.css";

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

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M2 7l10 7 10-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SearchPlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
    <circle cx="15" cy="15" r="9" stroke="white" strokeWidth="2.5" />
    <path
      d="M22 22l6 6"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15 11v8M11 15h8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 11l3 3L22 4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Report lost or found items",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.73 21a2 2 0 01-3.46 0"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Get notified when items match",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
          stroke="white"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
          stroke="white"
          strokeWidth="2"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M14 14h2v2h-2zM18 14h3M14 18h3M18 18h3v3M14 21h2"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "QR code item tagging",
  },
];

function LoginPage() {
  const { login, loading } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result?.error) setAlert({ message: result.error, type: "error" });
  };

  return (
    <div className="login-wrapper">
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-logo-ring">
            <SearchPlusIcon />
          </div>
          <div className="login-badge">
            <span className="login-badge-dot" />
            Community Platform
          </div>
          <h1 className="login-brand-title">Item Finder</h1>
          <p className="login-brand-desc">
            The smartest way to find and report lost items in your community.
          </p>
          <div className="login-features">
            {features.map((f) => (
              <div key={f.label} className="login-feature-item">
                <div className="login-feature-icon">{f.icon}</div>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-right-inner">
          <div className="login-form-header">
            <p className="login-form-eyebrow">Welcome back</p>
            <h2 className="login-form-title">Sign in to your account</h2>
            <p className="login-form-subtitle">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="login-field">
              <label>Email address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  onChange={handleChange}
                  required
                  className="login-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-row">
                <label>Password</label>
                <a href="/forgot-password" className="login-forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <LockIcon />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  onChange={handleChange}
                  required
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn">
                  {showPassword ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn">
              {loading ?
                <span className="login-btn-loading">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="login-spinner">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in...
                </span>
              : "Sign in"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
