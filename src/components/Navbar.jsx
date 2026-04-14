import { useNavigate } from "react-router-dom";
import { NAV } from "./navConfig";
import { Logo, PlusIcon } from "./Icons";
import ReportBadge from "./ReportBadge";
import { useReportCount } from "../hooks/useReportCount";
import { useItemCount } from "../hooks/useItemCount";

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
    if (key === "profile") {
      navigate("/profile");
      return;
    }
    navigate(`/${key}`);
  };

  const badgeCounts = {
    reports: reportCount,
    lost: lostCount,
    returned: returnedCount,
  };

  return (
    <nav className="hidden lg:flex items-center justify-between px-6 h-[60px] bg-white border-b border-indigo-100">
      <a href="/home" className="flex items-center gap-2.5 no-underline group">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3730a3)" }}>
          <Logo size={18} color="white" />
        </div>
        <span
          className="text-[17px] font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1d4ed8, #3730a3, #312e81)",
          }}>
          PinPoint
        </span>
      </a>

      <div className="flex items-center gap-1">
        {NAV.map(({ key, label, Icon }) => {
          // eslint-disable-line
          const isActive = activePage === key;
          const count = badgeCounts[key] ?? 0;
          return (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 border"
              style={
                isActive ?
                  {
                    background: "rgba(29,78,216,0.08)",
                    borderColor: "rgba(55,48,163,0.25)",
                    color: "#1d4ed8",
                  }
                : {
                    background: "transparent",
                    borderColor: "transparent",
                    color: "#64748b",
                  }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(29,78,216,0.06)";
                  e.currentTarget.style.color = "#3730a3";
                  e.currentTarget.style.borderColor = "rgba(55,48,163,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}>
              <span className="relative inline-flex">
                <Icon active={isActive} />
                {count > 0 && <ReportBadge count={count} />}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/add-item")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-white text-[13px] font-semibold rounded-lg transition-all duration-150 active:scale-95"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3730a3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          <PlusIcon />
          Add Item
        </button>
        <button
          onClick={onLogout}
          className="px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 border"
          style={{
            color: "#64748b",
            borderColor: "#e2e8f0",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#3730a3";
            e.currentTarget.style.borderColor = "rgba(55,48,163,0.25)";
            e.currentTarget.style.background = "rgba(29,78,216,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.background = "transparent";
          }}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
