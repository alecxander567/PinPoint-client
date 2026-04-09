import { useEffect, useMemo, useState } from "react";

function cardStyle(extra = {}) {
  return {
    background: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "28px",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
    ...extra,
  };
}

function fieldStyle() {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe4f0",
    background: "#f8fbff",
    color: "#0f172a",
    fontSize: "14px",
    lineHeight: 1.5,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  };
}

function fileInputButtonStyle(isSmallMobile) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: isSmallMobile ? "12px 14px" : "13px 16px",
    borderRadius: "16px",
    border: "1px dashed #93c5fd",
    background: "#f0f9ff",
    color: "#075985",
    fontSize: isSmallMobile ? "13px" : "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxSizing: "border-box",
    textAlign: "center",
  };
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "24px 16px 40px" }}>
      <div style={{ display: "grid", gap: "20px" }}>
        <div style={{ ...cardStyle(), padding: "32px" }}>
          <div
            style={{
              width: "110px",
              height: "12px",
              borderRadius: "999px",
              background: "#dbeafe",
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              height: "56px",
              borderRadius: "24px",
              background: "#e2e8f0",
              marginTop: "16px",
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "18px",
              borderRadius: "999px",
              background: "#f1f5f9",
              marginTop: "16px",
            }}
          />
        </div>
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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const landmarkPreviewUrl = useMemo(
    () => (form.landmarkImage ? URL.createObjectURL(form.landmarkImage) : ""),
    [form.landmarkImage],
  );

  useEffect(() => {
    if (!landmarkPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(landmarkPreviewUrl);
  }, [landmarkPreviewUrl]);

  const isTablet = viewportWidth < 1100;
  const isMobile = viewportWidth < 900;
  const isSmallMobile = viewportWidth < 640;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !item) {
    return (
      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "32px 16px 40px" }}>
        <div style={{ ...cardStyle(), padding: "32px", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 800,
              color: "#dc2626",
            }}
          >
            Item unavailable
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(32px, 6vw, 48px)",
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#0f172a",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            This QR link could not be loaded.
          </h1>
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "640px",
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            {error || "The item record was not found or is temporarily unavailable."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1180px",
        margin: "0 auto",
        padding: isSmallMobile ? "16px 12px 28px" : "24px 16px 40px",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          ...cardStyle(),
          padding: isSmallMobile ? "18px 16px" : isMobile ? "24px 20px" : "36px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 800,
            color: "#0369a1",
          }}
        >
          Item Finder
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "flex-end",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          <div style={{ maxWidth: "720px", minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: isSmallMobile ? "31px" : "clamp(34px, 7vw, 56px)",
                lineHeight: isSmallMobile ? 1.08 : 1.02,
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Report where you found this item.
            </h1>
            <p
              style={{
                margin: "14px 0 0",
                color: "#475569",
                fontSize: isSmallMobile ? "14px" : "16px",
                lineHeight: 1.75,
                maxWidth: "620px",
              }}
            >
              Share the exact landmark, location, and any identifying details so
              the owner can verify the sighting quickly.
            </p>
          </div>
          <div
            style={{
              width: isMobile ? "100%" : "min(280px, 100%)",
              minWidth: 0,
              borderRadius: "22px",
              padding: isSmallMobile ? "16px" : "18px 20px",
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              boxSizing: "border-box",
            }}
          >
            <p style={{ margin: 0, color: "#0f172a", fontSize: "14px", fontWeight: 800 }}>
              Help return this item faster
            </p>
            <p style={{ margin: "6px 0 0", color: "#0369a1", fontSize: "13px", lineHeight: 1.6 }}>
              Upload a clear landmark image and share your current location.
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "minmax(0, 1fr)"
            : isTablet
              ? "minmax(0, 1fr) minmax(0, 1fr)"
              : "minmax(0, 1.05fr) minmax(0, 0.95fr)",
          gap: "20px",
          marginTop: "20px",
          alignItems: "start",
        }}
      >
        <article
          style={{
            ...cardStyle(),
            padding: isSmallMobile ? "16px" : "20px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#e2e8f0",
              minHeight: isSmallMobile ? "180px" : isMobile ? "220px" : "280px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isSmallMobile ? "16px" : "22px",
              boxSizing: "border-box",
            }}
          >
            {item.image_url ?
              <img
                src={item.image_url}
                alt={item.name}
                style={{
                  width: "100%",
                  maxWidth: isSmallMobile ? "190px" : isMobile ? "240px" : "320px",
                  height: isSmallMobile ? "140px" : isMobile ? "180px" : "220px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            : <div
                style={{
                  minHeight: isSmallMobile ? "180px" : isMobile ? "220px" : "280px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  textAlign: "center",
                  color: "#64748b",
                  background: "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)",
                }}
              >
                No item image available
              </div>
            }
          </div>

          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 800,
                color: "#0369a1",
              }}
            >
              Item details
            </p>
            <h2
              style={{
                margin: "12px 0 0",
                fontSize: isSmallMobile ? "24px" : "clamp(28px, 5vw, 40px)",
                lineHeight: 1.1,
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {item.name}
            </h2>
            <p
              style={{
                margin: "14px 0 0",
                color: "#475569",
                fontSize: isSmallMobile ? "14px" : "15px",
                lineHeight: 1.8,
                wordBreak: "break-word",
              }}
            >
              {item.description || "The owner did not add a description for this item."}
            </p>
            <a
              href={item.owner_fb_account_url || "https://facebook.com/"}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "18px",
                padding: isSmallMobile ? "11px 14px" : "12px 18px",
                borderRadius: "999px",
                background: "#0f172a",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: isSmallMobile ? "13px" : "14px",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Contact owner on Facebook
            </a>
          </div>
        </article>

        <article
          style={{
            ...cardStyle(),
            padding: isSmallMobile ? "16px" : "20px",
            minWidth: 0,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 800,
              color: "#0369a1",
            }}
          >
            Submit report
          </p>
          <h2
            style={{
              margin: "12px 0 0",
              fontSize: isSmallMobile ? "24px" : isMobile ? "28px" : "34px",
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#0f172a",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Tell the owner where you saw it.
          </h2>
          <p
            style={{
              margin: "12px 0 0",
              color: "#475569",
              fontSize: isSmallMobile ? "13px" : "14px",
              lineHeight: 1.7,
            }}
          >
            Specific details help the owner confirm the item faster.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            style={{ display: "grid", gap: isSmallMobile ? "14px" : "16px", marginTop: "22px" }}
          >
            <div style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                Landmark image
              </span>
              <label style={fileInputButtonStyle(isSmallMobile)}>
                {form.landmarkImage ? "Change uploaded image" : "Upload a landmark image"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) =>
                    onChange("landmarkImage", event.target.files?.[0] || null)
                  }
                />
              </label>
              {form.landmarkImage && landmarkPreviewUrl && (
                <div
                  style={{
                    border: "1px solid #dbeafe",
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "12px",
                  }}
                >
                  <img
                    src={landmarkPreviewUrl}
                    alt="Landmark preview"
                    style={{
                      width: "100%",
                      maxHeight: "180px",
                      objectFit: "contain",
                      display: "block",
                      borderRadius: "12px",
                      background: "#f8fafc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onChange("landmarkImage", null)}
                    style={{
                      marginTop: "10px",
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <label style={{ display: "grid", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                  Location
                </span>
                <button
                  type="button"
                  onClick={onUseCurrentLocation}
                  disabled={locating}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "8px 12px",
                    background: locating ? "#cbd5e1" : "#e0f2fe",
                    color: locating ? "#475569" : "#0369a1",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: locating ? "not-allowed" : "pointer",
                  }}
                >
                  {locating ? "Getting location..." : "Use current location"}
                </button>
              </div>
              <textarea
                rows="3"
                value={form.location}
                onChange={(event) => onChange("location", event.target.value)}
                placeholder="Tap 'Use current location' to share GPS coordinates, or paste a maps link"
                style={fieldStyle()}
              />
            </label>

            <label style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                Message
              </span>
              <textarea
                rows="5"
                value={form.message}
                onChange={(event) => onChange("message", event.target.value)}
                placeholder="Describe when you saw it and any details the owner would recognize."
                style={fieldStyle()}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "999px",
                padding: isSmallMobile ? "13px 16px" : "14px 18px",
                background: submitting ? "#cbd5e1" : "#0284c7",
                color: "#ffffff",
                fontSize: isSmallMobile ? "13px" : "14px",
                fontWeight: 800,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 10px 24px rgba(2, 132, 199, 0.22)",
              }}
            >
              {submitting ? "Submitting report..." : "Submit report"}
            </button>
          </form>
        </article>
      </section>

    </div>
  );
}
