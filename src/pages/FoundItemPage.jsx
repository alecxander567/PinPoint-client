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
