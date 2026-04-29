export function Legend() {
  return (
    <div className="legend">
      <span><span className="swatch" style={{background:"var(--paper-yellow)"}} />Sticky</span>
      <span><span className="swatch" style={{background:"var(--paper-cream)"}} />Lined</span>
      <span><span className="swatch" style={{background:"var(--paper-mint)"}} />Todo</span>
      <span><span className="swatch" style={{background:"var(--paper-blue)"}} />Grid</span>
    </div>
  );
}
