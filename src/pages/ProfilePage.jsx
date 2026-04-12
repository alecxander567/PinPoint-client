import { useEffect, useState } from "react";
import { useLogout } from "../hooks/auth";
import {
  useGetProfile,
  useUpdateProfile,
  useUpdatePassword,
  useDeleteAccount,
  useReportBug,
} from "../hooks/useProfile";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import EditProfileModal from "../components/EditProfile";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import { Logo } from "../components/Icons";

function ProfileField({ label, value, editable, onEdit }) {
  return (
    <div className="rounded-2xl p-5 mb-3 bg-white border border-slate-100 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-400 bg-clip-text text-transparent">
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700 truncate">
          {value || <span className="text-slate-400">Not set</span>}
        </p>
        {editable && (
          <button
            onClick={onEdit}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="rounded-2xl p-5 mb-3 bg-slate-50 border border-slate-100">
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-400 bg-clip-text text-transparent">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-500 truncate">
        {value || <span className="text-slate-400">—</span>}
      </p>
    </div>
  );
}

function InitialsAvatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md">
      {initials}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">
      {children}
    </p>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}>
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 bg-white"
        onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-1">
          Delete account
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          This will permanently delete your account and all your data. This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50">
            {loading ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BugReportModal({ isOpen, onClose, onSubmit, loading }) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message);
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
          Report a bug / Send feedback
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          Describe the issue or share your thoughts with us.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the bug or feedback..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-40">
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { logout } = useLogout();

  const { profile, setProfile, fetchProfile, loading } = useGetProfile();
  const { updateProfile, loading: updateLoading } = useUpdateProfile();
  const { updatePassword, loading: passwordLoading } = useUpdatePassword();
  const { deleteAccount, loading: deleteLoading } = useDeleteAccount();
  const { reportBug, loading: bugLoading } = useReportBug();

  const [editModal, setEditModal] = useState({ open: false, field: null });
  const [deleteModal, setDeleteModal] = useState(false);
  const [bugModal, setBugModal] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "success" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const showAlert = (message, type = "success") => setAlert({ message, type });
  const openEdit = (field) => setEditModal({ open: true, field });

  const handleSave = async (value) => {
    if (editModal.field === "password") {
      const result = await updatePassword(value);
      if (result.error) {
        showAlert(result.error, "error");
        return;
      }
      setEditModal({ open: false, field: null });
      showAlert("Password updated successfully.");
      return;
    }

    const payload = { [editModal.field]: value };
    const full = {
      name: profile.name,
      messenger_link: profile.messenger_link || "",
      ...payload,
    };

    const result = await updateProfile(full);
    if (result.error) {
      showAlert(result.error, "error");
      return;
    }

    setProfile((prev) => ({ ...prev, ...payload }));
    if (editModal.field === "name") localStorage.setItem("name", value);
    setEditModal({ open: false, field: null });
    showAlert("Profile updated successfully.");
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.error) {
      showAlert(result.error, "error");
      return;
    }
    logout();
  };

  const handleReportBug = async (message) => {
    const result = await reportBug(message);
    if (result.error) {
      showAlert(result.error, "error");
      return;
    }
    setBugModal(false);
    showAlert("Feedback sent successfully. Thank you!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="profile" onLogout={logout} />

      {/* Mobile topbar */}
      <div
        className="flex items-center justify-between px-4 py-3 lg:hidden"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
        <div className="flex items-center gap-2">
          <Logo size={22} color="white" />
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Item Finder
          </span>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold transition-colors"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
          Logout
        </button>
      </div>

      <main className="flex-1 bg-slate-50">
        {loading ?
          <SkeletonLoader />
        : <div className="max-w-lg mx-auto px-5 py-8 pb-24">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex items-center gap-4">
              <InitialsAvatar name={profile?.name} />
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-slate-800 leading-tight truncate">
                  {profile?.name}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5 truncate">
                  {profile?.email}
                </p>
                {profile?.created_at && (
                  <p className="text-xs text-slate-400 mt-1">
                    Member since {formatDate(profile.created_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Editable fields */}
            <div className="mb-6">
              <SectionLabel>Account info</SectionLabel>
              <ProfileField
                label="Display name"
                value={profile?.name}
                editable
                onEdit={() => openEdit("name")}
              />
              <ProfileField
                label="Messenger link"
                value={profile?.messenger_link}
                editable
                onEdit={() => openEdit("messenger_link")}
              />
              <ProfileField
                label="Password"
                value="••••••••••••"
                editable
                onEdit={() => openEdit("password")}
              />
            </div>

            {/* Read-only fields */}
            <div className="mb-6">
              <SectionLabel>Account details</SectionLabel>
              <ReadOnlyField label="Email address" value={profile?.email} />
              <ReadOnlyField
                label="Member since"
                value={formatDate(profile?.created_at)}
              />
              <ReadOnlyField label="Account ID" value={profile?.id} />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-red-50 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 border border-red-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  Log out
                </span>
              </button>
            </div>

            {/* Danger zone */}
            <div className="mb-6">
              <SectionLabel>Danger zone</SectionLabel>
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-50">
                  <p className="text-sm font-semibold text-slate-700">
                    Delete account
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <div className="px-5 py-3">
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                    Delete my account
                  </button>
                </div>
              </div>
            </div>

            {/* Report bug / Feedback */}
            <div>
              <SectionLabel>Support</SectionLabel>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setBugModal(true)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-50 border border-indigo-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                        stroke="#6366f1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      Report a bug / Send feedback
                    </p>
                    <p className="text-xs text-slate-400">
                      Help us improve by reporting issues or sharing feedback.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        }
      </main>

      <FooterNav activePage="profile" />

      <EditProfileModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, field: null })}
        field={editModal.field}
        currentValue={profile?.[editModal.field]}
        onSave={handleSave}
        loading={updateLoading || passwordLoading}
      />

      <DeleteAccountModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />

      <BugReportModal
        isOpen={bugModal}
        onClose={() => setBugModal(false)}
        onSubmit={handleReportBug}
        loading={bugLoading}
      />

      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "success" })}
      />
    </div>
  );
}
