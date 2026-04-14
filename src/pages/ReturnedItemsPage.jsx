import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetResolvedReports } from "../hooks/useGetResolvedReports";
import { useGetOwnerReports } from "../hooks/useReport";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemCount";
import { RETURNED_SEEN_KEY } from "../components/CountProviderItem";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import SearchInput from "../components/SearchInput";
import ReturnedItemCard from "../components/ReturnedItemCard";
import { Logo, PlusIcon } from "../components/Icons";

const now = Date.now();

function ReturnedPageContent({ resolvedReports, loading }) {
  const [selectedItemQR, setSelectedItemQR] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");

  const clearAlert = () => setAlert({ message: "", type: "success" });

  const filteredReports = resolvedReports.filter((report) => {
    const q = search.toLowerCase();
    return (
      (report.item_name || "").toLowerCase().includes(q) ||
      (report.location || "").toLowerCase().includes(q) ||
      (report.message || "").toLowerCase().includes(q)
    );
  });

  const totalReturned = resolvedReports.length;

  const thisWeekCount = resolvedReports.filter((r) => {
    const diff = (now - new Date(r.created_at)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const uniqueItems = new Set(resolvedReports.map((r) => r.item)).size;

  if (loading) return <SkeletonLoader />;

  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - 144px)" }}>
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
              Returned Items
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              Items that have been successfully found and returned to you
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-nowrap lg:gap-3 lg:ml-auto">
            <div
              className="flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[80px] lg:px-6 lg:min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-white leading-none">
                {totalReturned}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Returned
              </span>
            </div>

            <div
              className="flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[80px] lg:px-6 lg:min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-red-300 leading-none">
                {thisWeekCount}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                This week
              </span>
            </div>

            <div
              className="flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[80px] lg:px-6 lg:min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-emerald-300 leading-none">
                {uniqueItems}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 pt-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {resolvedReports.length > 0 && (
            <h2
              className="text-base font-bold text-slate-800 m-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              {search ?
                `Results for "${search}" (${filteredReports.length})`
              : `Returned Items (${resolvedReports.length})`}
            </h2>
          )}

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search returned items..."
            width="min(300px, 100%)"
          />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 pb-10">
        {resolvedReports.length > 0 && filteredReports.length > 0 && (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}>
            {filteredReports.map((report) => (
              <ReturnedItemCard
                key={report.id}
                report={report}
                onViewQR={setSelectedItemQR}
              />
            ))}
          </div>
        )}

        {resolvedReports.length > 0 && filteredReports.length === 0 && (
          <div className="text-center py-16 px-6">
            <p
              className="text-sm mb-3 text-slate-500"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              No items match "
              <strong className="text-slate-800">{search}</strong>"
            </p>
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
              style={{
                border: "1px solid rgba(99,102,241,0.4)",
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
              }}>
              Clear search
            </button>
          </div>
        )}

        {resolvedReports.length === 0 && (
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
                  d="M20 12V22H4V12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 7H2v5h20V7z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-slate-800 m-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              No returned items yet
            </h2>
            <p
              className="mt-3 mx-auto text-sm leading-relaxed text-slate-500"
              style={{ maxWidth: "480px", fontFamily: "'Nunito', sans-serif" }}>
              Once a finder reports your lost item and you resolve the report,
              it will appear here.
            </p>
          </div>
        )}
      </div>

      <PrintQRModal
        isOpen={!!selectedItemQR}
        onClose={() => setSelectedItemQR(null)}
        qrCodeUrl={selectedItemQR?.qr_code_url}
        itemName={selectedItemQR?.name}
      />
      <Alert message={alert.message} type={alert.type} onClose={clearAlert} />
    </div>
  );
}

function ReturnedItemsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const userId = localStorage.getItem("user_id");

  const { resolvedReports, fetchResolvedReports, loading } =
    useGetResolvedReports();
  const { reports, fetchOwnerReports } = useGetOwnerReports();
  const { setReportCount } = useReportCount();
  const { setReturnedCount } = useItemCount();

  useEffect(() => {
    if (userId) {
      fetchResolvedReports(userId);
      fetchOwnerReports(userId);
    }
  }, [userId]);

  useEffect(() => {
    setReportCount(reports.length);
  }, [reports.length]);

  useEffect(() => {
    if (!resolvedReports.length) return;
    localStorage.setItem(RETURNED_SEEN_KEY, String(resolvedReports.length));
    setReturnedCount(0);
  }, [resolvedReports]);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#f8fafc" }}>
      <Navbar activePage="returned" onLogout={logout} />

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
            PinPoint
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
        <ReturnedPageContent
          resolvedReports={resolvedReports}
          loading={loading}
        />
      </main>

      <FooterNav activePage="returned" />
    </div>
  );
}

export default ReturnedItemsPage;
