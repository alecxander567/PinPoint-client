import { PrinterIcon } from "./Icons";

const PrintQRModal = ({ isOpen, onClose, qrCodeUrl, itemName }) => {
  if (!isOpen || !qrCodeUrl) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
        }}
        onClick={onClose}>
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            width: "100%",
            maxWidth: "340px",
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(15,23,42,0.12)",
          }}
          onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
            }}
          />

          <div style={{ padding: "24px 24px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}>
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                  QR Code
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#0f172a",
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                  {itemName}
                </p>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
            </div>

            <div
              id="printable-area"
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "16px",
              }}>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                style={{
                  width: "180px",
                  height: "180px",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
              <p
                style={{
                  margin: "12px 0 0",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "13px",
                  color: "#64748b",
                }}>
                Scan to report this item
              </p>
            </div>

            <p
              style={{
                margin: "0 0 16px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "12px",
                color: "#94a3b8",
                textAlign: "center",
                lineHeight: 1.5,
              }}>
              Print and attach this QR code to your item so finders can report
              it.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => window.print()}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1d4ed8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2563eb")
                }>
                <PrinterIcon />
                Print now
              </button>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#64748b",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
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
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: fixed;
            left: 50%;
            top: 40px;
            transform: translateX(-50%);
            padding: 25px;
            border: 2px solid #e2e8f0 !important;
            border-radius: 16px;
          }
        }
        @media (max-width: 480px) {
          #printable-area img { width: 160px !important; height: 160px !important; }
        }
      `}</style>
    </>
  );
};

export default PrintQRModal;
