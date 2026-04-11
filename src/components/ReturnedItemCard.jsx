function ReturnedItemCard({ report, onViewQR }) {
  return (
    <article
      style={{
        background: "white",
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}>

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
            Returned item
          </h3>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            color: "#16a34a",
            border: "1px solid #bbf7d0",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: 800,
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#34d399",
              display: "inline-block",
            }}
          />
          Returned
        </div>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "16px",
            minHeight: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}>
          {report.item_image_url ?
            <img
              src={report.item_image_url}
              alt={report.item_name}
              style={{
                maxWidth: "100%",
                maxHeight: "160px",
                objectFit: "contain",
              }}
            />
          : <span style={{ fontSize: "40px", color: "#cbd5e1" }}>📦</span>}

          {report.item_qr_code_url && (
            <button
              onClick={() =>
                onViewQR({
                  qr_code_url: report.item_qr_code_url,
                  name: report.item_name,
                })
              }
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: 800,
                fontFamily: "'Nunito', sans-serif",
                cursor: "pointer",
                color: "#0f172a",
              }}>
              View QR
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "18px" }}>
        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          {report.item_description && (
            <div key="description">
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}>
                Description
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#334155",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                {report.item_description}
              </p>
            </div>
          )}

          {report.location && (
            <div key="location">
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}>
                Location
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#334155",
                  lineHeight: 1.7,
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                }}>
                <span
                  style={{ fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>
                  📍
                </span>
                {report.location}
              </p>
            </div>
          )}

          {report.message && (
            <div key="message">
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}>
                Message
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#334155",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                }}>
                <span
                  style={{ fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>
                  💬
                </span>
                {report.message}
              </p>
            </div>
          )}
        </div>

        {report.landmark_image_url && (
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "12px",
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
              }}>
              Landmark photo
            </p>
            <img
              src={report.landmark_image_url}
              alt="Landmark"
              style={{
                width: "100%",
                height: "120px",
                borderRadius: "12px",
                objectFit: "cover",
                display: "block",
                background: "#f8fafc",
              }}
            />
          </div>
        )}

        {report.item_qr_code_url && (
          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              paddingTop: "14px",
              display: "flex",
              justifyContent: "center",
            }}>
            <img
              src={report.item_qr_code_url}
              alt="QR Code"
              style={{
                width: "88px",
                height: "88px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "4px",
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
}

export default ReturnedItemCard;
