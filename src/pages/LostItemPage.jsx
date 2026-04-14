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
import SearchInput from "../components/SearchInput";
import { Logo, PlusIcon } from "../components/Icons";
import { useReportCount } from "../hooks/useReportCount";
import { useGetOwnerReports } from "../hooks/useReport";
import { useItemCount } from "../hooks/useItemCount";
import LostItemCard from "../components/LostItemCard";

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

  const totalLost = lostItems.length;

  const recentCount = lostItems.filter((i) => {
    const diff = (now - new Date(i.created_at)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const oldestDays =
    lostItems.length > 0 ?
      Math.floor(
        (now -
          new Date(
            lostItems.reduce((a, b) =>
              new Date(a.created_at) < new Date(b.created_at) ? a : b,
            ).created_at,
          )) /
          (1000 * 60 * 60 * 24),
      )
    : null;

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
              Lost Items
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "#bfdbfe", fontFamily: "'Nunito', sans-serif" }}>
              Items currently marked as lost — edit or delete them here
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap lg:ml-auto">
            <div
              className="flex flex-col items-center justify-center px-6 py-3 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-red-300 leading-none">
                {totalLost}
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
              <span className="text-2xl font-bold text-amber-300 leading-none">
                {recentCount}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Recent
              </span>
            </div>

            <div
              className="flex flex-col items-center justify-center px-6 py-3 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span className="text-2xl font-bold text-slate-300 leading-none">
                {oldestDays !== null ? `${oldestDays}d` : "—"}
              </span>
              <span
                className="text-[11px] font-medium mt-1 uppercase tracking-wide"
                style={{ color: "#bfdbfe" }}>
                Oldest
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 pt-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2
            className="text-base font-bold text-slate-800 m-0"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            {search ?
              `Results for "${search}" (${filteredItems.length})`
            : `Lost Items (${lostItems.length})`}
          </h2>

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search lost items..."
            width="min(300px, 100%)"
          />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 pb-10">
        {lostItems.length > 0 && filteredItems.length > 0 && (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}>
            {filteredItems.map((item) => (
              <LostItemCard
                key={item.id}
                item={item}
                onViewQR={setSelectedItemQR}
                onEdit={setEditingItem}
                onDelete={setDeletingItem}
              />
            ))}
          </div>
        )}

        {lostItems.length > 0 && filteredItems.length === 0 && (
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

        {lostItems.length === 0 && (
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
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                <path
                  d="M16.5 16.5L21 21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 11h6M11 8v6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-slate-800 m-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              No lost items
            </h2>
            <p
              className="mt-3 mx-auto text-sm leading-relaxed text-slate-500"
              style={{ maxWidth: "480px", fontFamily: "'Nunito', sans-serif" }}>
              Great news — none of your items are marked as lost right now. If
              something goes missing, mark it as lost from the Homepage.
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
      className="flex flex-col min-h-screen"
      style={{ background: "#f8fafc" }}>
      <Navbar
        activePage="lost"
        setActivePage={handleSetActivePage}
        onLogout={logout}
      />

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
