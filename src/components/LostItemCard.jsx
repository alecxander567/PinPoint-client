function LostItemCard({ item, onViewQR }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
      <div className="relative flex items-center justify-center p-6 min-h-[180px] bg-slate-50">
        <button
          onClick={() => onViewQR(item)}
          className="absolute top-2 right-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition">
          View QR
        </button>
        <img
          src={item.image_url}
          alt={item.name}
          className="max-w-full max-h-[150px] object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-1 font-poppins">
          {item.name}
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed mb-3 font-nunito">
          {item.description || "No description"}
        </p>

        {item.owner_fb_account_url && (
          <a
            href={item.owner_fb_account_url}
            target="_blank"
            rel="noreferrer"
            className="block text-[12px] text-indigo-600 hover:text-indigo-500 mb-3 truncate font-nunito transition-colors">
            {item.owner_fb_account_url}
          </a>
        )}

        {item.qr_code_url && (
          <div className="flex justify-center mb-3">
            <img
              src={item.qr_code_url}
              alt="QR Code"
              className="w-[90px] h-[90px] rounded-lg p-1.5 bg-white border border-slate-300 shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LostItemCard;
