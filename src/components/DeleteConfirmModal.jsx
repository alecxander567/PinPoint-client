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
    const t = setTimeout(() => setVisible(isOpen), isOpen ? 10 : 0);
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
      className="fixed inset-0 z-[1500] flex items-center justify-center px-4"
      style={{
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.26s",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}>
      <div
        className="w-full overflow-hidden rounded-2xl bg-white"
        style={{
          maxWidth: "340px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "transform 0.26s",
        }}>
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
          }}>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest m-0"
              style={{ color: "#bfdbfe", fontFamily: "'Poppins', sans-serif" }}>
              Confirm Action
            </p>
            <h2
              className="text-base font-extrabold text-white m-0 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Delete Item
            </h2>
          </div>

          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="#fca5a5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="px-5 py-5 text-center">
          <p
            className="text-sm text-slate-500 leading-relaxed m-0"
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-800">"{itemName}"</span>? This
            cannot be undone.
          </p>
        </div>

        <div className="flex gap-2.5 px-5 pb-5">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white transition-colors hover:bg-slate-50 hover:border-slate-300"
            style={{
              fontFamily: "'Poppins', sans-serif",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.88";
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
