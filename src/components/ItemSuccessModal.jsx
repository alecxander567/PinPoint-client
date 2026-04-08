import { useNavigate } from "react-router-dom";
import { QrIcon } from "./Icons";
import PrintQRModal from "./PrintQRModal";
import { useState } from "react";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ItemSuccessModal = ({ success, onRegisterAnother }) => {
  const navigate = useNavigate();
  const [showPrintModal, setShowPrintModal] = useState(false);

  const btnStyle = {
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}>
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px 24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
          }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CheckIcon />
          </div>

          <h2
            style={{ fontSize: "24px", marginBottom: "8px", color: "#0f172a" }}>
            Item Registered!
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "20px",
              fontSize: "14px",
            }}>
            <strong>{success.name}</strong> is ready to go.
          </p>

          {success.qr_code_url && (
            <div style={{ marginBottom: "20px" }}>
              <img
                src={success.qr_code_url}
                alt="QR"
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "6px",
                }}
              />
            </div>
          )}

          <button
            onClick={() => setShowPrintModal(true)}
            style={{
              ...btnStyle,
              width: "100%",
              background: "#2563eb",
              color: "white",
              marginBottom: "12px",
            }}>
            🖨️ Print QR Code
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/home")}
              style={{
                ...btnStyle,
                flex: 1,
                background: "white",
                color: "#64748b",
                border: "1px solid #e2e8f0",
              }}>
              Back
            </button>
            <button
              onClick={onRegisterAnother}
              style={{
                ...btnStyle,
                flex: 1,
                background: "#2563eb",
                color: "white",
              }}>
              + Add
            </button>
          </div>
        </div>
      </div>

      <PrintQRModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        qrCodeUrl={success?.qr_code_url}
        itemName={success?.name}
      />
    </>
  );
};

export default ItemSuccessModal;
