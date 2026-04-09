import { NAV } from "./navConfig";

const MOBILE_NAV_KEYS = ["home", "lost", "returned", "activity", "reports", "profile"];

function FooterNav({ activePage, setActivePage }) {
  return (
    <div className="footer-nav show-mobile">
      {MOBILE_NAV_KEYS.map((key) => {
        const item = NAV.find((n) => n.key === key);
        const active = activePage === key;
        return (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`footer-nav__item ${active ? "footer-nav__item--active" : ""}`}>
            <item.Icon active={active} />
            <span className="footer-nav__label">{item.label}</span>
            {active && <span className="footer-nav__dot" />}
          </button>
        );
      })}
    </div>
  );
}

export default FooterNav;
