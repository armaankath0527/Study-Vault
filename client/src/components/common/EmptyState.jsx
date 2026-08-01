import React from "react";

export default function EmptyState({ emoji, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sv-anim">
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{text}</p>
    </div>
  );
}
