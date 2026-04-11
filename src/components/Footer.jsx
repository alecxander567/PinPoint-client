import { useNavigate } from "react-router-dom";
import { NAV } from "./navConfig";
import ReportBadge from "./ReportBadge";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemCount";
import { RETURNED_SEEN_KEY } from "./CountProviderItem";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const api = axios.create({ baseURL: BASE_URL });

const MOBILE_NAV_KEYS = [
  "home",
  "lost",
  "returned",
  "activity",
  "reports",
  "profile",
];

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
          const res = await api.get("/api/reports/resolved/", {
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

    if (key === "activity" || key === "profile") return;

    navigate(`/${key}`);
  };

  return (
    <div className="footer-nav show-mobile">
      {MOBILE_NAV_KEYS.map((key) => {
        const item = NAV.find((n) => n.key === key);
        const active = activePage === key;
        return (
          <button
            key={key}
            onClick={() => handleNavClick(key)}
            className={`footer-nav__item ${active ? "footer-nav__item--active" : ""}`}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <item.Icon active={active} />
              {key === "reports" && <ReportBadge count={reportCount} />}
              {key === "lost" && <ReportBadge count={lostCount} />}
              {key === "returned" && <ReportBadge count={returnedCount} />}
            </span>
            <span className="footer-nav__label">{item.label}</span>
            {active && <span className="footer-nav__dot" />}
          </button>
        );
      })}
    </div>
  );
}

export default FooterNav;
