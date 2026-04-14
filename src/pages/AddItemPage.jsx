import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddItem } from "../hooks/useItem";
import Alert from "../components/Alert";
import { Logo, QrIcon } from "../components/Icons";
import ItemSuccessModal from "../components/ItemSuccessModal";

const BackIcon = () => (
  <svg
    width="16"
    height="16"
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
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      stroke="#93c5fd"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <polyline
      points="17 8 12 3 7 8"
      stroke="#93c5fd"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="3"
      x2="12"
      y2="15"
      stroke="#93c5fd"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const labelClass =
  "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";
const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm text-slate-800
  border border-slate-200 bg-slate-50
  outline-none transition-all duration-150
  focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
`;

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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f8fafc" }}>
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      <nav
        className="sticky top-0 z-50 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.3)",
        }}>
        <div className="max-w-screen-lg mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={18} color="white" />
            <span
              className="text-white font-bold text-base"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              PinPoint
            </span>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }>
            <BackIcon /> Back
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 box-border">
        <div className="mb-7">
          <h1
            className="text-2xl font-extrabold text-slate-900 m-0"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Register an Item
          </h1>
          <p
            className="mt-1.5 text-sm text-slate-500"
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            Add your item to generate a QR code for easy recovery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Item Photo</label>
            <div
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className="relative flex items-center justify-center rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                minHeight: "180px",
                borderColor:
                  dragOver ? "#3b82f6"
                  : preview ? "#22c55e"
                  : "#cbd5e1",
                background:
                  dragOver ? "#eff6ff"
                  : preview ? "#f0fdf4"
                  : "white",
              }}>
              {preview ?
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: "180px" }}
                />
              : <div className="flex flex-col items-center gap-2 py-8 px-6 text-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl mb-1"
                    style={{
                      background: "rgba(29,78,216,0.08)",
                      border: "1px solid rgba(29,78,216,0.15)",
                    }}>
                    <UploadIcon />
                  </div>
                  <p
                    className="text-sm font-semibold text-slate-700 m-0"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Click or drag photo here
                  </p>
                  <p
                    className="text-xs text-slate-400 m-0"
                    style={{ fontFamily: "'Nunito', sans-serif" }}>
                    PNG, JPG, WEBP · Max 10MB
                  </p>
                </div>
              }
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className={labelClass}>Item Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Blue Backpack"
              className={inputClass}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
          </div>

          <div>
            <label className={labelClass}>My Facebook Account URL</label>
            <input
              type="url"
              name="owner_fb_account_url"
              required
              value={form.owner_fb_account_url}
              onChange={handleChange}
              placeholder="https://facebook.com/yourprofile"
              className={inputClass}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add details about your item..."
              className={`${inputClass} resize-none`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
          </div>

          <div
            className="flex gap-3 items-start rounded-2xl px-4 py-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(29,78,216,0.07), rgba(55,48,163,0.07))",
              border: "1px solid rgba(29,78,216,0.18)",
            }}>
            <QrIcon style={{ marginTop: "2px", flexShrink: 0 }} />
            <p
              className="text-xs text-blue-900 leading-relaxed m-0"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              A unique QR code will be generated. Print it and attach it to your
              item for easy recovery if lost.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background:
                loading ? "#cbd5e1" : (
                  "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)"
                ),
              boxShadow: loading ? "none" : "0 4px 14px rgba(29,78,216,0.35)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(29,78,216,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(29,78,216,0.35)";
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
