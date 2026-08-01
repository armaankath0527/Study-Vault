import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="sv-card sv-anim p-6 w-full sv-scroll" style={{ maxWidth: wide ? 560 : 420, maxHeight: "88vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg sv-display">{title}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
