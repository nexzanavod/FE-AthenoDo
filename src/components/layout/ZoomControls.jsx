import { Icon } from "../Icons";

export function ZoomControls({ zoomLabel, onZoomIn, onZoomOut, onRecenter }) {
  return (
    <div className="zoom-controls">
      <button onClick={onZoomIn} title="Zoom in (Day)"><Icon.ZoomIn /></button>
      <div className="divider" />
      <button onClick={onRecenter} title="Recenter"><Icon.Target /></button>
      <div className="divider" />
      <button onClick={onZoomOut} title="Zoom out (Month)"><Icon.ZoomOut /></button>
      <div className="zoom-readout">{zoomLabel.toUpperCase()}</div>
    </div>
  );
}
