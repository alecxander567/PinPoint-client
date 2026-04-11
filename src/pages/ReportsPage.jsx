import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetUserItems } from "../hooks/useItem";
import { useGetOwnerReports } from "../hooks/useReport";
import { useResolveReport } from "../hooks/useResolveReport";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemcount";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import StatsBar from "../components/Statsbar";
import SearchInput from "../components/SearchInput";
import ReportCard from "../components/ReportCard";
import { Logo, PlusIcon } from "../components/Icons";

const headerStyles = `
  @media (max-width: 640px) {
    .page-header-inner {
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
    }
    .page-header-text {
      text-align: center !important;
    }
  }
`;

function ReportsContent({
  reports,
  loading,
  reportsLoading,
  reportsDeleting,
  onDeleteReports,
  onReportResolved,
}) {
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);

  const { resolveReport, resolvingId } = useResolveReport();

  const showAlert = (message, type = "success") => setAlert({ message, type });
  const clearAlert = () => setAlert({ message: "", type: "success" });

  const filteredReports = reports.filter((report) => {
    const query = reportSearch.toLowerCase();
    return (
      report.item_name?.toLowerCase().includes(query) ||
      report.location?.toLowerCase().includes(query) ||
      report.message?.toLowerCase().includes(query)
    );
  });

  const allVisibleReportIds = filteredReports.map((r) => r.id);
  const allVisibleSelected =
    allVisibleReportIds.length > 0 &&
    allVisibleReportIds.every((id) => selectedReports.includes(id));

  const toggleReportSelection = (reportId) => {
    setSelectedReports((current) =>
      current.includes(reportId) ?
        current.filter((id) => id !== reportId)
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
    setSelectedReports((current) => [
      ...new Set([...current, ...allVisibleReportIds]),
    ]);
  };

  const handleDeleteSelectedReports = async () => {
    const result = await onDeleteReports(selectedReports);
    if (result?.error) {
      showAlert(result.error, "error");
      return;
    }
    const deletedIds = new Set(selectedReports);
    setSelectedReports((current) =>
      current.filter((id) => !deletedIds.has(id)),
    );
    showAlert("Selected reports deleted successfully.", "success");
  };

  const handleResolveReport = async (reportId, itemName) => {
    const result = await resolveReport(reportId);
    if (result.error) {
      showAlert(result.error, "error");
      return;
    }
    onReportResolved(reportId);
    showAlert(`Report resolved — "${itemName}" marked as found.`, "success");
  };

  if (loading || reportsLoading) return <SkeletonLoader />;

  const reportsStats = [
    { label: "Reports", value: reports.length, color: "#f87171" },
    {
      label: "Items",
      value: new Set(reports.map((r) => r.item)).size,
      color: "#34d399",
    },
    { label: "Selected", value: selectedReports.length, color: "#fbbf24" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 144px)" }}>
      <style>{headerStyles}</style>

      <div
        style={{
          background:
            "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
          color: "white",
          padding: "28px 24px 24px",
        }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            className="page-header-inner"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}>
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

            <div
              className="page-header-text"
              style={{ flex: 1, minWidth: "180px" }}>
              <h1
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontWeight: "800",
                  margin: 0,
                  lineHeight: 1.15,
                }}>
                Finder Reports
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  opacity: 0.82,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Review uploaded landmark photos, locations, and messages for
                your items
              </p>
            </div>

            <StatsBar stats={reportsStats} />
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px 40px",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}>
          <SearchInput
            value={reportSearch}
            onChange={setReportSearch}
            placeholder="Search reports..."
            width="min(360px, 100%)"
          />

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
              }}>
              {allVisibleSelected ? "Unselect All" : "Select All"}
            </button>
            <button
              onClick={handleDeleteSelectedReports}
              disabled={!selectedReports.length || reportsDeleting}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background:
                  !selectedReports.length || reportsDeleting ?
                    "#cbd5e1"
                  : "#ef4444",
                color: "white",
                fontSize: "13px",
                fontWeight: "800",
                cursor:
                  !selectedReports.length || reportsDeleting ?
                    "not-allowed"
                  : "pointer",
              }}>
              {reportsDeleting ?
                "Deleting..."
              : `Delete Selected${selectedReports.length ? ` (${selectedReports.length})` : ""}`
              }
            </button>
          </div>
        </div>

        {filteredReports.length ?
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "18px",
              width: "100%",
              boxSizing: "border-box",
            }}>
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isSelected={selectedReports.includes(report.id)}
                resolvingId={resolvingId}
                onToggleSelect={toggleReportSelection}
                onResolve={handleResolveReport}
              />
            ))}
          </div>
        : <div
            style={{
              background: "white",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
              padding: "56px 24px",
              textAlign: "center",
            }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "28px",
                color: "#0f172a",
              }}>
              {reportSearch ? "No matching reports" : "No reports yet"}
            </h2>
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "520px",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
              }}>
              {reportSearch ?
                "Try a different search term or clear the report search field."
              : "Once a finder submits a report from your QR page, it will appear here with the uploaded landmark image, shared location, and message."
              }
            </p>
          </div>
        }
      </div>

      <Alert message={alert.message} type={alert.type} onClose={clearAlert} />
    </div>
  );
}

function ReportsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const userId = localStorage.getItem("user_id");
  const { setReportCount } = useReportCount();
  const { setReturnedCount, setLostCount } = useItemCount();

  const { items, loading, fetchUserItems } = useGetUserItems();
  const {
    reports,
    setReports,
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

  useEffect(() => {
    setReportCount(reports.length);
  }, [reports.length]);

  const handleDeleteReports = (reportIds) =>
    deleteOwnerReports(userId, reportIds);

  const handleReportResolved = (reportId) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setReturnedCount((prev) => prev + 1);
    setLostCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}>
      <Navbar activePage="reports" onLogout={logout} />

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
        <ReportsContent
          items={items}
          reports={reports}
          loading={loading}
          reportsLoading={reportsLoading}
          reportsDeleting={reportsDeleting}
          onDeleteReports={handleDeleteReports}
          onReportResolved={handleReportResolved}
        />
      </main>

      <FooterNav activePage="reports" />
    </div>
  );
}

export default ReportsPage;
