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
import SearchInput from "../components/SearchInput";
import ItemCard from "../components/ItemCard";
import { Logo, PlusIcon } from "../components/Icons";
import { NAV } from "../components/navConfig";
import { useGetOwnerReports } from "../hooks/useReport";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemcount";
import "../index.css";

const shimmerStyles = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton-block {
    background: linear-gradient(90deg, #1e3a8a 25%, #3730a3 50%, #1e3a8a 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }
  .skeleton-dark {
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 75%) !important;
    background-size: 600px 100% !important;
    animation: shimmer 1.4s infinite linear !important;
  }
`;

function PageContent({
  page,
  items,
  loading,
  onItemUpdated,
  onItemDeleted,
  onLostCountChange,
}) {
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
    if (result.status === "lost") {
      onLostCountChange((prev) => prev + 1);
    } else {
      onLostCountChange((prev) => Math.max(0, prev - 1));
    }
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
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3730a3)" }}>
          {NAV.find((n) => n.key === page)?.Icon({ active: true })}
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{labels[page]}</h2>
        <p className="text-sm" style={{ color: "#bfdbfe" }}>
          This section is coming soon.
        </p>
      </div>
    );
  }

  if (loading) return <SkeletonLoader />;

  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - 144px)" }}>
      <style>{shimmerStyles}</style>

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
              Homepage
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              Manage your registered items and track their status
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap lg:ml-auto">
            <div
              className="flex flex-col items-center justify-center px-6 py-3 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-white leading-none">
                {items.length}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Items
              </span>
            </div>
            <div
              className="flex flex-col items-center justify-center px-6 py-3 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-red-300 leading-none">
                {items.filter((i) => i.status === "lost").length}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Lost
              </span>
            </div>
            <div
              className="flex flex-col items-center justify-center px-6 py-3 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-emerald-300 leading-none">
                {items.filter((i) => i.status === "found").length}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 pt-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {items.length > 0 && (
            <h2
              className="text-base font-bold text-slate-800 m-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
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

      <div className="max-w-screen-xl mx-auto px-5 pb-10">
        {items.length > 0 && filteredItems.length > 0 && (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
          <div className="text-center py-16 px-6">
            <p
              className="text-sm mb-3"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              No items match "<strong className="text-white">{search}</strong>"
            </p>
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
              }}>
              Clear search
            </button>
          </div>
        )}

        {items.length === 0 && (
          <div
            className="mt-2 rounded-3xl text-center px-6 py-14"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                />
                <path
                  d="M14 14h2v2h-2zM18 14h3M14 18h3M18 18h3v3M14 21h2"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-white m-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              No items yet
            </h2>
            <p
              className="mt-3 mx-auto text-sm leading-relaxed"
              style={{
                maxWidth: "480px",
                color: "#bfdbfe",
                fontFamily: "'Nunito', sans-serif",
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

  const initialPage = location.state?.activePage;
  const activePage =
    initialPage && initialPage !== "reports" ? initialPage : "home";
  const { items, setItems, fetchUserItems, loading } = useGetUserItems();

  const { reports, fetchOwnerReports } = useGetOwnerReports();
  const { setReportCount } = useReportCount();
  const { setLostCount } = useItemCount();

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
    setLostCount(items.filter((i) => i.status === "lost").length);
  }, [items]);
  useEffect(() => {
    navigate(location.pathname, { replace: true, state: {} });
  }, []);

  const handleItemUpdated = (updatedItem) =>
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    );

  const handleItemDeleted = (deletedId) =>
    setItems((prev) => prev.filter((i) => i.id !== deletedId));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activePage={activePage} onLogout={logout} />

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
        <PageContent
          page={activePage}
          items={items}
          loading={loading}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
          onLostCountChange={setLostCount}
        />
      </main>

      <FooterNav activePage={activePage} />
    </div>
  );
}

export default HomePage;
