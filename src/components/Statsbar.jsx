/**
 * StatsBar — a row of labelled stat counters inside a dark pill.
 *
 * Props:
 *   stats: [{ label: string, value: number, color: string }]
 */
function StatsBar({ stats }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        background: "rgba(0,0,0,0.25)",
        borderRadius: "14px",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 28px",
            borderRight:
              i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "800",
              fontSize: "28px",
              color: stat.color,
              lineHeight: 1,
            }}>
            {stat.value}
          </span>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.75)",
              marginTop: "4px",
              fontWeight: "700",
              letterSpacing: "0.02em",
            }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
