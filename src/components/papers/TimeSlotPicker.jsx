// Generates slots like "12:00 AM", "12:15 AM" … "11:45 PM"
function buildSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const ampm = h < 12 ? "AM" : "PM";
      const hour = h % 12 || 12;
      const label = `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ label, value });
    }
  }
  return slots;
}

const SLOTS = buildSlots();

export function TimeSlotPicker({ when, onChange }) {
  const d = new Date(when);
  // Round to nearest 15-min slot for current value
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(Math.round(d.getMinutes() / 15) * 15 % 60).padStart(2, "0");
  const value = `${h}:${m}`;

  const handleChange = (e) => {
    const [hh, mm] = e.target.value.split(":");
    const next = new Date(when);
    next.setHours(+hh, +mm, 0, 0);
    onChange(next.toISOString());
  };

  return (
    <select className="p-meta p-time-pick" value={value} onChange={handleChange}>
      {SLOTS.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
