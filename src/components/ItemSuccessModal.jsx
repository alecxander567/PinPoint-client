import { useNavigate } from "react-router-dom";
import { QrIcon } from "./Icons";
import PrintQRModal from "./PrintQRModal";
import { useState } from "react";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PrinterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9V2h12v7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="6"
      y="14"
      width="12"
      height="8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ItemSuccessModal = ({ success, onRegisterAnother }) => {
  const navigate = useNavigate();
  const [showPrintModal, setShowPrintModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200">
          {/* Accent bar */}
          <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-indigo-400" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider font-nunito text-slate-400">
                Registration
              </p>
              <p className="text-lg font-bold font-poppins text-slate-800">
                {success.name}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CheckIcon />
              </div>
            </div>
          </div>

          {/* Status pill */}
          <div className="mx-6 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold font-nunito">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Item registered successfully
            </span>
          </div>

          {/* QR Code block */}
          {success.qr_code_url && (
            <div className="mx-6 mb-4 rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col items-center">
              <img
                src={success.qr_code_url}
                alt="QR Code"
                className="w-36 h-36 rounded-lg"
              />
              <p className="mt-3 text-sm font-nunito text-slate-600">
                Scan to report this item
              </p>
            </div>
          )}

          {/* Helper text */}
          <p className="mx-6 mb-4 text-xs font-nunito text-slate-500 text-center leading-relaxed">
            Print and attach this QR code to your item so finders can report it.
          </p>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold font-poppins flex items-center justify-center gap-2 transition">
              <PrinterIcon />
              Print QR Code
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/home")}
                className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold font-poppins transition">
                Back
              </button>
              <button
                onClick={onRegisterAnother}
                className="flex-1 py-2.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold font-poppins transition">
                + Add another
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrintQRModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        qrCodeUrl={success?.qr_code_url}
        itemName={success?.name}
      />
    </>
  );
};

export default ItemSuccessModal;
