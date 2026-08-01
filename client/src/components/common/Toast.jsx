import React from "react";
import { Sparkles } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[200] sv-anim">
      <div className="sv-card px-4 py-3 flex items-center gap-2 text-sm font-medium" style={{ maxWidth: 320 }}>
        <Sparkles size={16} style={{ color: "var(--primary)" }} />
        {toast}
      </div>
    </div>
  );
}
