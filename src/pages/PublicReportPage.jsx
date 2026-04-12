import { Link, useParams } from "react-router-dom";
import { usePublicReport } from "../hooks/useReport";

function mapsUrlFromLocation(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/https:\/\/maps\.google\.com\/\?q=[\d.,-]+/);
  return match ? match[0] : null;
}

function PublicReportPage() {
  const { token } = useParams();
  const { report, loading, error } = usePublicReport(token);
  const mapsUrl = report ? mapsUrlFromLocation(report.location) : null;

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      if (typeof window !== "undefined" && window.document.visibilityState === "visible") {
        window.location.href = "/login";
      }
    }, 200);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
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

      <main className="relative z-[1] flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="text-center mb-6">
            <p className="m-0 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
              Item Finder
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold font-poppins text-slate-800">
              Finder report
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              You can read this report without signing in. Sign in to manage items
              and mark reports resolved.
            </p>
          </div>

          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-10 text-center text-slate-500 font-semibold">
              Loading report…
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border border-red-200 rounded-2xl shadow-md p-8 text-center">
              <p className="m-0 text-red-600 font-semibold">{error}</p>
              <p className="mt-3 text-sm text-slate-500">
                The link may be wrong or expired. Ask the finder for an updated link.
              </p>
            </div>
          )}

          {!loading && !error && report && (
            <article className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <p className="m-0 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                  {report.item_name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold font-poppins text-slate-800 m-0">
                    Report details
                  </h2>
                  {report.is_resolved ?
                    <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Resolved
                    </span>
                  : <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      Open
                    </span>}
                </div>
                <p className="mt-2 text-sm text-slate-500 font-semibold">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>

              {report.item_image_url && (
                <div className="px-5 pt-5">
                  <p className="mb-2 text-xs font-extrabold uppercase text-slate-500">
                    Your item
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center">
                    <img
                      src={report.item_image_url}
                      alt={report.item_name}
                      className="w-full h-40 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {report.landmark_image_url && (
                <div className="px-5 pt-5">
                  <p className="mb-2 text-xs font-extrabold uppercase text-slate-500">
                    Landmark
                  </p>
                  <img
                    src={report.landmark_image_url}
                    alt="Landmark"
                    className="w-full h-52 object-cover rounded-xl bg-slate-50"
                  />
                </div>
              )}

              <div className="px-5 pb-6 pt-4">
                <div className="grid gap-3 mb-2">
                  <div>
                    <p className="m-0 text-xs font-extrabold uppercase text-slate-500">
                      Location
                    </p>
                    <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-auto">
                      {report.location}
                    </p>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-600">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        View on Google Maps
                      </a>
                    )}
                  </div>
                  <div>
                    <p className="m-0 text-xs font-extrabold uppercase text-slate-500">
                      Message
                    </p>
                    <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-auto">
                      {report.message}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold font-nunito hover:bg-indigo-500 shadow-sm transition text-center">
              Log in
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-bold font-nunito hover:bg-slate-50 transition">
              Close
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            If Close does nothing, your browser may block closing this tab. Close the
            tab manually or use Log in.
          </p>
        </div>
      </main>
    </div>
  );
}

export default PublicReportPage;
