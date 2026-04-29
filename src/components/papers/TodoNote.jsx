import { DateUtil } from "../../utils/dateUtil";
import { TimeSlotPicker } from "./TimeSlotPicker";

export function TodoNote({ note, editable, onChange, big }) {
  const when = new Date(note.when);
  const items = note.items || [];
  const toggle = (i) => {
    if (!onChange) return;
    const next = items.map((x, j) => j === i ? { ...x, done: !x.done } : x);
    onChange({ ...note, items: next });
  };
  const updateText = (i, text) => {
    if (!onChange) return;
    const next = items.map((x, j) => j === i ? { ...x, text } : x);
    onChange({ ...note, items: next });
  };
  return (
    <div className={`paper todo ${big ? "big" : ""}`}>
      {editable
        ? <TimeSlotPicker when={note.when} onChange={(w) => onChange({ ...note, when: w })} />
        : <div className="p-meta">{DateUtil.fmtTimeRange(when, note.duration)}</div>
      }
      {editable ? (
        <input className="p-title-input" value={note.title} onChange={(e) => onChange({ ...note, title: e.target.value })} />
      ) : (
        <div className="p-title">{note.title}</div>
      )}
      <div className="todo-list">
        {items.map((it, i) => (
          <div key={i} className={`todo-item ${it.done ? "done" : ""}`}>
            <span className="check" onClick={(e) => { e.stopPropagation(); toggle(i); }} />
            {editable
              ? <input className="todo-text-input" value={it.text} onChange={(e) => updateText(i, e.target.value)} />
              : <span className="text">{it.text}</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
