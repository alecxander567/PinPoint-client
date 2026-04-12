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

function FoundItemPage() {
  const { itemId } = useParams();
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [ownerShareUrl, setOwnerShareUrl] = useState("");
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
    const share = result?.data?.owner_view_url || "";
    setOwnerShareUrl(share);
    setAlert({
      message:
        contactUrl ?
          "Report submitted successfully. Opening the owner's Messenger contact."
        : "Report submitted successfully.",
      type: "success",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef5ff 52%, #e4efff 100%)",
      }}>
      {/* Subtle grid overlay */}
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

      {ownerShareUrl && (
        <div className="relative z-[2] max-w-screen-lg mx-auto px-4 pt-4">
          <div className="rounded-2xl border border-indigo-200 bg-white/95 shadow-md p-4 text-slate-800">
            <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Link for the owner
            </p>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              They can open this page without logging in to read your report.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
              <code className="flex-1 text-xs sm:text-sm break-all rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-slate-800">
                {ownerShareUrl}
              </code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(ownerShareUrl);
                    setAlert({
                      message: "Link copied to clipboard.",
                      type: "success",
                    });
                  } catch {
                    setAlert({
                      message: "Could not copy automatically. Copy the link manually.",
                      type: "error",
                    });
                  }
                }}
                className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500">
                Copy link
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOwnerShareUrl("")}
              className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-700">
              Dismiss
            </button>
          </div>
        </div>
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
