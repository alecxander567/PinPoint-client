import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/auth";
import Alert from "../components/Alert";
import "../css/SignupPage.css";

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

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
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

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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

function SignupPage() {
  const { signup, loading } = useSignup();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(form);
    if (result?.success) {
      setAlert({ message: "Account created successfully!", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } else if (result?.error) {
      setAlert({ message: result.error, type: "error" });
    }
  };

  return (
    <div className="signup-wrapper">
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      {/* Left Panel */}
      <div className="signup-left">
        <div className="signup-left-inner">
          <div className="signup-logo-ring">
            <SearchPlusIcon />
          </div>
          <div className="signup-badge">
            <span className="signup-badge-dot" />
            Community Platform
          </div>
          <h1 className="signup-brand-title">Item Finder</h1>
          <p className="signup-brand-desc">
            The smartest way to find and report lost items in your community.
          </p>
          <div className="signup-features">
            {features.map((f) => (
              <div key={f.label} className="signup-feature-item">
                <div className="signup-feature-icon">{f.icon}</div>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="signup-right">
        <div className="signup-right-inner">
          <div className="signup-form-header">
            <p className="signup-form-eyebrow">Get started</p>
            <h2 className="signup-form-title">Create your account</h2>
            <p className="signup-form-subtitle">
              Join Item Finder and never lose track again
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Row */}
            <div className="signup-name-row">
              <div className="signup-field">
                <label>First name</label>
                <div className="signup-input-wrap">
                  <span className="signup-input-icon">
                    <UserIcon />
                  </span>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="Juan"
                    onChange={handleChange}
                    required
                    className="signup-input"
                  />
                </div>
              </div>
              <div className="signup-field">
                <label>Last name</label>
                <div className="signup-input-wrap">
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Dela Cruz"
                    onChange={handleChange}
                    required
                    className="signup-input signup-input-no-icon"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="signup-field">
              <label>Email address</label>
              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="signup-field">
              <label>Password</label>
              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  <LockIcon />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="signup-eye-btn">
                  {showPassword ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="signup-field">
              <label>Confirm password</label>
              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  <LockIcon />
                </span>
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  onChange={handleChange}
                  required
                  className="signup-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="signup-eye-btn">
                  {showConfirmPassword ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="signup-trust-badge">
              <ShieldIcon />
              Your data is safe and encrypted
            </div>

            <button
              type="submit"
              disabled={loading}
              className="signup-submit-btn">
              {loading ?
                <span className="signup-btn-loading">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="signup-spinner">
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
                  Creating account...
                </span>
              : "Create account"}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
