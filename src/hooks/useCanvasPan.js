import { useRef, useState } from "react";

export function useCanvasPan() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const panState = useRef({ panning: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".note-chip, .week-note, .paper, .quick-add")) return;
    panState.current = { panning: true, sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y, moved: false };
    stageRef.current?.classList.add("panning");
  };
  const onMouseMove = (e) => {
    if (!panState.current.panning) return;
    const dx = e.clientX - panState.current.sx;
    const dy = e.clientY - panState.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) panState.current.moved = true;
    setPan({ x: panState.current.ox + dx, y: panState.current.oy + dy });
  };
  const onMouseUp = () => {
    panState.current.panning = false;
    stageRef.current?.classList.remove("panning");
  };

  return { pan, setPan, stageRef, onMouseDown, onMouseMove, onMouseUp };
}
