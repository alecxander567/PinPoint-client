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

const inputClass = `
  w-full px-3 py-2 rounded-xl text-sm text-slate-800
  border border-slate-200 bg-slate-50
  font-[Nunito,sans-serif] outline-none
  transition-all duration-150
  focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
`;

const labelClass = `
  block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1
  font-[Poppins,sans-serif]
`;

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
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
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
        className="w-full flex flex-col overflow-hidden rounded-2xl bg-white"
        style={{
          maxWidth: "440px",
          maxHeight: "90vh",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "transform 0.26s",
        }}>
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
          }}>
          <div>
            <h2
              className="text-base font-extrabold text-white m-0 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Edit Item
            </h2>
            <p
              className="text-[11px] mt-0.5 m-0"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              Update the details below
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-7 h-7 rounded-full text-white text-sm transition-colors"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
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

        <div className="flex flex-col gap-4 px-5 py-4 overflow-y-auto flex-1">
          <div>
            <label className={labelClass}>Item Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) =>
                dispatch({ type: "SET_NAME", payload: e.target.value })
              }
              placeholder="e.g. Black Wallet"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Facebook Account URL</label>
            <input
              type="url"
              value={formState.owner_fb_account_url}
              onChange={(e) =>
                dispatch({ type: "SET_FB_URL", payload: e.target.value })
              }
              placeholder="https://facebook.com/profile"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              value={formState.description}
              onChange={(e) =>
                dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
              }
              placeholder="Add a short description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-3 cursor-pointer transition-all"
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
                  className="max-h-20 max-w-full object-contain rounded-lg"
                />
              )}
              <p
                className="text-xs text-slate-400 m-0"
                style={{ fontFamily: "'Nunito', sans-serif" }}>
                {formState.imageFile ?
                  formState.imageFile.name
                : "Click to change photo"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {formState.error && (
            <div
              className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-500"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              {formState.error}
            </div>
          )}
        </div>

        <div className="flex gap-2.5 px-5 py-4 border-t border-slate-100 flex-shrink-0 bg-white">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white transition-colors hover:bg-slate-50 hover:border-slate-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
              boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.88";
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
