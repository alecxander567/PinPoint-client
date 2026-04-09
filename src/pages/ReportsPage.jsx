import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetUserItems } from "../hooks/useItem";
import { useGetOwnerReports } from "../hooks/useReport";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import Alert from "../components/Alert";
import { Logo, PlusIcon } from "../components/Icons";

function SkeletonLoader() {
  return (
    <div className="w-full min-h-screen">
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/15 shrink-0" />
            <div className="flex-1">
              <div className="h-7 w-56 mb-2 rounded bg-white/20" />
              <div className="h-4 w-44 rounded bg-white/15" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="h-10 w-full rounded-xl bg-slate-200 mb-6" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-md">
              <div className="h-40 rounded-xl bg-slate-200" />
              <div className="mt-4 h-5 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-28 rounded bg-slate-100" />
              <div className="mt-4 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsContent({
  items,
  reports,
  loading,
  reportsLoading,
  reportsDeleting,
  onDeleteReports,
}) {
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showAlert = (message, type = "success") => setAlert({ message, type });
  const clearAlert = () => setAlert({ message: "", type: "success" });
  const isMobile = viewportWidth < 768;

  const filteredReports = reports.filter((report) => {
    const query = reportSearch.toLowerCase();
    return (
      report.item_name?.toLowerCase().includes(query) ||
      report.location?.toLowerCase().includes(query) ||
      report.message?.toLowerCase().includes(query)
    );
  });

  const allVisibleReportIds = filteredReports.map((report) => report.id);
  const allVisibleSelected =
    allVisibleReportIds.length > 0 &&
    allVisibleReportIds.every((id) => selectedReports.includes(id));

  const toggleReportSelection = (reportId) => {
    setSelectedReports((current) =>
      current.includes(reportId)
        ? current.filter((id) => id !== reportId)
        : [...current, reportId],
    );
  };

  const handleSelectAllReports = () => {
    if (allVisibleSelected) {
      setSelectedReports((current) =>
        current.filter((id) => !allVisibleReportIds.includes(id)),
      );
      return;
    }

    setSelectedReports((current) => [...new Set([...current, ...allVisibleReportIds])]);
  };

  const handleDeleteSelectedReports = async () => {
    const result = await onDeleteReports(selectedReports);
    if (result?.error) {
      showAlert(result.error, "error");
      return;
    }

    const deletedIds = new Set(selectedReports);
    setSelectedReports((current) => current.filter((id) => !deletedIds.has(id)));
    showAlert("Selected reports deleted successfully.", "success");
  };

  if (loading || reportsLoading) return <SkeletonLoader />;

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 144px)" }}>
      <div
        style={{
          background: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
          color: "white",
          padding: "28px 24px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
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
              }}
            >
              <Logo size={28} color="white" />
            </div>

            <div style={{ flex: 1, minWidth: "180px" }}>
              <h1
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontWeight: "800",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                Finder Reports
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  opacity: 0.82,
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Review uploaded landmark photos, locations, and messages for your items
              </p>
            </div>

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
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Reports", value: reports.length, color: "#f87171" },
                {
                  label: "Items",
                  value: new Set(reports.map((r) => r.item)).size,
                  color: "#34d399",
                },
                { label: "Selected", value: selectedReports.length, color: "#fbbf24" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 28px",
                    borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "800",
                      fontSize: "28px",
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.75)",
                      marginTop: "4px",
                      fontWeight: "700",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div style={{ position: "relative", width: "min(360px, 100%)" }}>
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
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search reports..."
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
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
                boxSizing: "border-box",
              }}
            />
            {reportSearch && (
              <button
                onClick={() => setReportSearch("")}
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
                }}
              >
                ×
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleSelectAllReports}
              disabled={!filteredReports.length}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "white",
                color: "#0f172a",
                fontSize: "13px",
                fontWeight: "800",
                cursor: filteredReports.length ? "pointer" : "not-allowed",
              }}
            >
              {allVisibleSelected ? "Unselect All" : "Select All"}
            </button>
            <button
              onClick={handleDeleteSelectedReports}
              disabled={!selectedReports.length || reportsDeleting}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: !selectedReports.length || reportsDeleting ? "#cbd5e1" : "#ef4444",
                color: "white",
                fontSize: "13px",
                fontWeight: "800",
                cursor: !selectedReports.length || reportsDeleting ? "not-allowed" : "pointer",
              }}
            >
              {reportsDeleting
                ? "Deleting..."
                : `Delete Selected${selectedReports.length ? ` (${selectedReports.length})` : ""}`}
            </button>
          </div>
        </div>

        {filteredReports.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(auto-fill, minmax(min(320px, 100%), 320px))"
                : "repeat(auto-fill, minmax(320px, 320px))",
              justifyContent: isMobile ? "center" : "start",
              gap: "18px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {filteredReports.map((report) => (
              <article
                key={report.id}
                style={{
                  background: "white",
                  borderRadius: "22px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                  outline: selectedReports.includes(report.id)
                    ? "3px solid rgba(37,99,235,0.25)"
                    : "none",
                  width: isMobile ? "min(320px, 100%)" : "320px",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    padding: "18px 18px 14px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#0284c7",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {report.item_name}
                    </p>
                    <h3
                      style={{
                        margin: "10px 0 0",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "22px",
                        lineHeight: 1.2,
                        color: "#0f172a",
                      }}
                    >
                      New finder report
                    </h3>
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: "13px",
                        color: "#64748b",
                        fontWeight: 700,
                      }}
                    >
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => toggleReportSelection(report.id)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", marginTop: "2px" }}
                  />
                </div>

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

                <div style={{ padding: "18px" }}>
                  <div style={{ display: "grid", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                        Location
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#334155",
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          maxHeight: "88px",
                          overflow: "auto",
                        }}
                      >
                        {report.location}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                        Message
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#334155",
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          maxHeight: "96px",
                          overflow: "auto",
                        }}
                      >
                        {report.message}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
              padding: "56px 24px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "28px",
                color: "#0f172a",
              }}
            >
              {reportSearch ? "No matching reports" : "No reports yet"}
            </h2>
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "520px",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              {reportSearch
                ? "Try a different search term or clear the report search field."
                : "Once a finder submits a report from your QR page, it will appear here with the uploaded landmark image, shared location, and message."}
            </p>
          </div>
        )}
      </div>

      <Alert message={alert.message} type={alert.type} onClose={clearAlert} />
    </div>
  );
}

function ReportsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const userId = localStorage.getItem("user_id");
  const { items, loading, fetchUserItems } = useGetUserItems();
  const {
    reports,
    loading: reportsLoading,
    deleting: reportsDeleting,
    fetchOwnerReports,
    deleteOwnerReports,
  } = useGetOwnerReports();

  useEffect(() => {
    if (userId) {
      fetchUserItems(userId);
      fetchOwnerReports(userId);
    }
  }, [userId]);

  const handleSetActivePage = (page) => {
    if (page === "reports") return;
    navigate("/home", { state: { activePage: page } });
  };

  const handleDeleteReports = (reportIds) => deleteOwnerReports(userId, reportIds);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar activePage="reports" setActivePage={handleSetActivePage} onLogout={logout} />

      <div className="mobile-header show-mobile">
        <div className="mobile-header__brand">
          <Logo size={24} />
          <span className="mobile-header__brand-text">Item Finder</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => navigate("/add-item")} className="mobile-header__add-btn">
            <PlusIcon />
          </button>
          <button
            onClick={logout}
            className="btn btn--ghost"
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ReportsContent
          items={items}
          reports={reports}
          loading={loading}
          reportsLoading={reportsLoading}
          reportsDeleting={reportsDeleting}
          onDeleteReports={handleDeleteReports}
        />
      </main>

      <FooterNav activePage="reports" setActivePage={handleSetActivePage} />
    </div>
  );
}

export default ReportsPage;
