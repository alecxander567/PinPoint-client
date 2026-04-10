import { useNavigate } from "react-router-dom";
import { NAV } from "./navConfig";
import { Logo, PlusIcon } from "./Icons";
import ReportBadge from "./ReportBadge";
import { useReportCount } from "../hooks/useReportCount";

function Navbar({ activePage, setActivePage, onLogout }) {
  const navigate = useNavigate();
  const { reportCount } = useReportCount();

  return (
    <nav className="navbar hidden-mobile">
      <a href="/" className="navbar__brand">
        <Logo size={28} />
        <span className="navbar__brand-text">Item Finder</span>
      </a>

      <div className="navbar__links">
        {NAV.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`navbar__link ${activePage === key ? "navbar__link--active" : ""}`}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Icon active={activePage === key} />
              {key === "reports" && <ReportBadge count={reportCount} />}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className="navbar__actions">
        <button
          onClick={() => navigate("/add-item")}
          className="btn btn--primary">
          <PlusIcon />
          Add Item
        </button>
        <button onClick={onLogout} className="btn btn--ghost">
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
