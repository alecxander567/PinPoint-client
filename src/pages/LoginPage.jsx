import { useState } from "react";
import { useLogin } from "../hooks/auth";
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
  <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
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
    <div className="flex min-h-screen w-full overflow-hidden">
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      <div
        className="hidden lg:flex w-1/2 flex-col justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
        }}>
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 340,
            height: 340,
            top: -90,
            left: -90,
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 420,
            height: 420,
            bottom: -110,
            right: -110,
            background: "rgba(99,102,241,0.18)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220,
            height: 220,
            top: "42%",
            left: "38%",
            background: "rgba(147,197,253,0.12)",
            filter: "blur(48px)",
          }}
        />

        <div className="relative z-10 px-14 py-16 flex flex-col">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl mb-7 flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            <SearchPlusIcon />
          </div>

          <div
            className="flex items-center gap-2 w-fit rounded-full px-4 py-1.5 mb-5"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.8)" }}>
              Community Platform
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            PinPoint
          </h1>

          <p
            className="text-lg leading-relaxed mb-10"
            style={{ color: "#bfdbfe", maxWidth: "22rem" }}>
            The smartest way to find and report lost items in your community.
          </p>

          <div className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                  {f.icon}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#e0e7ff" }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 items-center justify-center px-6 py-12"
        style={{
          background:
            "linear-gradient(155deg, #ffffff 0%, #eff6ff 50%, #eef2ff 100%)",
        }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
              }}>
              <SearchPlusIcon />
            </div>
            <span className="text-xl font-bold text-blue-900">Item Finder</span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-1 text-blue-500">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 flex items-center pointer-events-none">
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ border: "1px solid #dbeafe" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 flex items-center pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ border: "1px solid #dbeafe" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors flex items-center">
                  {showPassword ?
                    <EyeOffIcon />
                  : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{
                background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
              }}>
              {loading ?
                <span className="flex items-center justify-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="animate-spin">
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

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 hover:text-indigo-700 transition-colors">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
