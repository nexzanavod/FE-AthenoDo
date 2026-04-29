import { useMemo } from "react";
import { DateUtil } from "../../utils/dateUtil";
import { PaperNote } from "../papers/PaperNote";

const HOUR_PX = 64;
const START_HOUR = 7;

export function DayView({ anchor, notes, onSelectNote, onCreateAt }) {
  const day = DateUtil.startOfDay(anchor);
  const today = new Date();
  const hours = Array.from({ length: 14 }, (_, i) => i + START_HOUR);

  const dayNotes = useMemo(() => notes
    .filter(n => DateUtil.isSameDay(new Date(n.when), day))
    .sort((a, b) => new Date(a.when) - new Date(b.when))
  , [notes, day.getTime()]);

  const nowHour = today.getHours() + today.getMinutes() / 60;
  const nowTop = (nowHour - START_HOUR) * HOUR_PX;
  const isToday = DateUtil.isSameDay(day, today);

  return (
    <div className="day-view">
      <div className="day-title">
        {day.toLocaleString("en-US", { weekday: "long" })}
        <span className="sub">{day.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
      </div>
      <div className="hour-col">
        {hours.map((h) => {
          const ampm = h >= 12 ? "pm" : "am";
          const h12 = ((h + 11) % 12) + 1;
          return <div key={h} className="hour-row" style={{height: HOUR_PX}}>{h12}{ampm}</div>;
        })}
      </div>
      <div className="day-timeline" onDoubleClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const hourFloat = START_HOUR + clickY / HOUR_PX;
        const h = Math.floor(hourFloat);
        const m = Math.round((hourFloat - h) * 60 / 15) * 15 % 60;
        const dt = new Date(day);
        dt.setHours(Math.min(h, 23), m, 0, 0);
        onCreateAt(dt, e.clientX, e.clientY);
      }}>
        {hours.map((h) => <div key={h} className="hour-cell" style={{height: HOUR_PX}} />)}
        {isToday && nowTop >= 0 && nowTop < hours.length * HOUR_PX && (
          <div className="now-line" style={{ top: nowTop + 10 }} />
        )}
        {dayNotes.map((n) => {
          const dt = new Date(n.when);
          const hourFloat = dt.getHours() + dt.getMinutes() / 60;
          if (hourFloat < START_HOUR - 1 || hourFloat > START_HOUR + hours.length) return null;
          const top = (hourFloat - START_HOUR) * HOUR_PX + 10;
          const height = Math.max(36, ((n.duration || 30) / 60) * HOUR_PX - 6);
          return (
            <div
              key={n.id}
              className="week-note"
              data-type={n.type === "sticky" ? (n.variant || "yellow") : n.type}
              style={{ top, height, left: 12, right: 12 }}
              onClick={(e) => { e.stopPropagation(); onSelectNote(n); }}
            >
              <div className="wn-time">{DateUtil.fmtTimeRange(dt, n.duration)}</div>
              <div className="wn-title">{n.title}</div>
              {n.body && height > 56 && <div className="wn-body">{n.body}</div>}
              {n.type === "todo" && height > 56 && (
                <div className="wn-body">{n.items.filter(i => !i.done).length} of {n.items.length} left</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="day-paper-pile">
        <h4>All notes today</h4>
        {dayNotes.length === 0 && (
          <div style={{fontSize: 12, color: "var(--ink-500)", padding: "8px 4px"}}>No notes yet. Double-click anywhere on the canvas to add one.</div>
        )}
        {dayNotes.map((n) => (
          <div key={n.id} onClick={() => onSelectNote(n)}>
            <PaperNote note={n} />
          </div>
        ))}
      </div>
    </div>
  );
}
