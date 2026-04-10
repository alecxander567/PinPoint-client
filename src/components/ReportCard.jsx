/**
 * ReportCard — displays a single finder report with image, location, message, and resolve button.
 *
 * Props:
 *   report: object
 *   isSelected: boolean
 *   resolvingId: string | null
 *   onToggleSelect: (reportId) => void
 *   onResolve: (reportId, itemName) => void
 */
function ReportCard({
  report,
  isSelected,
  resolvingId,
  onToggleSelect,
  onResolve,
}) {
  const isResolving = resolvingId === report.id;

  return (
    <article
      style={{
        background: "white",
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
        overflow: "hidden",
        outline: isSelected ? "3px solid rgba(37,99,235,0.25)" : "none",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}>
      {/* Header */}
      <div
        style={{
          padding: "18px 18px 14px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 800,
              color: "#0284c7",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
            {report.item_name}
          </p>
          <h3
            style={{
              margin: "10px 0 0",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "22px",
              lineHeight: 1.2,
              color: "#0f172a",
            }}>
            New finder report
          </h3>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "13px",
              color: "#64748b",
              fontWeight: 700,
            }}>
            {new Date(report.created_at).toLocaleString()}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(report.id)}
          style={{
            width: "18px",
            height: "18px",
            cursor: "pointer",
            marginTop: "2px",
          }}
        />
      </div>

      {/* Landmark image */}
      {report.landmark_image_url && (
        <div style={{ padding: "18px 18px 0" }}>
          <img
            src={report.landmark_image_url}
            alt="Landmark"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "16px",
              display: "block",
              background: "#f8fafc",
            }}
          />
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "18px" }}>
        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          {[
            { label: "Location", value: report.location, maxHeight: "88px" },
            { label: "Message", value: report.message, maxHeight: "96px" },
          ].map(({ label, value, maxHeight }) => (
            <div key={label}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}>
                {label}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#334155",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight,
                  overflow: "auto",
                }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Resolve button */}
        <button
          onClick={() => onResolve(report.id, report.item_name)}
          disabled={isResolving}
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: "12px",
            border: "none",
            background: isResolving ? "#e2e8f0" : "#16a34a",
            color: isResolving ? "#94a3b8" : "white",
            fontSize: "13px",
            fontWeight: "800",
            cursor: isResolving ? "not-allowed" : "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.15s",
            boxShadow: isResolving ? "none" : "0 2px 8px rgba(22,163,74,0.2)",
          }}
          onMouseEnter={(e) => {
            if (!isResolving) e.currentTarget.style.background = "#15803d";
          }}
          onMouseLeave={(e) => {
            if (!isResolving) e.currentTarget.style.background = "#16a34a";
          }}>
          {isResolving ?
            "Resolving..."
          : <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark as Resolved
            </>
          }
        </button>
      </div>
    </article>
  );
}

export default ReportCard;
