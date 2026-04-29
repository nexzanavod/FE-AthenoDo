export function Sidebar({ filter, setFilter, counts }) {
  const item = (id, swatch, label, count) => (
    <button className={`side-item ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>
      <span className="swatch" style={{ background: swatch }} />
      {label}
      <span className="count">{count}</span>
    </button>
  );
  return (
    <aside className="sidebar">
      <div className="side-section">
        <h4>Library</h4>
        <div className="side-list">
          {item("all",   "var(--accent)",      "All notes", counts.all)}
          {item("today", "var(--accent-soft)", "Today",     counts.today)}
        </div>
      </div>

      <div className="side-section">
        <h4>By paper</h4>
        <div className="side-list">
          {item("stickies", "var(--paper-yellow)", "Stickies",      counts.stickies)}
          {item("lined",    "var(--paper-cream)",  "Lined",         counts.lined)}
          {item("todos",    "var(--paper-mint)",   "Todo lists",    counts.todos)}
          {item("grid",     "var(--paper-blue)",   "Grid sketches", counts.grid)}
        </div>
      </div>

      <div className="side-tip">
        <strong>Tip.</strong> Pinch or <kbd>⌘</kbd>+<kbd>scroll</kbd> to zoom from day → week → month. Double-click any empty space to drop a note.
      </div>
    </aside>
  );
}
