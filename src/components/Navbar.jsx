import { useNavigate } from "react-router-dom"; 
import { NAV } from "./navConfig";
import { Logo, PlusIcon } from "./Icons";

function Navbar({ activePage, setActivePage, onLogout }) {
  const navigate = useNavigate(); 

  return (
    <nav className="navbar hidden-mobile">
      {/* Brand */}
      <a href="/" className="navbar__brand">
        <Logo size={28} />
        <span className="navbar__brand-text">Item Finder</span>
      </a>

      {/* Nav links */}
      <div className="navbar__links">
        {NAV.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`navbar__link ${activePage === key ? "navbar__link--active" : ""}`}>
            <Icon active={activePage === key} />
            {label}
          </button>
        ))}
      </div>

      {/* Right actions - FIXED */}
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
