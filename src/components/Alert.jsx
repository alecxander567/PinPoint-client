import { useEffect, useState } from "react";

export default function Alert({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const isSuccess = type === "success";

  useEffect(() => {
    if (!message) return;
    const showT = setTimeout(() => setVisible(true), 10);
    const hideT = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, [message]);

  if (!message) return null;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.3s",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={handleDismiss}>
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "320px",
          margin: "0 auto 0 0",
          marginRight: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "transform 0.3s",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Top accent bar */}
        <div
          style={{
            height: "4px",
            background:
              isSuccess ?
                "linear-gradient(90deg, #16a34a, #4ade80)"
              : "linear-gradient(90deg, #ef4444, #f87171)",
          }}
        />

        {/* Content */}
        <div
          style={{
            padding: "32px 24px 24px",
            textAlign: "center",
          }}>
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: isSuccess ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
            {isSuccess ?
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            : <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          </div>

          {/* Label */}
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isSuccess ? "#16a34a" : "#ef4444",
              marginBottom: "8px",
            }}>
            {isSuccess ? "Success" : "Error"}
          </p>

          {/* Message */}
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "14px",
              color: "#475569",
              lineHeight: 1.6,
              margin: "0 0 24px 0",
            }}>
            {message}
          </p>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background:
                isSuccess ?
                  "linear-gradient(135deg, #16a34a, #22c55e)"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow:
                isSuccess ?
                  "0 4px 12px rgba(22,163,74,0.3)"
                : "0 4px 12px rgba(239,68,68,0.3)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
