import { useState, useEffect } from "react";

export default function EditProfileModal({
  isOpen,
  onClose,
  field,
  currentValue,
  onSave,
  loading,
}) {
  const [value, setValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isPassword = field === "password";

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setValue(currentValue || "");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const labels = {
    name: "Display name",
    messenger_link: "Messenger link",
    password: "Password",
  };

  const placeholders = {
    name: "Your full name",
    messenger_link: "https://m.me/yourname",
  };

  const handleSubmit = () => {
    if (isPassword) {
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      onSave(newPassword);
    } else {
      onSave(value);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}>
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 bg-white"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-bold text-slate-800 mb-1">
          Edit {labels[field]}
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          {isPassword ?
            "Enter your new password below."
          : `Update your ${labels[field]?.toLowerCase()} below.`}
        </p>

        {isPassword ?
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              placeholder="New password"
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              autoFocus
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>
        : <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholders[field]}
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            autoFocus
          />
        }

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              (isPassword ? !newPassword || !confirmPassword : !value.trim())
            }
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-40">
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
