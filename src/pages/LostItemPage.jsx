import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetLostItems } from "../hooks/useGetLostItem";
import { useDeleteItem } from "../hooks/useItem";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import EditItemModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import StatsBar from "../components/Statsbar";
import SearchInput from "../components/SearchInput";
import { Logo, PlusIcon } from "../components/Icons";
import { useReportCount } from "../hooks/useReportCount";
import { useGetOwnerReports } from "../hooks/useReport";
import { useItemCount } from "../hooks/useItemcount";
import LostItemCard from "../components/LostItemCard";

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

function LostPageContent({ lostItems, setLostItems, loading }) {
  const [selectedItemQR, setSelectedItemQR] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");

  const { deleteItem, loading: deleteLoading } = useDeleteItem();

  const showAlert = (message, type = "success") => setAlert({ message, type });
  const clearAlert = () => setAlert({ message: "", type: "success" });

  const filteredItems = lostItems.filter(
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
      setLostItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
      showAlert(`"${deletingItem.name}" was deleted successfully.`, "success");
    }
    setDeletingItem(null);
  };

  const stats = [
    { label: "Lost", value: lostItems.length, color: "#f87171" },
    {
      label: "Recent",
      value: lostItems.filter((i) => {
        const diff = (now - new Date(i.created_at)) / (1000 * 60 * 60 * 24); 
        return diff <= 7;
      }).length,
      color: "#fbbf24",
    },
    {
      label: "Oldest",
      value:
        lostItems.length > 0 ?
          Math.floor(
            (now - 
              new Date(
                lostItems.reduce((a, b) =>
                  new Date(a.created_at) < new Date(b.created_at) ? a : b,
                ).created_at,
              )) /
              (1000 * 60 * 60 * 24),
          ) + "d"
        : "—",
      color: "#94a3b8",
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
                Lost Items
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  opacity: 0.82,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Items currently marked as lost — edit or delete them here
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
            placeholder="Search lost items..."
            width="min(360px, 100%)"
          />
        </div>

        {filteredItems.length > 0 ?
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}>
            {filteredItems.map((item) => (
              <LostItemCard
                key={item.id}
                item={item}
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
              {search ? "No matching items" : "No lost items"}
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
              : "Great news — none of your items are marked as lost right now. If something goes missing, mark it as lost from the Homepage."
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
      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSaved={(updatedItem) => {
          setLostItems((prev) =>
            prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
          );
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

function LostItemsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const userId = localStorage.getItem("user_id");

  const { lostItems, setLostItems, fetchLostItems, loading } =
    useGetLostItems();
  const { reports, fetchOwnerReports } = useGetOwnerReports();
  const { setReportCount } = useReportCount();
  const { setLostCount } = useItemCount();

  useEffect(() => {
    if (userId) {
      fetchLostItems(userId);
      fetchOwnerReports(userId);
    }
  }, [userId]);

  useEffect(() => {
    setReportCount(reports.length);
  }, [reports.length]);

  useEffect(() => {
    setLostCount(lostItems.filter((i) => i.status === "lost").length);
  }, [lostItems]);

  const handleSetActivePage = (page) => {
    if (page === "reports") {
      navigate("/reports");
      return;
    }
    if (page === "home") {
      navigate("/home");
      return;
    }
    navigate(`/${page}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}>
      <Navbar
        activePage="lost"
        setActivePage={handleSetActivePage}
        onLogout={logout}
      />

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
        <LostPageContent
          lostItems={lostItems}
          setLostItems={setLostItems}
          loading={loading}
        />
      </main>

      <FooterNav activePage="lost" setActivePage={handleSetActivePage} />
    </div>
  );
}

export default LostItemsPage;
