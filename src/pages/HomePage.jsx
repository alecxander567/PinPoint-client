import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useGetUserItems, useDeleteItem } from "../hooks/useItem";
import { useToggleItemLost } from "../hooks/useItemStatus";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import PrintQRModal from "../components/PrintQRModal";
import EditItemModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Alert from "../components/Alert";
import SkeletonLoader from "../components/SkeletonLoader";
import StatsBar from "../components/Statsbar";
import SearchInput from "../components/SearchInput";
import ItemCard from "../components/ItemCard";
import { Logo, PlusIcon } from "../components/Icons";
import { NAV } from "../components/navConfig";
import "../css/HomePage.css";
import { useGetOwnerReports } from "../hooks/useReport";
import { useReportCount } from "../hooks/useReportCount";

const shimmerStyles = `
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
  .search-input-light:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147,197,253,0.3);
  }
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

function PageContent({ page, items, loading, onItemUpdated, onItemDeleted }) {
  const [selectedItemQR, setSelectedItemQR] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");

  const { deleteItem, loading: deleteLoading } = useDeleteItem();
  const { toggleItemLost, togglingId } = useToggleItemLost();

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

  const handleToggleLost = async (itemId) => {
    const result = await toggleItemLost(itemId);
    if (result.error) {
      showAlert(result.error, "error");
      return;
    }
    onItemUpdated({
      ...items.find((i) => i.id === itemId),
      status: result.status,
    });
    showAlert(
      result.status === "lost" ?
        "Item marked as lost."
      : "Item marked as found.",
      "success",
    );
  };

  if (page !== "home") {
    const labels = {
      lost: "Lost Items",
      returned: "Returned Items",
      activity: "Activity Logs",
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

  if (loading) return <SkeletonLoader />;

  const homeStats = [
    { label: "Items", value: items.length, color: "#fbbf24" },
    {
      label: "Lost",
      value: items.filter((i) => i.status === "lost").length,
      color: "#f87171",
    },
    {
      label: "Found",
      value: items.filter((i) => i.status === "found").length,
      color: "#34d399",
    },
  ];

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 144px)" }}>
      <style>{shimmerStyles}</style>

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
                Homepage
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  opacity: 0.82,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                Manage your registered items and track their status
              </p>
            </div>

            <StatsBar stats={homeStats} />
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px 0",
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
          {items.length > 0 && (
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                fontWeight: "700",
                color: "#0f172a",
                margin: 0,
              }}>
              {search ?
                `Results for "${search}" (${filteredItems.length})`
              : `Your Items (${items.length})`}
            </h2>
          )}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search your items..."
            width="min(300px, 100%)"
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px 40px",
        }}>
        {items.length > 0 && filteredItems.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                togglingId={togglingId}
                onToggleLost={handleToggleLost}
                onEdit={setEditingItem}
                onDelete={setDeletingItem}
                onViewQR={setSelectedItemQR}
              />
            ))}
          </div>
        )}

        {items.length > 0 && filteredItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "#64748b",
                fontSize: "15px",
                marginBottom: "12px",
              }}>
              No items match "<strong>{search}</strong>"
            </p>
            <button onClick={() => setSearch("")} className="btn btn--ghost">
              Clear search
            </button>
          </div>
        )}

        {items.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
              padding: "56px 24px",
              textAlign: "center",
              marginTop: "8px",
            }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "28px",
                color: "#0f172a",
              }}>
              No items yet
            </h2>
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "520px",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
              }}>
              Register your first item to get started. Once added, you can
              generate a QR code and track its status here.
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

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const userId = localStorage.getItem("user_id");

  const [activePage, setActivePage] = useState("home");
  const { items, setItems, fetchUserItems, loading } = useGetUserItems();

  const { reports, fetchOwnerReports } = useGetOwnerReports();
  const { setReportCount } = useReportCount();

  useEffect(() => {
    if (userId) fetchOwnerReports(userId);
  }, [userId]);

  useEffect(() => {
    setReportCount(reports.length);
  }, [reports.length]);

  useEffect(() => {
    if (userId) fetchUserItems(userId);
  }, [userId]);

  useEffect(() => {
    const incoming = location.state?.activePage;
    if (incoming && incoming !== "reports") setActivePage(incoming);
    navigate(location.pathname, { replace: true, state: {} });
  }, []);

  const handleItemUpdated = (updatedItem) =>
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    );

  const handleItemDeleted = (deletedId) =>
    setItems((prev) => prev.filter((i) => i.id !== deletedId));

  const handleSetActivePage = (page) => {
    if (page === "reports") {
      navigate("/reports");
      return;
    }
    setActivePage(page);
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
        activePage={activePage}
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
        <PageContent
          page={activePage}
          items={items}
          loading={loading}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      </main>

      <FooterNav activePage={activePage} setActivePage={handleSetActivePage} />
    </div>
  );
}

export default HomePage;
