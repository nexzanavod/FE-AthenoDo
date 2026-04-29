import { DateUtil } from "../../utils/dateUtil";
import { TimeSlotPicker } from "./TimeSlotPicker";

export function StickyNote({ note, editable, onChange }) {
  const when = new Date(note.when);
  const variant = note.variant || "";
  const body = note.body || "";
  return (
    <div className={`paper sticky ${variant}`}>
      {editable
        ? <TimeSlotPicker when={note.when} onChange={(w) => onChange({ ...note, when: w })} />
        : <div className="p-meta">{DateUtil.fmtTimeRange(when, note.duration)}</div>
      }
      {editable ? (
        <input className="p-title-input" value={note.title} onChange={(e) => onChange({ ...note, title: e.target.value })} />
      ) : (
        <div className="p-title">{note.title}</div>
      )}
      <div className="p-body">
        {editable ? (
          <textarea className="p-body-input" rows={4} value={body} onChange={(e) => onChange({ ...note, body: e.target.value })} />
        ) : (
          body
        )}
      </div>
    </div>
  );
}
