import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddItem } from "../hooks/useItem";
import Alert from "../components/Alert";
import { Logo, QrIcon } from "../components/Icons";
import ItemSuccessModal from "../components/ItemSuccessModal";

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

function AddItemPage() {
  const navigate = useNavigate();
  const { addItem, loading } = useAddItem();

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [success, setSuccess] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    description: "",
    owner_fb_account_url: "",
  });
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
    if (!form.owner_fb_account_url.trim()) {
      setAlert({
        message:
          "Please provide your Facebook account URL so the finder can contact you.",
        type: "error",
      });
      return;
    }

    const result = await addItem({
      owner_id,
      name: form.name,
      description: form.description,
      owner_fb_account_url: form.owner_fb_account_url,
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
      <ItemSuccessModal
        success={success}
        onRegisterAnother={() => {
          setSuccess(null);
          setForm({ name: "", description: "", owner_fb_account_url: "" });
          setImageFile(null);
          setPreview(null);
        }}
      />
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

      {/* Simple Navbar */}
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
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}>
            <BackIcon /> Back
          </button>
        </div>
      </nav>

      {/* Form Container */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "40px 20px 40px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "8px",
          }}>
          Register an Item
        </h1>
        <p
          style={{
            color: "#64748b",
            marginBottom: "32px",
            fontSize: "15px",
          }}>
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
                marginBottom: "12px",
                fontWeight: "600",
                color: "#0f172a",
                fontSize: "15px",
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
                  dragOver ? "#2563eb"
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
                  : "white",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.2s",
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
                      color: "#0f172a",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}>
                    Click or drag photo here
                  </p>
                  <p
                    style={{
                      color: "#64748b",
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

          {/* Item Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "600",
                color: "#0f172a",
                fontSize: "15px",
              }}>
              Item Name {/* <span style={{ color: "#f87171" }}>*</span> */}
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Blue Backpack"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                fontFamily: "inherit",
                color: "#0f172a",
                background: "white",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Facebook Account URL */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "600",
                color: "#0f172a",
                fontSize: "15px",
              }}>
              My Facebook Account URL
            </label>
            <input
              type="url"
              name="owner_fb_account_url"
              required
              value={form.owner_fb_account_url}
              onChange={handleChange}
              placeholder="e.g., https://facebook.com/yourprofile"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                fontFamily: "inherit",
                color: "#0f172a",
                background: "white",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Item Description */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "600",
                color: "#0f172a",
                fontSize: "15px",
              }}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add details about your item..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                fontFamily: "inherit",
                color: "#0f172a",
                minHeight: "120px",
                background: "white",
                resize: "vertical",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Info Box */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(29,78,216,0.08) 100%)",
              border: "1px solid rgba(37,99,235,0.2)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}>
            <QrIcon style={{ marginTop: "2px", flexShrink: 0 }} />
            <p
              style={{
                color: "#1e3a8a",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "15px",
              }}>
              A unique QR code will be generated. Print it and attach it to your
              item for easy recovery if lost.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 24px",
              background:
                loading ? "#cbd5e1" : (
                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                ),
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(37,99,235,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}>
            {loading ? "Registering..." : "Register Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
