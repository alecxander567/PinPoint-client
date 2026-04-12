function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  width = "100%",
}) {
  return (
    <div className="relative" style={{ width }}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
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
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2.5 pl-9 pr-9 rounded-xl bg-white border border-slate-300 text-slate-700 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 transition-all duration-150"
        style={{ fontFamily: "'Nunito', sans-serif", boxSizing: "border-box" }}
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 text-sm transition-colors">
          ×
        </button>
      )}
    </div>
  );
}

export default SearchInput;
