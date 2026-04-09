import { useEffect, useState } from "react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(
      () => {
        setVisible(isOpen);
      },
      isOpen ? 10 : 0,
    );
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.3s",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}>
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "360px",
          margin: "0 auto 0 0",
          marginRight: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "transform 0.3s",
        }}>
        {/* Top accent bar */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg, #ef4444, #f87171)",
          }}
        />

        {/* Body */}
        <div
          style={{
            padding: "32px 28px 24px",
            textAlign: "center",
          }}>
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            style={{
              fontSize: "11px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#f87171",
              marginBottom: "8px",
            }}>
            Confirm Action
          </p>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 10px 0",
            }}>
            Delete item?
          </h2>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.6,
              margin: 0,
            }}>
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: "700", color: "#0f172a" }}>
              "{itemName}"
            </span>
            ? This cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "0 28px 28px",
          }}>
          <button
            onClick={handleClose}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1.5px solid #e2e8f0",
              background: "white",
              color: "#64748b",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.15s",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: loading ? 0.6 : 1,
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.opacity = "1";
            }}>
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
