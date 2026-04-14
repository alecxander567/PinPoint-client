import { useNavigate } from "react-router-dom";
import { NAV } from "./navConfig";
import ReportBadge from "./ReportBadge";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemCount";
import { RETURNED_SEEN_KEY } from "./CountProviderItem";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: BASE_URL });

const MOBILE_NAV_KEYS = ["home", "lost", "returned", "reports", "profile"];

const badgeKeyMap = (key, { reportCount, lostCount, returnedCount }) => {
  if (key === "reports") return reportCount;
  if (key === "lost") return lostCount;
  if (key === "returned") return returnedCount;
  return 0;
};

function FooterNav({ activePage }) {
  const navigate = useNavigate();
  const { reportCount } = useReportCount();
  const { lostCount, setLostCount, returnedCount, setReturnedCount } =
    useItemCount();

  const handleNavClick = async (key) => {
    const ownerId = localStorage.getItem("user_id");

    if (key === "lost") {
      setLostCount(0);
      navigate("/lost-item");
      return;
    }

    if (key === "returned") {
      if (ownerId) {
        try {
          const res = await api.get("/reports/resolved/", {
            params: { owner_id: ownerId },
          });
          const total = res.data.count ?? res.data.reports?.length ?? 0;
          localStorage.setItem(RETURNED_SEEN_KEY, String(total));
          setReturnedCount(0);
        } catch (err) {
          console.error("Failed to mark returned as seen", err);
        }
      }
      navigate("/returned");
      return;
    }

    if (key === "reports") {
      navigate("/reports");
      return;
    }
    if (key === "home") {
      navigate("/home");
      return;
    }
    if (key === "profile") {
      navigate("/profile");
      return;
    }
    navigate(`/${key}`);
  };

  return (
    <div
      className="lg:hidden flex items-stretch px-1 pt-1.5 pb-3 gap-0.5 fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{ borderTop: "1px solid #e0e7ff" }}>
      {MOBILE_NAV_KEYS.map((key) => {
        const item = NAV.find((n) => n.key === key);
        const isActive = activePage === key;
        const count = badgeKeyMap(key, {
          reportCount,
          lostCount,
          returnedCount,
        });

        return (
          <button
            key={key}
            onClick={() => handleNavClick(key)}
            className="relative flex flex-col items-center gap-0.5 flex-1 pt-1.5 pb-1 rounded-lg transition-all duration-150"
            style={
              isActive ?
                { background: "rgba(29,78,216,0.08)" }
              : { background: "transparent" }
            }
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.background = "rgba(29,78,216,0.05)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}>
            <span className="relative inline-flex">
              <item.Icon active={isActive} />
              {count > 0 && <ReportBadge count={count} />}
            </span>

            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: isActive ? "#1d4ed8" : "#94a3b8" }}>
              {item.label}
            </span>

            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1d4ed8, #3730a3)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FooterNav;
