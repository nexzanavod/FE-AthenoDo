// Notification scheduler for note reminders.
// Uses the Notification API + setTimeout. Survives across renders via module-level Map.

const timers = new Map(); // noteId → timeoutId
const fired = new Set();  // noteIds already fired this session

export const Notifications = {
  isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  },

  permission() {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission; // "granted" | "denied" | "default"
  },

  async requestPermission() {
    if (!this.isSupported()) return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return await Notification.requestPermission();
  },

  fire(note) {
    if (this.permission() !== "granted") return;
    if (fired.has(note.id)) return;
    fired.add(note.id);

    const title = note.title || "Reminder";
    const bodyText =
      note.type === "todo"
        ? `${(note.items || []).filter(i => !i.done).length} task(s) pending`
        : (note.body || "").slice(0, 100);

    try {
      const n = new Notification(`📝 ${title}`, {
        body: bodyText,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: note.id,
        requireInteraction: false,
      });
      n.onclick = () => { window.focus(); n.close(); };
    } catch (err) {
      console.error("Notification failed:", err);
    }
  },

  schedule(note) {
    if (this.permission() !== "granted") return;
    if (timers.has(note.id)) {
      clearTimeout(timers.get(note.id));
      timers.delete(note.id);
    }
    const when = new Date(note.when).getTime();
    const delay = when - Date.now();
    // Skip notes in the past or too far in the future (>24 days = setTimeout overflow)
    if (delay < 0 || delay > 2_073_600_000) return;
    const id = setTimeout(() => {
      this.fire(note);
      timers.delete(note.id);
    }, delay);
    timers.set(note.id, id);
  },

  scheduleAll(notes) {
    notes.forEach(n => this.schedule(n));
  },

  cancel(noteId) {
    if (timers.has(noteId)) {
      clearTimeout(timers.get(noteId));
      timers.delete(noteId);
    }
  },

  cancelAll() {
    timers.forEach(id => clearTimeout(id));
    timers.clear();
  },
};
