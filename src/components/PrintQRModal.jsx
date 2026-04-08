import { QrIcon, PrinterIcon } from "./Icons";

const PrintQRModal = ({ isOpen, onClose, qrCodeUrl, itemName }) => {
  if (!isOpen || !qrCodeUrl) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
        }}>
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px 24px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            maxHeight: "92vh",
            overflowY: "auto",
          }}>
          <h3
            style={{
              fontSize: "22px",
              marginBottom: "20px",
              color: "#0f172a",
            }}>
            Print QR Code
          </h3>

          {/* Printable Area */}
          <div
            id="printable-area"
            style={{
              margin: "0 auto 24px",
              padding: "20px",
              border: "3px solid #e2e8f0",
              borderRadius: "16px",
              background: "white",
              width: "fit-content",
            }}>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{ width: "220px", height: "220px", display: "block" }}
            />
            <p
              style={{
                marginTop: "16px",
                fontWeight: "600",
                fontSize: "16px",
                color: "#0f172a",
              }}>
              {itemName}
            </p>
          </div>

          <p
            style={{
              color: "#64748b",
              marginBottom: "28px",
              fontSize: "14.5px",
            }}>
            Print this and attach it to your item
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                background: "white",
              }}>
              Close
            </button>

            <button
              onClick={handlePrint}
              style={{
                flex: 1,
                padding: "14px",
                background: "#2563eb",
                color: "white",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}>
              <PrinterIcon />
              Print Now
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-area, #printable-area * { visibility: visible; }
            #printable-area {
              position: fixed;
              left: 50%;
              top: 40px;
              transform: translateX(-50%);
              padding: 25px;
              border: 4px solid #e2e8f0 !important;
            }
          }

          @media (max-width: 480px) {
            #printable-area img {
              width: 200px !important;
              height: 200px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default PrintQRModal;
