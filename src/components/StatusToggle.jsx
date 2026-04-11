function StatusToggle({ item, onToggled, togglingId }) {
  const isToggling = togglingId === item.id;
  const isPending = item.status === "pending";
  const isLost = item.status === "lost";
  const isOn = !isLost;

  const label =
    isPending ? "Pending"
    : isLost ? "Lost"
    : "Found";

  return (
    <div className="flex items-center justify-between mb-2">
      <span
        className={`text-xs font-extrabold font-nunito tracking-wide ${
          isPending ? "text-slate-400"
          : isLost ? "text-red-600"
          : "text-indigo-600"
        }`}>
        {label}
      </span>

      <button
        onClick={() => !isToggling && !isPending && onToggled(item.id)}
        disabled={isToggling || isPending}
        title={
          isPending ?
            "A finder report is pending — resolve it first"
          : `Mark as ${isLost ? "found" : "lost"}`
        }
        aria-label={`Status: ${label}. Click to toggle.`}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          isPending ? "bg-slate-300 cursor-not-allowed"
          : isLost ? "bg-red-600 cursor-pointer"
          : "bg-indigo-600 cursor-pointer"
        } ${isToggling ? "opacity-70" : ""}`}>
        <span
          className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${
            isOn ? "left-[calc(100%-21px)]" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

export default StatusToggle;
