import { useEffect, useState } from "react";

export default function Alert({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const isSuccess = type === "success";

  useEffect(() => {
    if (!message) return;
    const showT = setTimeout(() => setVisible(true), 10);
    const hideT = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, [message]);

  if (!message) return null;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
        visible ?
          "opacity-100 translate-y-0"
        : "opacity-0 translate-y-3 pointer-events-none"
      }`}>
      <div className="w-72 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white">
        <div className="flex items-start gap-3 p-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 flex-shrink-0">
            {isSuccess ?
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            : <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className="m-0 text-xs font-bold uppercase tracking-wide font-poppins">
              {isSuccess ? "Success" : "Error"}
            </p>
            <p className="m-0 mt-1 text-sm font-nunito leading-relaxed">
              {message}
            </p>
            <button
              onClick={handleDismiss}
              className="mt-3 w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold font-poppins transition">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
