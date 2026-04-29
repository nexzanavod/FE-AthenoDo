import { useState, useEffect, useMemo, useCallback } from "react";
import { DateUtil } from "./utils/dateUtil";
import { ZOOM_LEVELS, WORLD_SIZES } from "./constants";
import { useCanvasPan } from "./hooks/useCanvasPan";
import { useAuth } from "./context/AuthContext";
import { api } from "./lib/api";
import { fromApi, toApi } from "./lib/noteAdapter";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { ZoomControls } from "./components/layout/ZoomControls";
import { Legend } from "./components/layout/Legend";
import { MonthView } from "./components/calendar/MonthView";
import { WeekView } from "./components/calendar/WeekView";
import { DayView } from "./components/calendar/DayView";
import { NoteModal } from "./components/modals/NoteModal";
import { QuickAdd } from "./components/modals/QuickAdd";
import { LoginPage } from "./components/auth/LoginPage";

export default function App() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [zoomIdx, setZoomIdx] = useState(1);
  const [anchor, setAnchor] = useState(new Date());
  const [autoFitKey, setAutoFitKey] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [quickAdd, setQuickAdd] = useState(null);
  const [filter, setFilter] = useState("all");

  const { pan, setPan, stageRef, onMouseDown, onMouseMove, onMouseUp } = useCanvasPan();

  const zoom = ZOOM_LEVELS[zoomIdx];
  const worldSize = WORLD_SIZES[zoom.id];

  // Compute date range for current view to fetch notes
  const fetchRange = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (zoom.id === "day") {
      return { from: fmt(anchor), to: fmt(anchor) };
    }
    if (zoom.id === "week") {
      const start = DateUtil.startOfWeek(anchor);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { from: fmt(start), to: fmt(end) };
    }
    // month — fetch full 6-week grid
    const start = DateUtil.startOfWeek(DateUtil.startOfMonth(anchor));
    const end = new Date(start);
    end.setDate(end.getDate() + 41);
    return { from: fmt(start), to: fmt(end) };
  }, [zoom.id, anchor.getTime()]);

  // Load notes from API whenever view/date changes
  useEffect(() => {
    if (!user) return;
    api.getNotes(fetchRange.from, fetchRange.to)
      .then(data => setNotes((data.notes || data).map(fromApi)))
      .catch(console.error);
  }, [user, fetchRange.from, fetchRange.to]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.max(20, (rect.width - worldSize.w * zoom.scale) / 2);
    const y = Math.max(20, (rect.height - worldSize.h * zoom.scale) / 2);
    setPan({ x, y });
  }, [zoomIdx, autoFitKey]);

  const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < -10 && zoomIdx > 0) setZoomIdx((i) => Math.max(0, i - 1));
      if (e.deltaY > 10 && zoomIdx < 2) setZoomIdx((i) => Math.min(2, i + 1));
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const filteredNotes = useMemo(() => {
    if (filter === "all") return notes;
    if (filter === "today") {
      const t = new Date();
      return notes.filter(n => DateUtil.isSameDay(new Date(n.when), t));
    }
    if (filter === "todos") return notes.filter(n => n.type === "todo");
    if (filter === "stickies") return notes.filter(n => n.type === "sticky");
    if (filter === "lined") return notes.filter(n => n.type === "lined");
    if (filter === "grid") return notes.filter(n => n.type === "grid");
    return notes;
  }, [notes, filter]);

  const counts = useMemo(() => ({
    all: notes.length,
    today: notes.filter(n => DateUtil.isSameDay(new Date(n.when), new Date())).length,
    todos: notes.filter(n => n.type === "todo").length,
    stickies: notes.filter(n => n.type === "sticky").length,
    lined: notes.filter(n => n.type === "lined").length,
    grid: notes.filter(n => n.type === "grid").length,
  }), [notes]);

  const navigate = (dir) => {
    const d = new Date(anchor);
    if (zoom.id === "day") d.setDate(d.getDate() + dir);
    else if (zoom.id === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setAnchor(d);
  };
  const goToday = () => { setAnchor(new Date()); setAutoFitKey(k => k + 1); };

  const handleSave = useCallback(async (updated) => {
    if (updated._isNew) {
      // New note: create on server, then add to list
      try {
        const created = await api.createNote(toApi(updated));
        const saved = fromApi(created.note || created);
        setNotes(ns => [...ns, saved]);
      } catch (err) {
        console.error("Create failed:", err);
      }
    } else {
      // Existing note: update optimistically, sync in background
      setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));
      api.updateNote(updated.id, toApi(updated)).catch(err => console.error("Save failed:", err));
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(ns => ns.filter(n => n.id !== id));
      setSelectedNote(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, []);

  const handleCreateAt = (date, screenX, screenY) => setQuickAdd({ x: screenX, y: screenY, date });

  const handlePickType = (t) => {
    const date = quickAdd.date;
    const when = new Date(date);
    const tmpId = "tmp_" + Date.now();
    const feNote = {
      id: tmpId,
      _isNew: true, // marker — only persisted on Save
      type: t.type,
      variant: t.variant || "yellow",
      when: when.toISOString(),
      duration: 30,
      title: t.type === "todo" ? "New list" : t.type === "grid" ? "New sketch" : "New note",
      body: t.type === "todo" ? "" : t.type === "lined" ? "Start writing…" : "",
      items: t.type === "todo" ? [{ text: "First item", done: false }] : [],
    };
    // Open modal as draft — do NOT add to notes list yet
    setSelectedNote(feNote);
    setQuickAdd(null);
  };

  const dateLabel = useMemo(() => {
    if (zoom.id === "day") return DateUtil.fmtDay(anchor);
    if (zoom.id === "week") return DateUtil.fmtWeekRange(DateUtil.startOfWeek(anchor));
    return DateUtil.fmtMonth(anchor);
  }, [zoom.id, anchor.getTime()]);

  const subLabel = useMemo(() => {
    if (zoom.id !== "day") return null;
    const t = new Date();
    if (DateUtil.isSameDay(anchor, t)) return "Today";
    const diff = Math.round((DateUtil.startOfDay(anchor) - DateUtil.startOfDay(t)) / 86400000);
    return diff === 1 ? "Tomorrow" : diff === -1 ? "Yesterday" : diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
  }, [zoom.id, anchor.getTime()]);

  const worldStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom.scale})`,
    width: worldSize.w,
    height: worldSize.h,
  };

  const onNewNote = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    handleCreateAt(anchor, r.left, r.bottom + 8);
  };

  // Show loading spinner while auth resolves
  if (user === undefined) {
    return <div className="auth-page"><div className="auth-card" style={{ textAlign: "center", color: "var(--ink-500)" }}>Loading…</div></div>;
  }

  // Not logged in → show login screen
  if (!user) return <LoginPage />;

  return (
    <div className="app">
      <Header
        zoomIdx={zoomIdx}
        setZoomIdx={setZoomIdx}
        dateLabel={dateLabel}
        subLabel={subLabel}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        onToday={goToday}
        onNewNote={onNewNote}
      />

      <Sidebar filter={filter} setFilter={setFilter} counts={counts} />

      <main
        className="main"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <div className="canvas-stage" ref={stageRef}>
          <div className="canvas-world" style={worldStyle}>
            {zoom.id === "month" && (
              <MonthView anchor={anchor} notes={filteredNotes} onSelectNote={setSelectedNote} onCreateAt={handleCreateAt} />
            )}
            {zoom.id === "week" && (
              <WeekView anchor={anchor} notes={filteredNotes} onSelectNote={setSelectedNote} onCreateAt={handleCreateAt} />
            )}
            {zoom.id === "day" && (
              <DayView anchor={anchor} notes={filteredNotes} onSelectNote={setSelectedNote} onCreateAt={handleCreateAt} />
            )}
          </div>
        </div>

        <Legend />

        <ZoomControls
          zoomLabel={zoom.label}
          onZoomIn={() => setZoomIdx(i => Math.max(0, i - 1))}
          onZoomOut={() => setZoomIdx(i => Math.min(2, i + 1))}
          onRecenter={() => setAutoFitKey(k => k + 1)}
        />
      </main>

      {quickAdd && (
        <QuickAdd x={quickAdd.x} y={quickAdd.y} onPick={handlePickType} onCancel={() => setQuickAdd(null)} />
      )}

      {selectedNote && (
        <NoteModal note={selectedNote} onSave={handleSave} onDelete={handleDelete} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  );
}
