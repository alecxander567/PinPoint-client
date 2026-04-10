function ReportBadge({ count }) {
  if (!count || count <= 0) return null;

  return (
    <span
      style={{
        position: "absolute",
        top: "-6px",
        right: "-8px",
        minWidth: "18px",
        height: "18px",
        borderRadius: "999px",
        background: "#ef4444",
        color: "white",
        fontSize: "11px",
        fontWeight: "700",
        fontFamily: "'Nunito', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 4px",
        lineHeight: 1,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default ReportBadge;
