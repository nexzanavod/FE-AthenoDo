import { useEffect } from "react";
import { PAPER_TYPES } from "../../constants";

export function QuickAdd({ x, y, onPick, onCancel }) {
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".quick-add")) onCancel();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onCancel]);
  const px = Math.min(x, window.innerWidth - 320);
  const py = Math.min(y, window.innerHeight - 80);
  return (
    <div className="quick-add" style={{ left: px, top: py }}>
      {PAPER_TYPES.map((t, i) => (
        <button key={i} onClick={() => onPick(t)}>
          <span className={`qa-swatch ${t.swatch}`} />
          <span className="qa-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
