import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetResolvedReports } from "../hooks/useGetResolvedReports";
import { useGetOwnerReports } from "../hooks/useReport";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemcount";
import { RETURNED_SEEN_KEY } from "../components/CountProviderItem";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import StatsBar from "../components/Statsbar";
import SearchInput from "../components/SearchInput";
import ReturnedItemCard from "../components/ReturnedItemCard";
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

  const stats = [
    { label: "Returned", value: resolvedReports.length, color: "#34d399" },
    {
      label: "This week",
      value: resolvedReports.filter((r) => {
        const diff = (now - new Date(r.created_at)) / (1000 * 60 * 60 * 24); 
        return diff <= 7;
      }).length,
      color: "#fbbf24",
    },
    {
      label: "Items",
      value: new Set(resolvedReports.map((r) => r.item)).size,
      color: "#60a5fa",
    },
  ];

  if (loading) return <SkeletonLoader />;

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
                Returned Items
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  opacity: 0.82,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Items that have been successfully found and returned to you
              </p>
            </div>

            <StatsBar stats={stats} />
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
            value={search}
            onChange={setSearch}
            placeholder="Search returned items..."
            width="min(360px, 100%)"
          />
        </div>

        {filteredReports.length > 0 ?
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}>
            {filteredReports.map((report) => (
              <ReturnedItemCard
                key={report.id}
                report={report}
                onViewQR={setSelectedItemQR}
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
              {search ? "No matching items" : "No returned items yet"}
            </h2>
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "520px",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
              }}>
              {search ?
                "Try a different search term or clear the search field."
              : "Once a finder reports your lost item and you resolve the report, it will appear here."
              }
            </p>
          </div>
        }
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
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}>
      <Navbar activePage="returned" onLogout={logout} />

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
