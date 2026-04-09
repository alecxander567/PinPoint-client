import { useState, useEffect, useRef, useReducer } from "react";
import { useEditItem } from "../hooks/useItem";

const initialFormState = {
  name: "",
  description: "",
  owner_fb_account_url: "",
  imageFile: null,
  imagePreview: null,
  error: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return {
        ...initialFormState,
        name: action.payload.name || "",
        description: action.payload.description || "",
        imagePreview: action.payload.imagePreview || null,
      };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_FB_URL":
      return { ...state, owner_fb_account_url: action.payload };
    case "SET_IMAGE_FILE":
      return { ...state, imageFile: action.payload };
    case "SET_IMAGE_PREVIEW":
      return { ...state, imagePreview: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function EditItemModal({ isOpen, onClose, item, onSaved }) {
  const { editItem, loading } = useEditItem();
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && item) {
      dispatch({
        type: "RESET",
        payload: {
          name: item.name || "",
          description: item.description || "",
          owner_fb_account_url: item.owner_fb_account_url || "",
          imagePreview: item.image_url || null,
        },
      });
    }
  }, [isOpen, item]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch({ type: "SET_IMAGE_FILE", payload: file });
    dispatch({ type: "SET_IMAGE_PREVIEW", payload: URL.createObjectURL(file) });
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Item name is required." });
      return;
    }
    if (!formState.owner_fb_account_url.trim()) {
      dispatch({
        type: "SET_ERROR",
        payload: "Facebook account URL is required.",
      });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: "" });

    const result = await editItem(item.id, {
      name: formState.name.trim(),
      description: formState.description.trim(),
      owner_fb_account_url: formState.owner_fb_account_url.trim(),
      image: formState.imageFile || undefined,
    });

    if (result.error) {
      dispatch({ type: "SET_ERROR", payload: result.error });
      return;
    }
    onSaved(result.data);
    handleClose();
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  const currentImage = formState.imagePreview || item?.image_url;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 20px",
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
          maxWidth: "800px",
          margin: "0 auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "transform 0.3s",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
          <div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "18px",
                fontWeight: "800",
                color: "white",
                margin: "0 0 2px 0",
              }}>
              Edit Item
            </h2>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                margin: 0,
              }}>
              Update the details below
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }>
            ✕
          </button>
        </div>

        {/* Body - Scrollable */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            overflowY: "auto",
            flex: 1,
          }}>
          {/* Two Column Row: Name and Facebook URL */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}>
            {/* Item Name */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}>
                Item Name
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
                placeholder="e.g. Black Wallet"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "14px",
                  color: "#0f172a",
                  outline: "none",
                  transition: "all 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59,130,246,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Facebook Account URL */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}>
                Facebook Account URL
              </label>
              <input
                type="url"
                required
                value={formState.owner_fb_account_url}
                onChange={(e) =>
                  dispatch({ type: "SET_FB_URL", payload: e.target.value })
                }
                placeholder="https://facebook.com/profile"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "14px",
                  color: "#0f172a",
                  outline: "none",
                  transition: "all 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59,130,246,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: "6px",
              }}>
              Description
            </label>
            <textarea
              rows={3}
              value={formState.description}
              onChange={(e) =>
                dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
              }
              placeholder="Add a short description..."
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "14px",
                color: "#0f172a",
                outline: "none",
                resize: "none",
                transition: "all 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59,130,246,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Photo */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: "6px",
              }}>
              Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #e2e8f0",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "transparent";
              }}>
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Preview"
                  style={{
                    maxHeight: "120px",
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
              )}
              <p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                }}>
                {formState.imageFile ?
                  formState.imageFile.name
                : "Click to change photo"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Error */}
          {formState.error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "10px 14px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                color: "#ef4444",
              }}>
              {formState.error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "16px 24px 24px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "white",
            flexShrink: 0,
          }}>
          <button
            onClick={handleClose}
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
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: loading ? 0.6 : 1,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.opacity = "1";
            }}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
