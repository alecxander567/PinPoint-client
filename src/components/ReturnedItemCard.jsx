function ReturnedItemCard({ report, onViewQR }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
            {report.item_name}
          </p>
          <h3 className="mt-2 text-lg font-bold font-poppins text-slate-800">
            Returned item
          </h3>
        </div>

        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-3 py-1 text-[11px] font-extrabold font-nunito uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Returned
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="bg-slate-50 rounded-xl min-h-[160px] flex items-center justify-center relative overflow-hidden">
          {report.item_image_url ?
            <img
              src={report.item_image_url}
              alt={report.item_name}
              className="max-w-full max-h-[160px] object-contain"
            />
          : <span className="text-4xl text-slate-300">📦</span>}

          {report.item_qr_code_url && (
            <button
              onClick={() =>
                onViewQR({
                  qr_code_url: report.item_qr_code_url,
                  name: report.item_name,
                })
              }
              className="absolute top-2 right-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition">
              View QR
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="grid gap-3 mb-4">
          {report.item_description && (
            <div>
              <p className="m-0 text-[12px] font-extrabold uppercase text-slate-500">
                Description
              </p>
              <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {report.item_description}
              </p>
            </div>
          )}

          {report.location && (
            <div>
              <p className="m-0 text-[12px] font-extrabold uppercase text-slate-500">
                Location
              </p>
              <p className="mt-1 text-slate-700 leading-relaxed break-words flex items-start gap-1.5">
                <span className="text-sm flex-shrink-0 mt-[2px]">📍</span>
                {report.location}
              </p>
            </div>
          )}

          {report.message && (
            <div>
              <p className="m-0 text-[12px] font-extrabold uppercase text-slate-500">
                Message
              </p>
              <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap break-words flex items-start gap-1.5">
                <span className="text-sm flex-shrink-0 mt-[2px]">💬</span>
                {report.message}
              </p>
            </div>
          )}
        </div>

        {report.landmark_image_url && (
          <div className="mb-4">
            <p className="m-0 mb-2 text-[12px] font-extrabold uppercase text-slate-500">
              Landmark photo
            </p>
            <img
              src={report.landmark_image_url}
              alt="Landmark"
              className="w-full h-[120px] rounded-lg object-cover bg-slate-50"
            />
          </div>
        )}

        {report.item_qr_code_url && (
          <div className="border-t border-slate-100 pt-4 flex justify-center">
            <img
              src={report.item_qr_code_url}
              alt="QR Code"
              className="w-[88px] h-[88px] rounded-lg p-1.5 bg-white border border-slate-300 shadow-sm"
            />
          </div>
        )}
      </div>
    </article>
  );
}

export default ReturnedItemCard;
