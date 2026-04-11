/**
 * ReportCard — displays a single finder report with image, location, message, and resolve button.
 */
function ReportCard({
  report,
  isSelected,
  resolvingId,
  onToggleSelect,
  onResolve,
}) {
  const isResolving = resolvingId === report.id;

  return (
    <article
      className={`bg-white border rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg ${
        isSelected ?
          "outline outline-[3px] outline-indigo-200"
        : "border-slate-200"
      }`}>
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
            {report.item_name}
          </p>
          <h3 className="mt-2 text-lg font-bold font-poppins text-slate-800">
            New finder report
          </h3>
          <p className="mt-2 text-sm text-slate-500 font-semibold">
            {new Date(report.created_at).toLocaleString()}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(report.id)}
          className="w-4 h-4 cursor-pointer accent-indigo-600 mt-1"
        />
      </div>

      {report.item_image_url && (
        <div className="px-5 pt-5">
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

      <div className="px-5 pb-5 pt-4">
        <div className="grid gap-3 mb-4">
          {[
            { label: "Location", value: report.location },
            { label: "Message", value: report.message },
          ].map(({ label, value }) => {
            const mapsUrlMatch =
              label === "Location" ?
                value?.match(/https:\/\/maps\.google\.com\/\?q=[\d.,-]+/)
              : null;

            return (
              <div key={label}>
                <p className="m-0 text-xs font-extrabold uppercase text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap break-words max-h-24 overflow-auto">
                  {value}
                </p>
                {mapsUrlMatch && (
                  <a
                    href={mapsUrlMatch[0]}
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
            );
          })}
        </div>

        <button
          onClick={() => onResolve(report.id, report.item_name)}
          disabled={isResolving}
          className={`w-full py-2.5 rounded-lg text-sm font-bold font-nunito flex items-center justify-center gap-2 transition ${
            isResolving ?
              "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
          }`}>
          {isResolving ?
            "Resolving..."
          : <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark as Resolved
            </>
          }
        </button>
      </div>
    </article>
  );
}

export default ReportCard;
