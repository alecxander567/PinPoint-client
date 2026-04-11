import { useNavigate } from "react-router-dom";
import { NAV } from "./navConfig";
import { Logo, PlusIcon } from "./Icons";
import ReportBadge from "./ReportBadge";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemcount";

function Navbar({ activePage, onLogout }) {
  const navigate = useNavigate();
  const { reportCount } = useReportCount();
  const { lostCount, returnedCount } = useItemCount();

  const handleNavClick = (key) => {
    if (key === "lost") {
      navigate("/lost-item");
      return;
    }
    if (key === "returned") {
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
    navigate(`/${key}`);
  };

  const renderNavIcon = (Icon, isActive) => <Icon active={isActive} />;

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
            onClick={() => handleNavClick(key)}
            className={`navbar__link ${
              activePage === key ? "navbar__link--active" : ""
            }`}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              {renderNavIcon(Icon, activePage === key)}
              {key === "reports" && reportCount > 0 && (
                <ReportBadge count={reportCount} />
              )}
              {key === "lost" && lostCount > 0 && (
                <ReportBadge count={lostCount} />
              )}
              {key === "returned" && returnedCount > 0 && (
                <ReportBadge count={returnedCount} />
              )}
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
