export const DateUtil = {
  startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; },
  startOfWeek(d) { const x = DateUtil.startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() - day); return x; },
  startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); },
  isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  },
  fmtMonth(d) { return d.toLocaleString("en-US", { month: "long", year: "numeric" }); },
  fmtWeekRange(start) {
    const end = new Date(start); end.setDate(end.getDate() + 6);
    const sameMonth = start.getMonth() === end.getMonth();
    if (sameMonth) {
      return `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()} – ${end.toLocaleString("en-US", { month: "short" })} ${end.getDate()}, ${end.getFullYear()}`;
  },
  fmtDay(d) { return d.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" }); },
  fmtTime(d) {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "pm" : "am";
    const h12 = ((h + 11) % 12) + 1;
    return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, "0")}${ampm}`;
  },
  fmtTimeRange(d, durationMin) {
    if (!durationMin) return DateUtil.fmtTime(d);
    const end = new Date(d.getTime() + durationMin * 60000);
    return `${DateUtil.fmtTime(d)} – ${DateUtil.fmtTime(end)}`;
  },
};
