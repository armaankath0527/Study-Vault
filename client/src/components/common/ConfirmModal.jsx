import React from "react";
import { Save } from "lucide-react";

export default function ConfirmModal({ open, title, body, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="sv-card sv-anim p-6 w-full" style={{ maxWidth: 380 }}>
        <div className="flex items-center gap-2 mb-2">
          <Save size={18} style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>{body}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="sv-btn-ghost px-4 py-2 text-sm">Cancel</button>
          <button onClick={onConfirm} className="sv-btn-primary px-4 py-2 text-sm">Save changes</button>
        </div>
      </div>
    </div>
  );
}
