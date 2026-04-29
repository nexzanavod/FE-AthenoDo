import { Fragment, useMemo } from "react";
import { DateUtil } from "../../utils/dateUtil";

const DOWS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const HOUR_PX = 56;
const START_HOUR = 7;

export function WeekView({ anchor, notes, onSelectNote, onCreateAt }) {
  const weekStart = DateUtil.startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
  });
  const today = new Date();
  const hours = Array.from({ length: 14 }, (_, i) => i + START_HOUR);

  const byDay = useMemo(() => {
    const map = {};
    notes.forEach((n) => {
      const dt = new Date(n.when);
      const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      (map[key] ||= []).push(n);
    });
    return map;
  }, [notes]);

  const nowHour = today.getHours() + today.getMinutes() / 60;
  const nowTop = (nowHour - START_HOUR) * HOUR_PX;

  return (
    <Fragment>
      <div className="week-header">
        {days.map((d, i) => (
          <div key={i} className={`week-day-header ${DateUtil.isSameDay(d, today) ? "today" : ""}`}>
            <div className="dow">{DOWS[d.getDay()]}</div>
            <div className="num">{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="week-grid">
        <div className="hour-col">
          {hours.map((h) => {
            const ampm = h >= 12 ? "pm" : "am";
            const h12 = ((h + 11) % 12) + 1;
            return <div key={h} className="hour-row">{h12}{ampm}</div>;
          })}
        </div>
        {days.map((d, di) => {
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const dayNotes = byDay[key] || [];
          const isToday = DateUtil.isSameDay(d, today);
          return (
            <div key={di} className={`week-day-col ${isToday ? "today" : ""}`}
                 onDoubleClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const hourFloat = START_HOUR + clickY / HOUR_PX;
                const h = Math.floor(hourFloat);
                const m = Math.round((hourFloat - h) * 60 / 15) * 15 % 60;
                const dt = new Date(d);
                dt.setHours(Math.min(h, 23), m, 0, 0);
                onCreateAt(dt, e.clientX, e.clientY);
              }}>
              {hours.map((h) => <div key={h} className="hour-cell" />)}
              {isToday && nowTop >= 0 && nowTop < hours.length * HOUR_PX && (
                <div className="now-line" style={{ top: nowTop }} />
              )}
              {dayNotes.map((n) => {
                const dt = new Date(n.when);
                const hourFloat = dt.getHours() + dt.getMinutes() / 60;
                if (hourFloat < START_HOUR - 1 || hourFloat > START_HOUR + hours.length) return null;
                const top = (hourFloat - START_HOUR) * HOUR_PX;
                const height = Math.max(28, ((n.duration || 30) / 60) * HOUR_PX - 4);
                return (
                  <div
                    key={n.id}
                    className="week-note"
                    data-type={n.type === "sticky" ? (n.variant || "yellow") : n.type}
                    style={{ top, height }}
                    onClick={(e) => { e.stopPropagation(); onSelectNote(n); }}
                  >
                    <div className="wn-time">{DateUtil.fmtTimeRange(dt, n.duration)}</div>
                    <div className="wn-title">{n.title}</div>
                    {n.type !== "todo" && n.body && height > 50 && (
                      <div className="wn-body">{n.body}</div>
                    )}
                    {n.type === "todo" && height > 50 && (
                      <div className="wn-body">
                        {n.items.filter(i => !i.done).length} of {n.items.length} left
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
