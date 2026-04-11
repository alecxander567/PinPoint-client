import StatusToggle from "./StatusToggle";

function ItemCard({
  item,
  togglingId,
  onToggleLost,
  onEdit,
  onDelete,
  onViewQR,
}) {
  return (
    <div className="group bg-white border border-indigo-100 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
      <div className="relative flex items-center justify-center p-6 min-h-[190px] bg-gradient-to-b from-slate-50 to-slate-100">
        <span
          className={`absolute top-3 left-3 w-2 h-2 rounded-full ${
            item.status === "lost" ? "bg-red-500" : "bg-emerald-500"
          }`}
        />

        <img
          src={item.image_url}
          alt={item.name}
          className="max-w-full max-h-[150px] object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-1 truncate font-poppins">
          {item.name}
        </h3>
        <p className="text-[12px] text-slate-600 leading-relaxed mb-3 line-clamp-2 font-nunito">
          {item.description || "No description"}
        </p>

        {item.owner_fb_account_url && (
          <a
            href={item.owner_fb_account_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-500 mb-3 truncate transition-colors font-nunito">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
            {item.owner_fb_account_url}
          </a>
        )}

        {item.qr_code_url && (
          <div className="flex justify-center mb-3">
            <img
              src={item.qr_code_url}
              alt="QR Code"
              className="w-[88px] h-[88px] rounded-xl p-1.5 bg-white border border-slate-200 shadow-sm"
            />
          </div>
        )}

        <StatusToggle
          item={item}
          onToggled={onToggleLost}
          togglingId={togglingId}
        />

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            onClick={() => onViewQR(item)}
            className="flex-1 py-2 text-[12px] font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all">
            QR
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 py-2 text-[12px] font-semibold rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all">
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 py-2 text-[12px] font-semibold rounded-lg text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
