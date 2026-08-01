import React from "react";

export default function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-medium mb-1 block" style={{ color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}
