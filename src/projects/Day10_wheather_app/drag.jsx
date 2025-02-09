import { useState, useRef } from "react";

export default function Draggable({ children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    setDragging(true);
    const rect = ref.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  return (
    <div
      ref={ref}
      className="draggable-window"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
      }}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* children[0] = title bar, children[1] = body */}
      <div onMouseDown={startDrag} style={{ cursor: "move" }}>
        {children[0]}
      </div>
      <div>{children[1]}</div>
    </div>
  );
}
