import { useState } from "react";
import { Icon } from "../Icons";
import { ZOOM_LEVELS } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { Notifications } from "../../lib/notifications";

export function Header({ zoomIdx, setZoomIdx, dateLabel, subLabel, onPrev, onNext, onToday, onNewNote }) {
  const { user, logout } = useAuth();
  const [perm, setPerm] = useState(Notifications.permission());

  const handleBellClick = async () => {
    if (perm === "granted") {
      // Send a test notification
      new Notification("AthenoDo notifications enabled", { body: "You'll be reminded when notes are due.", icon: "/icon-192.png" });
    } else if (perm === "default") {
      const next = await Notifications.requestPermission();
      setPerm(next);
    } else {
      alert("Notifications are blocked. Enable them in your browser site settings.");
    }
  };
  return (
    <header className="header">
      <div className="brand">
        <img src="/Main logo.png" alt="AthenoDo" className="brand-logo" />
        <span className="brand-text">AthenoDo</span>
      </div>

      <div className="zoom-segment" role="tablist">
        {ZOOM_LEVELS.map((z, i) => (
          <button key={z.id} className={i === zoomIdx ? "active" : ""} onClick={() => setZoomIdx(i)}>
            {z.label}
          </button>
        ))}
      </div>

      <button className="icon-btn" onClick={onPrev} title="Previous"><Icon.ChevronLeft /></button>
      <div className="date-label">
        {dateLabel}
        {subLabel && <span className="sub">{subLabel}</span>}
      </div>
      <button className="icon-btn" onClick={onNext} title="Next"><Icon.ChevronRight /></button>
      <button className="icon-btn" onClick={onToday} title="Jump to today"><Icon.Today /></button>

      <div className="header-spacer" />

      <button className="btn-primary" onClick={onNewNote}>
        <Icon.Plus /> <span className="label">New note</span>
      </button>

      {user && Notifications.isSupported() && (
        <button
          className="icon-btn"
          onClick={handleBellClick}
          title={perm === "granted" ? "Notifications enabled — click to test" : perm === "denied" ? "Notifications blocked" : "Enable notifications"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4zM6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {perm === "granted" && <circle cx="12" cy="4" r="2" fill="#3dd68c" />}
            {perm === "denied" && <circle cx="12" cy="4" r="2" fill="#dc6060" />}
          </svg>
        </button>
      )}

      {user && (
        <button className="icon-btn header-logout" onClick={logout} title={`Sign out (${user.email})`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </header>
  );
}
