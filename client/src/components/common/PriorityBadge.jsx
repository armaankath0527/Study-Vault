import React from "react";

const COLORS = { High: "#C1503E", Medium: "#E8A33D", Low: "#2F9E93" };

export default function PriorityBadge({ priority }) {
  const color = COLORS[priority] || COLORS.Medium;
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: color + "22", color }}>
      {priority}
    </span>
  );
}
