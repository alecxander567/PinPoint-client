import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReportByToken } from "../hooks/useReportByToken";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportViewPage() {
  const { token } = useParams();
  const { report, loading, error, fetchReport } = useReportByToken(token);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eef5ff 100%)",
        }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eef5ff 100%)",
        }}>
        <div className="bg-white rounded-3xl p-10 text-center max-w-md w-full border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Not found
          </p>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Report unavailable
          </h1>
          <p className="text-sm text-slate-400">
            {error || "This report link is invalid or has expired."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef5ff 52%, #e4efff 100%)",
      }}>
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
        }}>
        <div className="max-w-2xl mx-auto px-5 py-7">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">
            Item Finder
          </p>
          <h1
            className="text-2xl font-extrabold text-white leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Someone reported finding your item
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            Review the details below and contact the finder if it's yours.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 pb-16 flex flex-col gap-5">
        {/* Item card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-5">
            {report.item_image_url && (
              <img
                src={report.item_image_url}
                alt={report.item_name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-100"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-0.5">
                Your item
              </p>
              <h2
                className="text-lg font-extrabold text-slate-800 truncate"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                {report.item_name}
              </h2>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  report.is_resolved ?
                    "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                {report.is_resolved ? "Resolved" : "Pending review"}
              </span>
            </div>
          </div>
        </div>

        {/* Landmark image */}
        {report.landmark_image_url && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                Landmark photo
              </p>
            </div>
            <img
              src={report.landmark_image_url}
              alt="Landmark"
              className="w-full object-cover"
              style={{ maxHeight: "280px" }}
            />
          </div>
        )}

        {/* Report details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">
            Report details
          </p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Location
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {report.location}
            </p>
            {report.location?.includes("maps.google.com") && (
              <a
                href={
                  report.location.match(
                    /https:\/\/maps\.google\.com\/\?q=[\d.,-]+/,
                  )?.[0]
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-bold no-underline"
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#15803d",
                }}>
                View on Google Maps
              </a>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Message from finder
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {report.message}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Reported on
            </p>
            <p className="text-sm text-slate-700">
              {formatDate(report.created_at)}
            </p>
          </div>
        </div>

        {/* Contact button */}
        {report.owner_fb_url && (
          <a
            href={report.owner_fb_url}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white text-center no-underline transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
              boxShadow: "0 4px 14px rgba(29,78,216,0.3)",
              fontFamily: "'Poppins', sans-serif",
              display: "block",
            }}>
            Contact finder on Messenger
          </a>
        )}
      </div>
    </div>
  );
}
