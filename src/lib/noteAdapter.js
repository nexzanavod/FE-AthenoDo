// Maps between API shape ↔ frontend shape

// API → FE
export function fromApi(n) {
  return {
    id:       n.id,
    type:     n.type === "pink" || n.type === "lavender" ? "sticky" : n.type,
    variant:  n.type === "pink" ? "pink" : n.type === "lavender" ? "lavender" : "yellow",
    when:     n.date + (n.time ? `T${n.time}` : "T10:00:00"),
    duration: 30,
    title:    n.title || "",
    body:     n.body  || "",
    items:    n.items || [],
  };
}

// FE → API (for create/update)
export function toApi(note) {
  const dt = new Date(note.when);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  const time = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

  // Map sticky variants back to distinct API types
  let type = note.type;
  if (note.type === "sticky") {
    if (note.variant === "pink")     type = "pink";
    else if (note.variant === "lavender") type = "lavender";
    else type = "sticky";
  }

  const payload = { type, date, time, title: note.title || "" };
  if (note.type === "todo") payload.items = note.items || [];
  else payload.body = note.body || "";
  return payload;
}
