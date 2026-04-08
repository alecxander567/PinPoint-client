import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useLogout } from "../hooks/auth";
import Navbar from "../components/Navbar";
import FooterNav from "../components/Footer";
import { Logo, PlusIcon } from "../components/Icons";
import { NAV } from "../components/navConfig";
import "../css/HomePage.css";

/* ── Page Content ───────────────────────────────────────── */
function PageContent({ page, name, onAddItem }) {
  if (page === "home") {
    return (
      <div className="home-hero">
        <div className="home-hero__avatar">
          <div className="home-hero__avatar-ring">
            <Logo size={40} />
          </div>
          <span className="home-hero__status-dot" />
        </div>

        <h1 className="home-hero__title">Welcome back, {name}!</h1>
        <p className="home-hero__subtitle">
          Helping your community recover lost items. Use the navigation to get
          started.
        </p>

        <div className="home-hero__stats">
          {[
            { label: "Your Items", value: "0", accent: "#2563eb" },
            { label: "Matches Found", value: "0", accent: "#16a34a" },
            { label: "Reports", value: "0", accent: "#d97706" },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="stat-card__value" style={{ color: c.accent }}>
                {c.value}
              </div>
              <div className="stat-card__label">{c.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onAddItem} className="btn--cta">
          <PlusIcon />
          Register an Item
        </button>
      </div>
    );
  }

  const labels = {
    lost: "Lost Items",
    returned: "Returned Items",
    activity: "Activity Logs",
    reports: "Reports",
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

/* ── Main Component ─────────────────────────────────────── */
function HomePage() {
  const navigate = useNavigate(); 
  const { logout } = useLogout();
  const name = localStorage.getItem("name") || "User";
  const [activePage, setActivePage] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Desktop Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={logout}
      />

      {/* Mobile Header */}
      <div className="mobile-header show-mobile">
        <div className="mobile-header__brand">
          <Logo size={24} />
          <span className="mobile-header__brand-text">Item Finder</span>
        </div>
        <button
          onClick={() => navigate("/add-item")}
          className="mobile-header__add-btn">
          <PlusIcon />
        </button>
      </div>

      {/* Page Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "80px",
        }}
        className="main-content">
        <PageContent
          page={activePage}
          name={name}
          onAddItem={() => navigate("/add-item")} 
        />
      </main>

      {/* Mobile Footer Nav */}
      <FooterNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default HomePage;
