function Alert({ message, type = "success", onClose }) {
  const isSuccess = type === "success";

  if (!message) return null;

  const handleClose = () => {
    setTimeout(onClose, 300);
  };

  setTimeout(handleClose, 3000);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Alert Card */}
      <div
        className={`relative z-10 flex flex-col items-center gap-4 px-10 py-8 rounded-2xl bg-white border ${
          isSuccess ? "border-green-100" : "border-red-100"
        } min-w-[260px] max-w-sm text-center`}>
        {/* Icon Circle */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}>
          {isSuccess ?
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          : <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          }
        </div>

        {/* Message */}
        <p
          className={`text-sm font-medium ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}>
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`text-xs px-5 py-2 rounded-lg font-medium transition-colors ${
            isSuccess ?
              "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
          }`}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default Alert;
