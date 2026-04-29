import { Fragment, useMemo } from "react";
import { DateUtil } from "../../utils/dateUtil";

const DOWS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function MonthView({ anchor, notes, onSelectNote, onCreateAt }) {
  const monthStart = DateUtil.startOfMonth(anchor);
  const gridStart = DateUtil.startOfWeek(monthStart);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  const today = new Date();

  const byDay = useMemo(() => {
    const map = {};
    notes.forEach((n) => {
      const dt = new Date(n.when);
      const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      (map[key] ||= []).push(n);
    });
    return map;
  }, [notes]);

  return (
    <Fragment>
      <div className="dow-header">
        {DOWS.map((dow) => <span key={dow}>{dow}</span>)}
      </div>
      <div className="month-grid">
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === monthStart.getMonth();
          const isToday = DateUtil.isSameDay(d, today);
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const dayNotes = byDay[key] || [];
          const visible = dayNotes.slice(0, 4);
          const overflow = dayNotes.length - visible.length;
          return (
            <div
              key={i}
              className={`day-cell ${inMonth ? "" : "other-month"} ${isToday ? "today" : ""}`}
              onDoubleClick={(e) => { e.stopPropagation(); const dt = new Date(d); dt.setHours(10, 0, 0, 0); onCreateAt(dt, e.clientX, e.clientY); }}
            >
              <div className="day-num">
                {d.getDate() === 1 && <span className="dow">{d.toLocaleString("en-US",{month:"short"})}</span>}
                <span>{d.getDate()}</span>
                {isToday && <span className="today-pill">TODAY</span>}
              </div>
              <div className="day-notes">
                {visible.map((n) => (
                  <div
                    key={n.id}
                    className="note-chip"
                    data-type={n.type === "sticky" ? (n.variant || "yellow") : n.type}
                    onClick={(e) => { e.stopPropagation(); onSelectNote(n); }}
                  >
                    {n.type === "todo" ? (
                      <span className={`chip-check ${n.items.every((it) => it.done) ? "done" : ""}`} />
                    ) : (
                      <span className="chip-dot" />
                    )}
                    <span className="chip-text">{n.title}</span>
                  </div>
                ))}
                {overflow > 0 && <div className="day-overflow">+{overflow} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
