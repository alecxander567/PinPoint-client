/**
 * Pill toggle switch.
 *
 * - Default (found): track is green, circle on the RIGHT, label says "Found"
 * - Toggled (lost):  track is red,   circle on the LEFT,  label says "Lost"
 * - Pending: disabled — grey track with lock tooltip
 */
function StatusToggle({ item, onToggled, togglingId }) {
  const isToggling = togglingId === item.id;
  const isPending = item.status === "pending";
  const isLost = item.status === "lost";
  const isOn = !isLost;

  const trackColor =
    isPending ? "#cbd5e1"
    : isLost ? "#ef4444"
    : "#22c55e";

  const label =
    isPending ? "Pending"
    : isLost ? "Lost"
    : "Found";

  const labelColor =
    isPending ? "#94a3b8"
    : isLost ? "#dc2626"
    : "#16a34a";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}>
      <span
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: labelColor,
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: "0.03em",
        }}>
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
        style={{
          position: "relative",
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          background: trackColor,
          border: "none",
          cursor: isToggling || isPending ? "not-allowed" : "pointer",
          padding: 0,
          transition: "background 0.25s ease",
          flexShrink: 0,
          opacity: isToggling ? 0.7 : 1,
        }}
        aria-label={`Status: ${label}. Click to toggle.`}>
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: isOn ? "calc(100% - 21px)" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
            transition: "left 0.25s ease",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}

export default StatusToggle;
