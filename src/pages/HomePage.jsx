import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetUserItems } from "../hooks/useItem";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import { Logo, PlusIcon } from "../components/Icons";
import { NAV } from "../components/navConfig";
import "../css/HomePage.css";

/* ── Page Content ───────────────────────────────────────── */
function PageContent({ page, name, onAddItem, items, loading }) {
  const [selectedItemQR, setSelectedItemQR] = useState(null);

  if (page === "home") {
    return (
      <div style={{ width: "100%", minHeight: "calc(100vh - 144px)" }}>
        <style>{`
          @media (max-width: 768px) {
            .hero-avatar-container {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
            }
            .hero-avatar-box {
              margin-bottom: 16px !important;
              margin-right: 0 !important;
            }
            .stats-container {
              display: flex !important;
              gap: 12px !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              padding-bottom: 8px !important;
              scroll-behavior: smooth !important;
              scroll-snap-type: x mandatory !important;
            }
            .stat-card {
              flex-shrink: 0 !important;
              min-width: 120px !important;
              scroll-snap-align: start !important;
            }
          }
        `}</style>
        {/* Hero Section with Gradient */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
            color: "white",
            padding: "40px 24px",
          }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Avatar and Name */}
            <div
              className="hero-avatar-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginBottom: "32px",
              }}>
              <div
                className="hero-avatar-box"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                <Logo size={36} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "clamp(24px, 5vw, 32px)",
                    fontWeight: "800",
                    margin: "0 0 4px 0",
                  }}>
                  Welcome back, {name}!
                </h1>
                <p
                  style={{
                    fontSize: "clamp(13px, 3vw, 15px)",
                    opacity: 0.9,
                    margin: 0,
                  }}>
                  Helping your community recover lost items
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div
              className="stats-container"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
              }}>
              {[
                {
                  label: "Your Items",
                  value: items.length.toString(),
                  accent: "#fbbf24",
                },
                { label: "Matches Found", value: "0", accent: "#34d399" },
                { label: "Reports", value: "0", accent: "#f87171" },
              ].map((c) => (
                <div
                  className="stat-card"
                  key={c.label}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "16px 12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                  <div
                    style={{
                      fontSize: "clamp(20px, 4vw, 24px)",
                      fontWeight: "800",
                      color: c.accent,
                      marginBottom: "4px",
                    }}>
                    {c.value}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(11px, 2.5vw, 12px)",
                      fontWeight: "600",
                      opacity: 0.9,
                    }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}>
          {/* Items Section */}
          {items.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "24px",
                }}>
                Your Items ({items.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)")
                    }>
                    {/* Image Container - Centered */}
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
                      {/* View QR Code Button */}
                      <button
                        onClick={() => setSelectedItemQR(item)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#1d4ed8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#2563eb")
                        }>
                        View QR
                      </button>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "160px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ padding: "16px" }}>
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#0f172a",
                          marginBottom: "6px",
                          margin: "0 0 6px 0",
                        }}>
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          marginBottom: "14px",
                          lineHeight: "1.5",
                          margin: "0 0 14px 0",
                        }}>
                        {item.description || "No description"}
                      </p>

                      {/* QR Code - Centered */}
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

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#dc2626")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#ef4444")
                          }>
                          Delete
                        </button>
                        <button
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#2563eb")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#3b82f6")
                          }>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: "16px", color: "#64748b" }}>
                No items yet. Register your first item to get started!
              </p>
            </div>
          )}

          {/* QR Code Modal */}
          <PrintQRModal
            isOpen={!!selectedItemQR}
            onClose={() => setSelectedItemQR(null)}
            qrCodeUrl={selectedItemQR?.qr_code_url}
            itemName={selectedItemQR?.name}
          />
        </div>
      </div>
    );
  }

  const labels = {
    lost: "Lost Items",
    returned: "Returned Items",
    activity: "Activity Logs",
    reports: "Reports",
    profile: "Profile",
  };

  return (
    <div className="page-placeholder">
      <div className="page-placeholder__icon-wrap">
        {NAV.find((n) => n.key === page)?.Icon({ active: true })}
      </div>
      <h2 className="page-placeholder__title">{labels[page]}</h2>
      <p className="page-placeholder__desc">This section is coming soon.</p>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
function HomePage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const name = localStorage.getItem("name") || "User";
  const user_id = localStorage.getItem("user_id");
  const [activePage, setActivePage] = useState("home");
  const { items, fetchUserItems, loading } = useGetUserItems();

  useEffect(() => {
    if (user_id) {
      fetchUserItems(user_id);
    }
  }, [user_id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Desktop Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={logout}
      />

      {/* Mobile Header */}
      <div className="mobile-header show-mobile">
        <div className="mobile-header__brand">
          <Logo size={24} />
          <span className="mobile-header__brand-text">Item Finder</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/add-item")}
            className="mobile-header__add-btn">
            <PlusIcon />
          </button>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#fca5a5";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.color = "#64748b";
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* Page Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "80px",
        }}
        className="main-content">
        <PageContent
          page={activePage}
          name={name}
          onAddItem={() => navigate("/add-item")}
          items={items}
          loading={loading}
        />
      </main>

      {/* Mobile Footer Nav */}
      <FooterNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default HomePage;
