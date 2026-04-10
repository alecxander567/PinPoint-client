/**
 * SearchInput — a search field with a magnifier icon and clear button.
 *
 * Props:
 *   value: string
 *   onChange: (value: string) => void
 *   placeholder?: string
 *   width?: string  (default "300px")
 */
function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  width = "300px",
}) {
  return (
    <div style={{ position: "relative", width }}>
      <svg
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-input-light"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 36px 10px 36px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          background: "white",
          color: "#0f172a",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#e2e8f0",
            border: "none",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: 1,
          }}>
          ×
        </button>
      )}
    </div>
  );
}

export default SearchInput;
