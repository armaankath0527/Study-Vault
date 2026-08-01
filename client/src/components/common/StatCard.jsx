import React from "react";

export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="sv-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "1F" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-semibold leading-tight">{value}</p>
        <p className="text-[11px]" style={{ color: "var(--muted)" }}>{label}</p>
      </div>
    </div>
  );
}
