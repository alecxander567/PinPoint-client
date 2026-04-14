import { useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import FoundItemReport from "../components/FoundItemReport";
import { useFoundItemReport } from "../hooks/useReport";

function getMessengerUrl(facebookUrl) {
  if (!facebookUrl) return "";
  try {
    const url = new URL(facebookUrl);
    const rawPath = url.pathname.replace(/^\/+|\/+$/g, "");
    const firstSegment = rawPath.split("/")[0];
    if (
      firstSegment &&
      !["profile.php", "people", "pg", "share", "groups"].includes(firstSegment)
    ) {
      return `https://m.me/${firstSegment}`;
    }
    return facebookUrl;
  } catch {
    return facebookUrl;
  }
}

// ✅ Success modal shown after submission
function SuccessModal({ itemName, reportViewUrl, messengerUrl, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportViewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 flex flex-col items-center text-center gap-4">
        {/* Success icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h2
            className="text-xl font-extrabold text-slate-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Report Submitted!
          </h2>
          <p
            className="text-sm text-slate-500 mt-1"
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            Send the owner this link so they can view your report for{" "}
            <strong>{itemName}</strong>.
          </p>
        </div>

        {/* Report link */}
        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Report link
          </p>
          <p className="text-xs text-slate-600 break-all leading-relaxed">
            {reportViewUrl}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            fontFamily: "'Poppins', sans-serif",
            background:
              copied ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#f1f5f9",
            color: copied ? "white" : "#334155",
            border: "none",
            cursor: "pointer",
          }}>
          {copied ? "✓ Copied!" : "Copy link"}
        </button>

        {/* Open Messenger button */}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl text-sm font-bold text-white text-center no-underline"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
              boxShadow: "0 4px 14px rgba(29,78,216,0.3)",
              display: "block",
            }}>
            Open Messenger →
          </a>
        )}

        <button
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
          style={{ fontFamily: "'Nunito', sans-serif" }}>
          Close
        </button>
      </div>
    </div>
  );
}

function FoundItemPage() {
  const { itemId } = useParams();
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [successData, setSuccessData] = useState(null); // ✅ holds post-submit data

  const {
    item,
    form,
    loading,
    submitting,
    locating,
    error,
    updateField,
    fillCurrentLocation,
    submitReport,
  } = useFoundItemReport(itemId);

  const handleUseCurrentLocation = async () => {
    const result = await fillCurrentLocation();
    if (result?.error) setAlert({ message: result.error, type: "error" });
  };

  const contactUrl = getMessengerUrl(item?.owner_fb_account_url);

  const handleSubmit = async () => {
    const result = await submitReport();
    if (result?.error) {
      setAlert({ message: result.error, type: "error" });
      return;
    }
    // ✅ Show modal with report link — no popup needed
    setSuccessData({
      reportViewUrl: result.data?.owner_view_url,
      messengerUrl: contactUrl,
      itemName: item?.name,
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef5ff 52%, #e4efff 100%)",
      }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.09) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
      )}

      {/* ✅ Success modal */}
      {successData && (
        <SuccessModal
          itemName={successData.itemName}
          reportViewUrl={successData.reportViewUrl}
          messengerUrl={successData.messengerUrl}
          onClose={() => setSuccessData(null)}
        />
      )}

      <FoundItemReport
        item={item}
        form={form}
        loading={loading}
        submitting={submitting}
        locating={locating}
        error={error}
        contactUrl={contactUrl}
        onChange={updateField}
        onUseCurrentLocation={handleUseCurrentLocation}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default FoundItemPage;
