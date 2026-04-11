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

  const colors =
    isSuccess ?
      {
        bar: "#22c55e",
        iconBg: "#f0fdf4",
        iconBorder: "#bbf7d0",
        iconStroke: "#16a34a",
        label: "#16a34a",
        btnBg: "#f0fdf4",
        btnBorder: "#bbf7d0",
        btnText: "#15803d",
      }
    : {
        bar: "#ef4444",
        iconBg: "#fef2f2",
        iconBorder: "#fecaca",
        iconStroke: "#ef4444",
        label: "#ef4444",
        btnBg: "#fef2f2",
        btnBorder: "#fecaca",
        btnText: "#dc2626",
      };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 2000,
        transition: "opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
          overflow: "hidden",
          width: "300px",
        }}>
        {/* Accent bar */}
        <div style={{ height: "3px", background: colors.bar }} />

        <div
          style={{
            padding: "16px 16px 16px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}>
          {/* Icon */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: colors.iconBg,
              border: `1px solid ${colors.iconBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
            {isSuccess ?
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke={colors.iconStroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke={colors.iconStroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: "0 0 3px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
                color: colors.label,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
              {isSuccess ? "Success" : "Error"}
            </p>
            <p
              style={{
                margin: "0 0 12px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                color: "#475569",
                lineHeight: 1.5,
              }}>
              {message}
            </p>
            <button
              onClick={handleDismiss}
              style={{
                width: "100%",
                padding: "7px",
                borderRadius: "8px",
                border: `1px solid ${colors.btnBorder}`,
                background: colors.btnBg,
                color: colors.btnText,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
