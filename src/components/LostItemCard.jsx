function LostItemCard({ item, onViewQR }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid #f1f5f9",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.13)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}>
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "180px",
          position: "relative",
        }}>
        <button
          onClick={() => onViewQR(item)}
          className="btn btn--primary"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            padding: "5px 12px",
            fontSize: "12px",
            borderRadius: "8px",
          }}>
          View QR
        </button>
        <img
          src={item.image_url}
          alt={item.name}
          style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
        />
      </div>

      <div style={{ padding: "16px" }}>
        <h3
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 6px 0",
          }}>
          {item.name}
        </h3>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "13px",
            color: "#64748b",
            lineHeight: "1.5",
            margin: "0 0 14px 0",
          }}>
          {item.description || "No description"}
        </p>

        {item.owner_fb_account_url && (
          <a
            href={item.owner_fb_account_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "12px",
              color: "#2563eb",
              lineHeight: "1.5",
              margin: "0 0 14px 0",
              textDecoration: "none",
              wordBreak: "break-word",
            }}>
            {item.owner_fb_account_url}
          </a>
        )}

        {item.qr_code_url && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "14px",
            }}>
            <img
              src={item.qr_code_url}
              alt="QR Code"
              style={{
                width: "90px",
                height: "90px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                padding: "4px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LostItemCard;
