/* ── Icons.jsx ─────────────────────────────────────────────── */

export const Logo = ({ size = 28, color = "#2563eb" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <circle cx="15" cy="15" r="9" stroke={color} strokeWidth="2.5" />
    <path
      d="M22 22l6 6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15 11v8M11 15h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
  
);

export const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21V12h6v9"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const LostIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11 8v3M11 14h.01"
      stroke={active ? "#ef4444" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ReturnedIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 12l2 2 4-4"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2a10 10 0 100 20A10 10 0 0012 2z"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
    />
  </svg>
);

export const ActivityIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <polyline
      points="22 12 18 12 15 21 9 3 6 12 2 12"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReportIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ProfileIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke={active ? "#2563eb" : "#9ca3af"}
      strokeWidth="2"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ── New: QrIcon ─────────────────────────────────────────── */
export const QrIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <path d="M14 14h.01" />
    <path d="M17 17h.01" />
    <path d="M20 20h.01" />
    <path d="M14 20h.01" />
  </svg>
);

/* ── New: Printer Icon ───────────────────────────────────── */
export const PrinterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
    <path d="M14 18h-4" />
  </svg>
);
