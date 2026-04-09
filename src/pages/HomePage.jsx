import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetUserItems, useDeleteItem } from "../hooks/useItem";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import EditItemModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Alert from "../components/Alert";
import { Logo, PlusIcon } from "../components/Icons";
import { NAV } from "../components/navConfig";
import "../css/HomePage.css";

/* ── Skeleton Components ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="skeleton-block h-44" />
      <div className="p-4">
        <div className="skeleton-block h-4 w-3/4 mb-2 rounded" />
        <div className="skeleton-block h-3 w-1/2 mb-4 rounded" />
        <div className="skeleton-block h-24 w-24 mx-auto mb-4 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton-block flex-1 h-9 rounded-lg" />
          <div className="skeleton-block flex-1 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="w-full min-h-screen">
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/15 shrink-0" />
            <div className="flex-1">
              <div className="skeleton-block skeleton-dark h-7 w-56 mb-2 rounded" />
              <div className="skeleton-block skeleton-dark h-4 w-44 rounded opacity-70" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="skeleton-block skeleton-dark h-7 w-10 mx-auto mb-2 rounded" />
                <div className="skeleton-block skeleton-dark h-3 w-16 mx-auto rounded opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="skeleton-block h-7 w-40 mb-6 rounded" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page Content ───────────────────────────────────────── */
function PageContent({
  page,
  name,
  items,
  loading,
  onItemUpdated,
  onItemDeleted,
}) {
  const [selectedItemQR, setSelectedItemQR] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");

  const { deleteItem, loading: deleteLoading } = useDeleteItem();

  const showAlert = (message, type = "success") => setAlert({ message, type });
  const clearAlert = () => setAlert({ message: "", type: "success" });

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteConfirm = async () => {
    const result = await deleteItem(deletingItem.id);
    if (result.error) {
      showAlert(
        `Failed to delete "${deletingItem.name}". Please try again.`,
        "error",
      );
    } else {
      onItemDeleted(deletingItem.id);
      showAlert(`"${deletingItem.name}" was deleted successfully.`, "success");
    }
    setDeletingItem(null);
  };

  if (page === "home") {
    if (loading) return <SkeletonLoader />;

    return (
      <div style={{ width: "100%", minHeight: "calc(100vh - 144px)" }}>
        <style>{`
          @keyframes shimmer {
            0%   { background-position: -600px 0; }
            100% { background-position:  600px 0; }
          }
          .skeleton-block {
            background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
            background-size: 600px 100%;
            animation: shimmer 1.4s infinite linear;
            border-radius: 6px;
          }
          .skeleton-dark {
            background: linear-gradient(90deg, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 75%) !important;
            background-size: 600px 100% !important;
            animation: shimmer 1.4s infinite linear !important;
          }
          .search-input-light::placeholder { color: #94a3b8; }
          .search-input-light:focus { outline: none; border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.3); }
        `}</style>

        {/* Hero */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
            color: "white",
            padding: "28px 24px 24px",
          }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Avatar + Name + Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}>
              {/* Avatar */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                <Logo size={28} color="white" />
              </div>

              {/* Name + subtitle */}
              <div style={{ flex: 1, minWidth: "180px" }}>
                <h1
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(18px, 4vw, 26px)",
                    fontWeight: "800",
                    margin: "0 0 2px 0",
                    lineHeight: 1.2,
                  }}>
                  Welcome back, {name}!
                </h1>
                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    margin: 0,
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                  Helping your community recover lost items
                </p>
              </div>

              {/* Stats badges */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: "0",
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                {[
                  { label: "Items", value: items.length, color: "#fbbf24" },
                  { label: "Matches", value: 0, color: "#34d399" },
                  { label: "Reports", value: 0, color: "#f87171" },
                ].map((c, i, arr) => (
                  <div
                    key={c.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "14px 28px",
                      borderRight:
                        i < arr.length - 1 ?
                          "1px solid rgba(255,255,255,0.1)"
                        : "none",
                    }}>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "800",
                        fontSize: "28px",
                        color: c.color,
                        lineHeight: 1,
                      }}>
                      {c.value}
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
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar — below hero, right-aligned */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 20px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}>
          <div style={{ position: "relative", width: "300px" }}>
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
              placeholder="Search your items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
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
        </div>

        {/* Items Grid */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "24px 20px 40px",
          }}>
          {items.length > 0 && (
            <>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "24px",
                }}>
                {search ?
                  `Results for "${search}" (${filteredItems.length})`
                : `Your Items (${items.length})`}
              </h2>

              {filteredItems.length > 0 ?
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "20px",
                  }}>
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        border: "1px solid #f1f5f9",
                        transition: "box-shadow 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(0,0,0,0.13)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 12px rgba(0,0,0,0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}>
                      {/* Image */}
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
                          onClick={() => setSelectedItemQR(item)}
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
                          style={{
                            maxWidth: "100%",
                            maxHeight: "150px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Info */}
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

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="btn"
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              padding: "9px",
                              fontSize: "13px",
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              boxShadow: "0 2px 8px rgba(239,68,68,0.2)",
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
                            onClick={() => setEditingItem(item)}
                            className="btn btn--primary"
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              padding: "9px",
                              fontSize: "13px",
                              borderRadius: "10px",
                            }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              : <div style={{ textAlign: "center", padding: "60px 24px" }}>
                  <p
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: "#64748b",
                      fontSize: "15px",
                      marginBottom: "12px",
                    }}>
                    No items match "<strong>{search}</strong>"
                  </p>
                  <button
                    onClick={() => setSearch("")}
                    className="btn btn--ghost">
                    Clear search
                  </button>
                </div>
              }
            </>
          )}

          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <p className="home-hero__subtitle">
                No items yet. Register your first item to get started!
              </p>
              <button className="btn--cta" onClick={() => {}}>
                + Add your first item
              </button>
            </div>
          )}
        </div>

        {/* Modals & Alerts */}
        <PrintQRModal
          isOpen={!!selectedItemQR}
          onClose={() => setSelectedItemQR(null)}
          qrCodeUrl={selectedItemQR?.qr_code_url}
          itemName={selectedItemQR?.name}
        />
        <EditItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onSaved={(updatedItem) => {
            onItemUpdated(updatedItem);
            setEditingItem(null);
            showAlert(
              `"${updatedItem.name}" was updated successfully.`,
              "success",
            );
          }}
        />
        <DeleteConfirmModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deletingItem?.name}
          loading={deleteLoading}
        />
        <Alert message={alert.message} type={alert.type} onClose={clearAlert} />
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
  const { items, setItems, fetchUserItems, loading } = useGetUserItems();

  useEffect(() => {
    if (user_id) fetchUserItems(user_id);
  }, [user_id]);

  const handleItemUpdated = (updatedItem) =>
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    );

  const handleItemDeleted = (deletedId) =>
    setItems((prev) => prev.filter((i) => i.id !== deletedId));

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
            className="btn btn--ghost"
            style={{ padding: "6px 14px", fontSize: "12px" }}>
            Logout
          </button>
        </div>
      </div>

      <main
        className="main-content"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <PageContent
          page={activePage}
          name={name}
          items={items}
          loading={loading}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      </main>

      <FooterNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default HomePage;
