import { useEffect, useMemo } from "react";

const labelClass =
  "text-[10px] font-bold uppercase tracking-widest text-slate-400";

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm text-slate-800
  border border-slate-200 bg-slate-50
  outline-none transition-all duration-150 resize-none
  focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
`;

function LoadingSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div
        className="rounded-3xl p-8 animate-pulse"
        style={{
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(148,163,184,0.18)",
          boxShadow: "0 18px 48px rgba(15,23,42,0.08)",
        }}>
        <div className="h-3 w-24 rounded-full bg-blue-100 mb-4" />
        <div className="h-12 w-3/4 rounded-2xl bg-slate-200 mb-4" />
        <div className="h-4 w-1/2 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function FoundItemReport({
  item,
  form,
  loading,
  submitting,
  locating,
  error,
  onChange,
  onUseCurrentLocation,
  onSubmit,
}) {
  const landmarkPreviewUrl = useMemo(
    () => (form.landmarkImage ? URL.createObjectURL(form.landmarkImage) : ""),
    [form.landmarkImage],
  );

  useEffect(() => {
    if (!landmarkPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(landmarkPreviewUrl);
  }, [landmarkPreviewUrl]);

  const mapsUrlMatch = form.location.match(
    /https:\/\/maps\.google\.com\/\?q=[\d.,-]+/,
  );

  if (loading) return <LoadingSkeleton />;

  if (error || !item) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        <div
          className="rounded-3xl p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 18px 48px rgba(15,23,42,0.08)",
          }}>
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 m-0">
            Item unavailable
          </p>
          <h1
            className="text-4xl font-extrabold text-slate-900 mt-4 m-0 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            This QR link could not be loaded.
          </h1>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-lg mx-auto">
            {error ||
              "The item record was not found or is temporarily unavailable."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 box-border">
      <section
        className="rounded-3xl overflow-hidden mb-5"
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
          border: "1px solid rgba(99,102,241,0.3)",
        }}>
        <div className="relative px-6 py-7 overflow-hidden">
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300,
              height: 300,
              top: -80,
              right: -80,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 180,
              height: 180,
              bottom: -60,
              left: 30,
              background: "rgba(147,197,253,0.1)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-8">
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-widest m-0"
                style={{
                  color: "#bfdbfe",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                PinPoint
              </p>
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-white mt-2 m-0 leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Report where you found this item.
              </h1>
              <p
                className="mt-2 text-sm leading-relaxed max-w-xl"
                style={{
                  color: "#bfdbfe",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Share the exact landmark, location, and any identifying details
                so the owner can verify the sighting quickly.
              </p>
            </div>

            <div
              className="rounded-2xl px-5 py-4 lg:min-w-[240px] flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <p
                className="text-sm font-bold text-white m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Help return this item faster
              </p>
              <p
                className="mt-1.5 text-xs leading-relaxed m-0"
                style={{
                  color: "#bfdbfe",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Upload a clear landmark image and share your current location.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.97)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 18px 48px rgba(15,23,42,0.07)",
          }}>
          <div
            className="flex items-center justify-center p-5"
            style={{
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              minHeight: "200px",
            }}>
            {item.image_url ?
              <img
                src={item.image_url}
                alt={item.name}
                className="max-w-full object-contain rounded-2xl"
                style={{ maxHeight: "220px" }}
              />
            : <p className="text-slate-400 text-sm text-center">
                No item image available
              </p>
            }
          </div>

          <div className="px-6 py-5">
            <p
              className={`${labelClass} m-0`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Item details
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 m-0 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              {item.name}
            </h2>
            <p
              className="mt-3 text-sm text-slate-500 leading-relaxed break-words"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              {item.description ||
                "The owner did not add a description for this item."}
            </p>
            <a
              href={item.owner_fb_account_url || "https://facebook.com/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-full text-sm font-bold text-white no-underline transition-all"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
                fontFamily: "'Poppins', sans-serif",
              }}>
              Contact owner on Facebook
            </a>
          </div>
        </div>

        <div
          className="rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            border: "1px solid rgba(148,163,184,0.18)",
            boxShadow: "0 18px 48px rgba(15,23,42,0.07)",
          }}>
          <div className="px-6 pt-6 pb-2">
            <p
              className={`${labelClass} m-0`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Submit report
            </p>
            <h2
              className="text-2xl font-extrabold text-slate-900 mt-2 m-0 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Tell the owner where you saw it.
            </h2>
            <p
              className="mt-1.5 text-xs text-slate-400 leading-relaxed"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              Specific details help the owner confirm the item faster.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex flex-col gap-4 px-6 pb-6 pt-4">
            {/* Landmark image */}
            <div className="flex flex-col gap-2">
              <label
                className={labelClass}
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Landmark Image
              </label>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("landmark-input").click()
                }
                className="w-full py-3 rounded-xl text-sm font-bold transition-colors"
                style={{
                  border: "1.5px dashed #93c5fd",
                  background: "#f0f9ff",
                  color: "#0369a1",
                  fontFamily: "'Poppins', sans-serif",
                  cursor: "pointer",
                }}>
                {form.landmarkImage ?
                  "Change uploaded image"
                : "Upload a landmark image"}
              </button>
              <input
                id="landmark-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  onChange("landmarkImage", e.target.files?.[0] || null)
                }
              />
              {form.landmarkImage && landmarkPreviewUrl && (
                <div className="rounded-2xl border border-blue-100 bg-white p-3">
                  <img
                    src={landmarkPreviewUrl}
                    alt="Landmark preview"
                    className="w-full rounded-xl object-contain bg-slate-50"
                    style={{ maxHeight: "160px" }}
                  />
                  <button
                    type="button"
                    onClick={() => onChange("landmarkImage", null)}
                    className="mt-2 text-xs font-bold text-red-500 bg-transparent border-none cursor-pointer p-0">
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label
                  className={labelClass}
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Location
                </label>
                <button
                  type="button"
                  onClick={onUseCurrentLocation}
                  disabled={locating}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    border: "none",
                    background: locating ? "#e2e8f0" : "rgba(29,78,216,0.1)",
                    color: locating ? "#94a3b8" : "#1d4ed8",
                    cursor: locating ? "not-allowed" : "pointer",
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                  {locating ? "Getting location..." : "Use current location"}
                </button>
              </div>
              <textarea
                rows={3}
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Tap 'Use current location' to share GPS coordinates, or paste a maps link"
                className={inputClass}
                style={{ fontFamily: "'Nunito', sans-serif" }}
              />
              {mapsUrlMatch && (
                <a
                  href={mapsUrlMatch[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold no-underline w-fit"
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#15803d",
                  }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  View on Google Maps
                </a>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                className={labelClass}
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Message
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
                placeholder="Describe when you saw it and any details the owner would recognize."
                className={inputClass}
                style={{ fontFamily: "'Nunito', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background:
                  submitting ? "#cbd5e1" : (
                    "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)"
                  ),
                boxShadow:
                  submitting ? "none" : "0 4px 14px rgba(29,78,216,0.35)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.currentTarget.style.opacity = "1";
              }}>
              {submitting ? "Submitting report..." : "Submit report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
