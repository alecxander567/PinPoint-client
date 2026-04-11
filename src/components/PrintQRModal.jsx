import { PrinterIcon } from "./Icons";

const PrintQRModal = ({ isOpen, onClose, qrCodeUrl, itemName }) => {
  if (!isOpen || !qrCodeUrl) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}>
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200"
          onClick={(e) => e.stopPropagation()}>
          <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-indigo-400" />

          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider font-nunito text-slate-400">
                QR Code
              </p>
              <p className="text-lg font-bold font-poppins text-slate-800">
                {itemName}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-indigo-600">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div
            id="printable-area"
            className="mx-6 mb-4 rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col items-center">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-44 h-44 rounded-lg"
            />
            <p className="mt-3 text-sm font-nunito text-slate-600">
              Scan to report this item
            </p>
          </div>

          <p className="mx-6 mb-4 text-xs font-nunito text-slate-500 text-center leading-relaxed">
            Print and attach this QR code to your item so finders can report it.
          </p>

          <div className="px-6 pb-6 flex flex-col gap-2">
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold font-poppins flex items-center justify-center gap-2 transition">
              <PrinterIcon />
              Print now
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold font-poppins transition">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: fixed;
            left: 50%;
            top: 40px;
            transform: translateX(-50%);
            padding: 25px;
            border: 2px solid #e2e8f0 !important;
            border-radius: 16px;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </>
  );
};

export default PrintQRModal;
