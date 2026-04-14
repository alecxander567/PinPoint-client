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
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <section
          className="rounded-3xl overflow-hidden mb-5"
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}>
          <div className="relative px-6 py-7 overflow-hidden">
            {/* Decorative circles */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 300,
                height: 300,
                top: -80,
                right: -80,
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 180,
                height: 180,
                bottom: -60,
                left: 30,
                background: "rgba(147,197,253,0.1)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative z-10">
              <p
                className="text-[10px] font-bold uppercase tracking-widest m-0"
                style={{
                  color: "#bfdbfe",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                PinPoint
              </p>
              <h1
                className="text-3xl font-extrabold text-white mt-2 m-0 leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Someone reported finding your item
              </h1>
              <p
                className="mt-2 text-sm leading-relaxed m-0"
                style={{
                  color: "#bfdbfe",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Review the details below and contact the finder if it's yours.
              </p>

              {/* Info box */}
              <div
                className="rounded-2xl px-5 py-4 mt-4"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}>
                <p
                  className="text-sm font-bold text-white m-0"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Help return this item faster
                </p>
                <p
                  className="mt-1.5 text-xs leading-relaxed m-0"
                  style={{
                    color: "#bfdbfe",
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                  Upload a clear landmark image and share your current location.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 pb-16 flex flex-col gap-5">
        {/* Item card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center p-6 gap-4">
            {report.item_image_url && (
              <img
                src={report.item_image_url}
                alt={report.item_name}
                className="rounded-2xl object-contain bg-slate-50"
                style={{ width: "100%", maxHeight: "200px" }}
              />
            )}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-0.5">
                Your item
              </p>
              <h2
                className="text-lg font-extrabold text-slate-800"
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
            <div className="px-5 pb-5">
              <img
                src={report.landmark_image_url}
                alt="Landmark"
                className="w-full object-cover rounded-xl"
                style={{ maxHeight: "280px" }}
              />
            </div>
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

        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white text-center no-underline transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
              boxShadow: "0 4px 14px rgba(29,78,216,0.3)",
              fontFamily: "'Poppins', sans-serif",
              display: "block",
            }}>
            Log in to Mark as Resolved
          </a>

          <button
            onClick={() => window.close()}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-slate-600 text-center transition-colors hover:bg-slate-100"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
