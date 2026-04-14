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
import SearchInput from "../components/SearchInput";
import ReportCard from "../components/ReportCard";
import { Logo, PlusIcon } from "../components/Icons";

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

  const totalReports = reports.length;
  const uniqueItems = new Set(reports.map((r) => r.item)).size;

  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - 144px)" }}>
      {/* Hero header */}
      <div
        className="px-6 py-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #3730a3 60%, #312e81 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.3)",
        }}>
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 340,
            height: 340,
            top: -90,
            right: -90,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220,
            height: 220,
            bottom: -80,
            left: 40,
            background: "rgba(147,197,253,0.1)",
            filter: "blur(48px)",
          }}
        />

        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-col items-center text-center gap-5 lg:flex-row lg:items-center lg:text-left lg:gap-6">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            <Logo size={28} color="white" />
          </div>

          <div>
            <h1
              className="text-3xl font-extrabold leading-tight tracking-tight m-0 text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Finder Reports
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              Review uploaded landmark photos, locations, and messages for your
              items
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-nowrap lg:gap-3 lg:ml-auto">
            {[
              { value: totalReports, label: "Reports", color: "text-white" },
              { value: uniqueItems, label: "Items", color: "text-red-300" },
              {
                value: selectedReports.length,
                label: "Selected",
                color: "text-emerald-300",
              },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[80px] lg:px-6 lg:min-w-[90px]"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}>
                <span className={`text-2xl font-bold leading-none ${color}`}>
                  {value}
                </span>
                <span
                  className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                  style={{ color: "#bfdbfe" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body — px-4 on mobile, px-8 on sm+, px-10 on lg+ */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* Toolbar */}
        <div className="pt-6 pb-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            {reports.length > 0 && (
              <h2
                className="text-base font-bold text-slate-800 m-0 flex-shrink-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                {reportSearch ?
                  `Results for "${reportSearch}" (${filteredReports.length})`
                : `Reports (${reports.length})`}
              </h2>
            )}

            {/* Search + buttons — left on mobile, right on desktop */}
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              <SearchInput
                value={reportSearch}
                onChange={setReportSearch}
                placeholder="Search reports..."
                width="min(300px, 100%)"
              />

              <button
                onClick={handleSelectAllReports}
                disabled={!filteredReports.length}
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  border: "1px solid #cbd5e1",
                  background: "white",
                  color: "#0f172a",
                  cursor: filteredReports.length ? "pointer" : "not-allowed",
                  opacity: filteredReports.length ? 1 : 0.5,
                  whiteSpace: "nowrap",
                }}>
                {allVisibleSelected ? "Unselect All" : "Select All"}
              </button>

              <button
                onClick={handleDeleteSelectedReports}
                disabled={!selectedReports.length || reportsDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background:
                    !selectedReports.length || reportsDeleting ?
                      "#cbd5e1"
                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none",
                  cursor:
                    !selectedReports.length || reportsDeleting ?
                      "not-allowed"
                    : "pointer",
                  boxShadow:
                    selectedReports.length && !reportsDeleting ?
                      "0 4px 12px rgba(239,68,68,0.3)"
                    : "none",
                  whiteSpace: "nowrap",
                }}>
                {reportsDeleting ?
                  "Deleting..."
                : `Delete${selectedReports.length ? ` (${selectedReports.length})` : ""}`
                }
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="pb-10">
          {reports.length > 0 && filteredReports.length > 0 && (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
          )}

          {reports.length > 0 && filteredReports.length === 0 && (
            <div className="text-center py-16 px-6">
              <p
                className="text-sm mb-3 text-slate-500"
                style={{ fontFamily: "'Nunito', sans-serif" }}>
                No reports match "
                <strong className="text-slate-800">{reportSearch}</strong>"
              </p>
              <button
                onClick={() => setReportSearch("")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                style={{
                  border: "1px solid rgba(99,102,241,0.4)",
                  background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                }}>
                Clear search
              </button>
            </div>
          )}

          {reports.length === 0 && (
            <div
              className="mt-2 rounded-3xl text-center px-6 py-14"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(99,102,241,0.15)",
                boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
              }}>
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                  opacity: 0.85,
                }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 13H8M16 17H8M10 9H8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl font-bold text-slate-800 m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                No reports yet
              </h2>
              <p
                className="mt-3 mx-auto text-sm leading-relaxed text-slate-500"
                style={{
                  maxWidth: "480px",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Once a finder submits a report from your QR page, it will appear
                here with the uploaded landmark image, shared location, and
                message.
              </p>
            </div>
          )}
        </div>
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
      className="flex flex-col min-h-screen"
      style={{ background: "#f8fafc" }}>
      <Navbar activePage="reports" onLogout={logout} />

      <div
        className="flex items-center justify-between px-4 py-3 lg:hidden"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
        <div className="flex items-center gap-2">
          <Logo size={22} color="white" />
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            Item Finder
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/add-item")}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            <PlusIcon />
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}>
            Logout
          </button>
        </div>
      </div>

      <main className="flex flex-1 flex-col pb-16">
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
