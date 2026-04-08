import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddItem } from "../hooks/useItem";
import Alert from "../components/Alert";
import { Logo, QrIcon } from "../components/Icons";
import PrintQRModal from "../components/PrintQRModal";

const BackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <polyline
      points="17 8 12 3 7 8"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="3"
      x2="12"
      y2="15"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

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

function AddItemPage() {
  const navigate = useNavigate();
  const { addItem, loading } = useAddItem();

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [success, setSuccess] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);

  const owner_id = localStorage.getItem("user_id");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setAlert({
        message: "Please upload an image of the item.",
        type: "error",
      });
      return;
    }

    const result = await addItem({
      owner_id,
      name: form.name,
      description: form.description,
      image: imageFile,
    });

    if (result?.error) {
      setAlert({ message: result.error, type: "error" });
    } else {
      setSuccess(result.data);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "48px 40px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            maxWidth: "440px",
            width: "100%",
            textAlign: "center",
          }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CheckIcon />
          </div>

          <h2
            style={{
              fontSize: "28px",
              marginBottom: "12px",
              color: "#0f172a",
            }}>
            Item Registered!
          </h2>
          <p style={{ color: "#64748b", marginBottom: "32px" }}>
            <strong>{success.name}</strong> has been registered successfully.
          </p>

          {success.qr_code_url && (
            <div style={{ marginBottom: "32px" }}>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#64748b",
                  marginBottom: "12px",
                }}>
                <QrIcon /> Your item's QR code
              </p>
              <img
                src={success.qr_code_url}
                alt="QR"
                style={{
                  width: "160px",
                  height: "160px",
                  margin: "0 auto",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "8px",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}>
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "12px 24px",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#64748b",
              }}>
              Back to Home
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              style={{
                padding: "12px 24px",
                background: "#2563eb",
                color: "white",
                borderRadius: "12px",
                fontWeight: "600",
              }}>
              🖨️ Print QR Code
            </button>
            <button
              onClick={() => {
                setSuccess(null);
                setForm({ name: "", description: "" });
                setImageFile(null);
                setPreview(null);
              }}
              style={{
                padding: "12px 24px",
                background: "#2563eb",
                color: "white",
                borderRadius: "12px",
                fontWeight: "600",
              }}>
              Register Another
            </button>
          </div>
        </div>

        <PrintQRModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          qrCodeUrl={success?.qr_code_url}
          itemName={success?.name}
        />
      </div>
    );
  }

  // Main Form
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Logo />
            <span
              style={{ fontSize: "22px", fontWeight: "600", color: "#1e3a8a" }}>
              Item Finder
            </span>
          </div>
          <button
            onClick={() => navigate("/home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              color: "#64748b",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}>
            <BackIcon /> Back
          </button>
        </div>
      </nav>

      <div
        style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "32px", color: "#0f172a", marginBottom: "8px" }}>
          Register an Item
        </h1>
        <p style={{ color: "#64748b", marginBottom: "40px" }}>
          Add your item to generate a QR code for easy recovery.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Image Upload */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}>
              Item Photo
            </label>
            <div
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${
                  dragOver ? "#3b82f6"
                  : preview ? "#22c55e"
                  : "#cbd5e1"
                }`,
                borderRadius: "16px",
                minHeight: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  dragOver ? "#eff6ff"
                  : preview ? "#f0fdf4"
                  : "#f8fafc",
                cursor: "pointer",
                overflow: "hidden",
              }}>
              {preview ?
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              : <div style={{ textAlign: "center", padding: "32px" }}>
                  <UploadIcon />
                  <p
                    style={{
                      marginTop: "16px",
                      color: "#475569",
                      fontWeight: "500",
                    }}>
                    Click or drag photo here
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}>
                    PNG, JPG, WEBP • Max 10MB
                  </p>
                </div>
              }
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Name & Description */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}>
              Item Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Blue Umbrella..."
              style={{
                width: "100%",
                padding: "16px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Color, brand, serial number..."
              style={{
                width: "100%",
                padding: "16px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "12px",
                resize: "vertical",
                fontSize: "16px",
              }}
            />
          </div>

          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              gap: "16px",
            }}>
            <QrIcon />
            <p style={{ color: "#1e40af", lineHeight: "1.5" }}>
              A unique QR code will be generated. Print it and attach it to the
              item.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "18px",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              fontWeight: "700",
              fontSize: "17px",
              borderRadius: "14px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Registering..." : "Register & Generate QR Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
